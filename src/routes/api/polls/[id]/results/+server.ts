import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import createPoll from 'maju';

// GET /api/polls/[id]/results - Get poll results
export const GET: RequestHandler = async ({ params }) => {
	try {
		// Fetch poll with votes
		const poll = await db.poll.findUnique({
			where: { id: params.id },
			include: {
				votes: true
			}
		});

		if (!poll) {
			return json({ error: 'Poll not found' }, { status: 404 });
		}

		const candidates = JSON.parse(poll.candidates) as string[];
		const grades = JSON.parse(poll.grades) as string[];

		// If no votes yet, return empty results
		if (poll.votes.length === 0) {
			return json({
				pollId: poll.id,
				title: poll.title,
				totalVotes: 0,
				candidates: candidates.map((name) => ({
					name,
					medianGrade: null,
					medianGradeLabel: null,
					rank: null
				})),
				ranking: []
			});
		}

		// Convert votes to maju format
		// maju expects: array of ballots, where each ballot an object mapping candidate names to grade indices
		const ballots: Record<string, number>[] = poll.votes.map((vote) => {
			const ballot = JSON.parse(vote.ballot) as Record<string, number>;
			return ballot;
		});

		// Calculate results using maju
		const mj = createPoll(candidates, {
			GRADING_LEVELS: grades.length
		});
		mj.addVotes(ballots);
		const results = mj.getResults();

		// Format results
		const ranking = results
			.map((option) => ({
				rank: option.rank,
				name: option.name,
				medianGrade: option.medianGrade,
				medianGradeLabel: grades[option.medianGrade],
			}))

		// Create a map for easy lookup
		const candidateResults = candidates.map((name) => {
			const result = ranking.find((r) => r.name === name);
			return {
				name,
				medianGrade: result?.medianGrade ?? null,
				medianGradeLabel: result?.medianGradeLabel ?? null,
				rank: result?.rank ?? null,
			};
		});

		return json({
			pollId: poll.id,
			title: poll.title,
			description: poll.description,
			totalVotes: poll.votes.length,
			candidates: candidateResults,
			ranking,
			grades
		});
	} catch (error) {
		console.error('Error calculating results:', error);
		return json({ error: 'Failed to calculate results' }, { status: 500 });
	}
};
