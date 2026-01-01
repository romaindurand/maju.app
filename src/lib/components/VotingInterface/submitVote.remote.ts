import { command, form, getRequestEvent } from '$app/server';
import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { VOTER_CONFIG } from '$lib/config';
import { z } from 'zod';

// Form schema: JSON payload (string) for minimal integration
const PayloadSchema = z.object({ payload: z.string() });

// Command schema: direct typed args
const VoteSchema = z.object({
  pollId: z.string().min(1),
  voterIdentifier: z.string().min(1, 'Voter identifier is required'),
  fingerprint: z.string().regex(/^[a-f0-9]{64}$/i, 'Invalid fingerprint format'),
  ballot: z.record(z.string(), z.number().int().nonnegative()),
  name: z.string().trim().max(80).optional()
});

async function processVote(input: z.infer<typeof VoteSchema>) {
  const poll = await db.poll.findUnique({ where: { id: input.pollId } });
  if (!poll) error(404, 'Poll not found');

  if (poll.expiresAt && new Date() > poll.expiresAt) {
    error(403, 'Le sondage est terminé');
  }

  if (poll.askName) {
    const rawName = input.name?.trim() ?? '';
    if (!rawName) error(400, 'Le prénom est requis pour voter');
    if (rawName.length > 80) error(400, 'Le prénom est trop long');
  }

  if (poll.preventMultipleVotes) {
    const existingVote = await db.vote.findFirst({
      where: {
        pollId: input.pollId,
        OR: [{ voterIdentifier: input.voterIdentifier }, { fingerprint: input.fingerprint }]
      }
    });
    if (existingVote) error(409, 'You have already voted on this poll');
  }

  const options = JSON.parse(poll.options) as string[];
  const grades = JSON.parse(poll.grades) as string[];

  for (const option of options) {
    if (!(option in input.ballot)) {
      error(400, `Missing grade for option: ${option}`);
    }
    const gradeIndex = input.ballot[option];
    if (typeof gradeIndex !== 'number' || gradeIndex < 0 || gradeIndex >= grades.length) {
      error(400, `Invalid grade for option: ${option}`);
    }
  }

  const vote = await db.vote.create({
    data: {
      pollId: input.pollId,
      ballot: JSON.stringify(input.ballot),
      voterIdentifier: input.voterIdentifier,
      fingerprint: input.fingerprint
    }
  });

  if (poll.askName && typeof input.name === 'string') {
    const firstName = input.name.trim();
    if (firstName) {
      try {
        const existing = Array.isArray(JSON.parse(poll.participants as unknown as string))
          ? (JSON.parse(poll.participants as unknown as string) as string[])
          : [];
        const updated = [...existing, firstName];
        await db.poll.update({ where: { id: poll.id }, data: { participants: JSON.stringify(updated) } });
      } catch {
        await db.poll.update({ where: { id: poll.id }, data: { participants: JSON.stringify([firstName]) } });
      }
    }
  }

  // Set cookie for additional tracking (allowed in command/form)
  const { cookies } = getRequestEvent();
  const cookieToken = crypto.randomUUID();
  cookies.set(VOTER_CONFIG.cookieName, cookieToken, {
    path: '/',
    maxAge: VOTER_CONFIG.cookieMaxAge,
    httpOnly: true,
    sameSite: 'lax'
  });

  return { success: true, voteId: vote.id };
}

export const submitVoteCommand = command(VoteSchema, async (data) => {
  return processVote(data);
});

export const submitVoteForm = form(PayloadSchema, async ({ payload }) => {
  let parsed: z.infer<typeof VoteSchema>;
  try {
    parsed = VoteSchema.parse(JSON.parse(payload));
  } catch {
    error(400, 'Invalid payload');
  }
  return processVote(parsed);
});
