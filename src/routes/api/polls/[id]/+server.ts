import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';

// GET /api/polls/[id] - Get poll details
export const GET: RequestHandler = async ({ params }) => {
	try {
		const poll = await db.poll.findUnique({
			where: { id: params.id },
			include: { votes: true }
		});

		if (!poll) {
			return json({ error: 'Poll not found' }, { status: 404 });
		}

		const expiresAt = poll.expiresAt; // null means no time limit
		const isExpired = expiresAt ? new Date() > expiresAt : false;

		const voteCount = poll.votes?.length ?? 0;

		// Build participants list based on configuration and privacy (need at least 2 votes)
		let participants: string[] | undefined;
		if (voteCount >= 2) {
			if (poll.showParticipants === 'always') {
				participants = poll.votes.map((v) => (v.name || '').trim()).filter((n) => n.length > 0);
			} else if (poll.showParticipants === 'after_expiration' && isExpired) {
				participants = poll.votes
					.map((v) => (v.name || '').trim())
					.filter((n) => n.length > 0);
			}
		}

		return json({
			id: poll.id,
			title: poll.title,
			description: poll.description,
			options: JSON.parse(poll.options),
			grades: JSON.parse(poll.grades),
			preventMultipleVotes: poll.preventMultipleVotes,
			askName: poll.askName,
			showParticipants: poll.showParticipants,
			createdAt: poll.createdAt,
			expiresAt,
			isExpired,
			voteCount,
			...(participants ? { participants } : {})
		});
	} catch (error) {
		console.error('Error fetching poll:', error);
		return json({ error: 'Failed to fetch poll' }, { status: 500 });
	}
};
