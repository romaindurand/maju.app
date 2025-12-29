import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { POPULARITY_COEFFS } from '$lib/config';

// GET /api/polls/popular - List popular public polls with computed score
export const GET: RequestHandler = async () => {
  try {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Fetch recent public polls (limit to reduce per-poll aggregation queries)
    const polls = await db.poll.findMany({
      where: { isPublic: true },
      orderBy: { createdAt: 'desc' },
      take: 200,
      select: {
        id: true,
        title: true,
        description: true,
        options: true, // JSON string
        createdAt: true,
        expiresAt: true
      }
    });

    const results = await Promise.all(
      polls.map(async (poll) => {
        const totalVotes = await db.vote.count({ where: { pollId: poll.id } });
        const recentVotes = await db.vote.count({
          where: { pollId: poll.id, createdAt: { gte: twentyFourHoursAgo } }
        });
        const lastVote = await db.vote.findFirst({
          where: { pollId: poll.id },
          orderBy: { createdAt: 'desc' },
          select: { createdAt: true }
        });

        // Parse options
        let options: string[] = [];
        try {
          options = JSON.parse(poll.options ?? '[]');
          if (!Array.isArray(options)) options = [];
        } catch {
          options = [];
        }

        const ageHours = Math.max(
          0,
          (now.getTime() - poll.createdAt.getTime()) / (1000 * 60 * 60)
        );
        // recent creation -> closer to 1
        const creationFreshness = 1 / (1 + ageHours);

        //
        const lastVoteHours = lastVote
          ? (now.getTime() - lastVote.createdAt.getTime()) / (1000 * 60 * 60)
          : null;
        const lastVoteRecency = lastVoteHours === null ? 0 : 1 / (1 + Math.max(0, lastVoteHours));

        const score =
          POPULARITY_COEFFS.creationFreshness * creationFreshness +
          POPULARITY_COEFFS.totalVotes * totalVotes +
          POPULARITY_COEFFS.votesLast24h * recentVotes +
          POPULARITY_COEFFS.lastVoteRecency * lastVoteRecency;

        return {
          id: poll.id,
          title: poll.title,
          description: poll.description,
          options,
          createdAt: poll.createdAt,
          expiresAt: poll.expiresAt,
          totalVotes,
          recentVotes,
          lastVoteAt: lastVote?.createdAt || null,
          score
        };
      })
    );

    // Sort by score descending and return top 5
    results.sort((a, b) => b.score - a.score);
    return json(results.slice(0, 5));
  } catch (error) {
    console.error('Error fetching popular polls:', error);
    return json({ error: 'Failed to fetch popular polls' }, { status: 500 });
  }
};
