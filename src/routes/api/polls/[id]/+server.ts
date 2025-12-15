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

		return json({
			id: poll.id,
			title: poll.title,
			description: poll.description,
			candidates: JSON.parse(poll.candidates),
			grades: JSON.parse(poll.grades),
			createdAt: poll.createdAt
		});
	} catch (error) {
		console.error('Error fetching poll:', error);
		return json({ error: 'Failed to fetch poll' }, { status: 500 });
	}
};
