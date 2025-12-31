import { query } from '$app/server';
import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { POPULARITY_COEFFS } from '$lib/config';
import createPoll from 'maju';
import { z } from 'zod';

export const getPopularPolls = query(async () => {
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const polls = await db.poll.findMany({
    where: { isPublic: true },
    orderBy: { createdAt: 'desc' },
    take: 200,
    select: { id: true, title: true, description: true, options: true, createdAt: true, expiresAt: true }
  });

  const results = await Promise.all(
    polls.map(async (poll) => {
      const totalVotes = await db.vote.count({ where: { pollId: poll.id } });
      const recentVotes = await db.vote.count({ where: { pollId: poll.id, createdAt: { gte: twentyFourHoursAgo } } });
      const lastVote = await db.vote.findFirst({ where: { pollId: poll.id }, orderBy: { createdAt: 'desc' }, select: { createdAt: true } });

      let options: string[] = [];
      try {
        options = JSON.parse(poll.options ?? '[]');
        if (!Array.isArray(options)) options = [];
      } catch {
        options = [];
      }

      const ageHours = Math.max(0, (now.getTime() - poll.createdAt.getTime()) / (1000 * 60 * 60));
      const creationFreshness = 1 / (1 + ageHours);
      const lastVoteHours = lastVote ? (now.getTime() - lastVote.createdAt.getTime()) / (1000 * 60 * 60) : null;
      const lastVoteRecency = lastVoteHours === null ? 0 : 1 / (1 + Math.max(0, lastVoteHours));

      const score =
        POPULARITY_COEFFS.creationFreshness * creationFreshness +
        POPULARITY_COEFFS.totalVotes * totalVotes +
        POPULARITY_COEFFS.votesLast24h * recentVotes +
        POPULARITY_COEFFS.lastVoteRecency * lastVoteRecency;

      return { id: poll.id, title: poll.title, description: poll.description, options, createdAt: poll.createdAt, expiresAt: poll.expiresAt, totalVotes, recentVotes, lastVoteAt: lastVote?.createdAt || null, score };
    })
  );

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, 5);
});

const PollIdSchema = z.string().min(1);

export const getPoll = query(PollIdSchema, async (id) => {
  const poll = await db.poll.findUnique({ where: { id }, include: { votes: true } });
  if (!poll) error(404, 'Poll not found');

  const expiresAt = poll.expiresAt; // null means no time limit
  const isExpired = expiresAt ? new Date() > expiresAt : false;
  const voteCount = poll.votes?.length ?? 0;

  let participants: string[] | undefined;
  if (voteCount >= 2) {
    try {
      const stored = JSON.parse((poll as unknown as { participants?: string }).participants ?? '[]') as string[];
      if (poll.showParticipants === 'always') {
        participants = stored.filter((n) => typeof n === 'string' && n.trim().length > 0);
      } else if (poll.showParticipants === 'after_expiration' && isExpired) {
        participants = stored.filter((n) => typeof n === 'string' && n.trim().length > 0);
      }
    } catch {
      // ignore parsing errors
    }
  }

  return {
    id: poll.id,
    title: poll.title,
    description: poll.description,
    options: JSON.parse(poll.options),
    grades: JSON.parse(poll.grades),
    preventMultipleVotes: poll.preventMultipleVotes,
    askName: poll.askName,
    showParticipants: poll.showParticipants as "always" | "after_expiration" | "never",
    createdAt: poll.createdAt,
    updatedAt: poll.updatedAt,
    expiresAt,
    hideResultsUntilExpiration: poll.hideResultsUntilExpiration,
    isExpired,
    voteCount,
    isPublic: poll.isPublic,
    participants,
  };
});

export const getPollResults = query(PollIdSchema, async (id) => {
  const poll = await db.poll.findUnique({ where: { id }, include: { votes: true } });
  if (!poll) error(404, 'Poll not found');

  const options = JSON.parse((poll as unknown as { options: string }).options) as string[];
  const grades = JSON.parse(poll.grades) as string[];
  const expiresAt = poll.expiresAt;
  const isExpired = expiresAt ? new Date() > expiresAt : false;
  const hideResultsUntilExpiration = poll.hideResultsUntilExpiration ?? false;

  let participants: string[] | undefined;
  if (poll.votes.length >= 2) {
    try {
      const stored = JSON.parse(poll.participants ?? '[]') as string[];
      if (poll.showParticipants === 'always') {
        participants = stored.filter((n) => typeof n === 'string' && n.trim().length > 0);
      } else if (poll.showParticipants === 'after_expiration' && isExpired) {
        participants = stored.filter((n) => typeof n === 'string' && n.trim().length > 0);
      }
    } catch (e) {
      console.error('Failed to parse participants', e);
    }
  }

  const ballots: Record<string, number>[] = poll.votes.map((vote: { ballot: string }) => {
    const ballot = JSON.parse(vote.ballot as string) as Record<string, number>;
    return ballot;
  });

  const mj = createPoll(options, { GRADING_LEVELS: grades.length });
  mj.addVotes(ballots);
  const results = mj.getResults();

  const distributions: Record<string, { gradeIndex: number; label: string; count: number; percentage: number }[]> = {};
  for (const option of results) {
    const name = option.name;
    const optDist = option.distribution ?? [];
    distributions[name] = optDist.map((d, gradeIndex) => ({
      gradeIndex,
      label: grades[gradeIndex],
      count: d.count,
      percentage: Math.round((d.percentage ?? 0) * 10000) / 100
    }));
  }

  const ranking = results.map((option) => ({
    rank: option.rank,
    name: option.name,
    medianGrade: option.medianGrade,
    medianGradeLabel: grades[option.medianGrade],
    distribution: distributions[option.name]
  }));

  const optionResults = options.map((name) => {
    const result = ranking.find((r) => r.name === name);
    return {
      name,
      medianGrade: result?.medianGrade ?? null,
      medianGradeLabel: result?.medianGradeLabel ?? null,
      rank: result?.rank ?? null,
      distribution: distributions[name]
    };
  });

  return {
    pollId: poll.id,
    title: poll.title,
    description: poll.description,
    totalVotes: poll.votes.length,
    expiresAt,
    isExpired,
    askName: poll.askName,
    showParticipants: poll.showParticipants as "always" | "after_expiration" | "never",
    hideResultsUntilExpiration,
    options: optionResults,
    ranking,
    grades,
    participants,
  };
});
