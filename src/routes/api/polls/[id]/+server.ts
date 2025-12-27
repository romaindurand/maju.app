import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';

// GET /api/polls/[id] - Get poll details
export const GET: RequestHandler = async ({ params }) => {
	try {
		const poll = await db.poll.findUnique({
			where: { id: params.id }
		});

		if (!poll) {
			return json({ error: 'Poll not found' }, { status: 404 });
		}

		const expiresAt = poll.expiresAt; // null means no time limit
		const isExpired = expiresAt ? new Date() > expiresAt : false;

		return json({
			id: poll.id,
			title: poll.title,
			description: poll.description,
			options: JSON.parse(poll.options),
			grades: JSON.parse(poll.grades),
			preventMultipleVotes: poll.preventMultipleVotes,
			createdAt: poll.createdAt,
			expiresAt,
			isExpired
		});
	} catch (error) {
		console.error('Error fetching poll:', error);
		return json({ error: 'Failed to fetch poll' }, { status: 500 });
	}
};
