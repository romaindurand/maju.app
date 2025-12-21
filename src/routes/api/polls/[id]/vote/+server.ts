import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { VOTER_CONFIG } from '$lib/config';

// POST /api/polls/[id]/vote - Submit a vote
export const POST: RequestHandler = async ({ params, request, cookies }) => {
	try {
		const data = await request.json();

		// Validate voter identifier
		if (!data.voterIdentifier || typeof data.voterIdentifier !== 'string') {
			return json({ error: 'Voter identifier is required' }, { status: 400 });
		}

		// Validate ballot
		if (!data.ballot || typeof data.ballot !== 'object') {
			return json({ error: 'Ballot is required' }, { status: 400 });
		}

		// Check if poll exists
		const poll = await db.poll.findUnique({
			where: { id: params.id }
		});

		if (!poll) {
			return json({ error: 'Poll not found' }, { status: 404 });
		}


		// Check if user has already voted (server-side check) when prevention enabled
		if (poll.preventMultipleVotes) {
			const existingVote = await db.vote.findFirst({
				where: {
					pollId: params.id,
					voterIdentifier: data.voterIdentifier
				}
			});

			if (existingVote) {
				return json({ error: 'You have already voted on this poll' }, { status: 409 });
			}
		}

		// Validate ballot structure
		const options = JSON.parse(poll.options) as string[];
		const grades = JSON.parse(poll.grades) as string[];

		for (const option of options) {
			if (!(option in data.ballot)) {
				return json(
					{ error: `Missing grade for option: ${option}` },
					{ status: 400 }
				);
			}

			const gradeIndex = data.ballot[option];
			if (
				typeof gradeIndex !== 'number' ||
				gradeIndex < 0 ||
				gradeIndex >= grades.length
			) {
				return json(
					{ error: `Invalid grade for option: ${option}` },
					{ status: 400 }
				);
			}
		}

		// Create vote
		const vote = await db.vote.create({
			data: {
				pollId: params.id,
				ballot: JSON.stringify(data.ballot),
				voterIdentifier: data.voterIdentifier
			}
		});

		// Set cookie for additional tracking
		const cookieToken = crypto.randomUUID();
		cookies.set(VOTER_CONFIG.cookieName, cookieToken, {
			path: '/',
			maxAge: VOTER_CONFIG.cookieMaxAge,
			httpOnly: true,
			sameSite: 'lax'
		});

		return json({
			success: true,
			voteId: vote.id,
			message: 'Vote submitted successfully'
		});
	} catch (error) {
		console.error('Error submitting vote:', error);
		return json({ error: 'Failed to submit vote' }, { status: 500 });
	}
};
