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

		const options = JSON.parse((poll as unknown as { options: string }).options) as string[];
		const grades = JSON.parse(poll.grades) as string[];
		const expiresAt = poll.expiresAt; // null means no time limit
		const isExpired = expiresAt ? new Date() > expiresAt : false;

		// Build participants list depending on configuration
		let participants: string[] | undefined;
		if (poll.votes.length >= 2) {
			if (poll.showParticipants === 'always') {
				participants = poll.votes.map((v) => (v.name || '').trim()).filter((n) => n.length > 0);
			} else if (poll.showParticipants === 'after_expiration' && isExpired) {
				participants = poll.votes.map((v) => (v.name || '').trim()).filter((n) => n.length > 0);
			}
		}

		// If no votes yet, return empty results
		if (poll.votes.length === 0) {
			return json({
				pollId: poll.id,
				title: poll.title,
				totalVotes: 0,
				description: poll.description,
				expiresAt,
				isExpired,
				options: options.map((name) => ({
					name,
					medianGrade: null,
					medianGradeLabel: null,
					rank: null
				})),
				ranking: [],
				...(participants ? { participants } : {})
			});
		}

		// Convert votes to maju format
		// maju expects: array of ballots, where each ballot is an object mapping option names to grade indices
		const ballots: Record<string, number>[] = poll.votes.map((vote: { ballot: string }) => {
			const ballot = JSON.parse(vote.ballot as string) as Record<string, number>;
			return ballot;
		});

		// Calculate results using maju
		const mj = createPoll(options, {
			GRADING_LEVELS: grades.length
		});
		mj.addVotes(ballots);
		const results = mj.getResults();

		// Build per-option grade distribution from maju results
		const distributions: Record<
			string,
			{ gradeIndex: number; label: string; count: number; percentage: number }[]
		> = {};
		for (const option of results) {
			const name = option.name;
			const optDist = option.distribution ?? [];
			distributions[name] = optDist.map((d, gradeIndex) => ({
				gradeIndex,
				label: grades[gradeIndex],
				count: d.count,
				// Normalize ratio (0..1) to percentage (0..100) with two decimals
				percentage: Math.round((d.percentage ?? 0) * 10000) / 100
			}));
		}

		// Format results
		const ranking = results.map((option) => ({
			rank: option.rank,
			name: option.name,
			medianGrade: option.medianGrade,
			medianGradeLabel: grades[option.medianGrade],
			distribution: distributions[option.name]
		}));

		// Create a map for easy lookup
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

		return json({
			pollId: poll.id,
			title: poll.title,
			description: poll.description,
			totalVotes: poll.votes.length,
			expiresAt,
			isExpired,
			// Expose configuration to the client for conditional UI
			askName: poll.askName,
			showParticipants: poll.showParticipants,
			options: optionResults,
			ranking,
			grades,
			...(participants ? { participants } : {})
		});
	} catch (error) {
		console.error('Error calculating results:', error);
		return json({ error: 'Failed to calculate results' }, { status: 500 });
	}
};
