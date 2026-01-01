import { form } from '$app/server';
import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { DEFAULT_GRADES } from '$lib/config';
import { z } from 'zod';

// Schema côté formulaire: charge utile JSON encodée en string (dégradation progressive minimale)
const PayloadSchema = z.object({ payload: z.string() });

// Validation complète de la création de sondage
const CreatePollSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  description: z.string().trim().max(1000).optional().nullable(),
  options: z.array(z.string().trim().min(1)).min(2, 'At least 2 options are required'),
  grades: z.array(z.string().trim().min(1)).optional(),
  preventMultipleVotes: z.boolean().optional(),
  isPublic: z.boolean().optional(),
  askName: z.boolean().optional(),
  showParticipants: z.enum(['always', 'after_expiration', 'never']).optional(),
  hideResultsUntilExpiration: z.boolean().optional(),
  // expiration
  noTimeLimit: z.boolean().optional(),
  expiresAt: z.string().datetime().optional(),
  durationSeconds: z.number().int().nonnegative().optional()
});

function computeExpiration(input: z.infer<typeof CreatePollSchema>): Date | null {
  const now = new Date();
  if (input.noTimeLimit) return null;
  if (input.expiresAt) {
    const d = new Date(input.expiresAt);
    if (!isNaN(d.getTime())) {
      // min +1 minute
      const minFuture = new Date(now.getTime() + 60 * 1000);
      if (d < minFuture) error(400, 'Expiration invalide: doit être au moins dans 1 minute.');
      return d;
    }
  }
  if (typeof input.durationSeconds === 'number' && isFinite(input.durationSeconds)) {
    const ms = Math.max(0, Math.floor(input.durationSeconds) * 1000);
    const d = new Date(now.getTime() + ms);
    const minFuture = new Date(now.getTime() + 60 * 1000);
    if (d < minFuture) error(400, 'Expiration invalide: doit être au moins dans 1 minute.');
    return d;
  }
  // défaut 24h
  const d = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  return d;
}

// Remote Form: création de sondage
export const createPoll = form(PayloadSchema, async ({ payload }) => {
  let parsed: z.infer<typeof CreatePollSchema>;
  try {
    parsed = CreatePollSchema.parse(JSON.parse(payload));
  } catch {
    error(400, 'Invalid payload');
  }

  const grades = parsed.grades && parsed.grades.length > 0 ? parsed.grades : DEFAULT_GRADES;
  const preventMultipleVotes = typeof parsed.preventMultipleVotes === 'boolean' ? parsed.preventMultipleVotes : true;
  const isPublic = typeof parsed.isPublic === 'boolean' ? parsed.isPublic : false;
  const askName = typeof parsed.askName === 'boolean' ? parsed.askName : false;
  const hideResultsUntilExpiration = typeof parsed.hideResultsUntilExpiration === 'boolean' ? parsed.hideResultsUntilExpiration : false;
  const allowedShowValues = ['always', 'after_expiration', 'never'] as const;
  const showParticipants = allowedShowValues.includes(parsed.showParticipants ?? 'never')
    ? (parsed.showParticipants as (typeof allowedShowValues)[number])
    : 'never';

  const expiresAt = computeExpiration(parsed);

  const poll = await db.poll.create({
    data: {
      title: parsed.title.trim(),
      description: parsed.description?.trim() || null,
      options: JSON.stringify(parsed.options.map((c) => c.trim())),
      grades: JSON.stringify(grades),
      preventMultipleVotes,
      isPublic,
      expiresAt,
      askName,
      showParticipants,
      hideResultsUntilExpiration
    }
  });

  return { id: poll.id };
});
