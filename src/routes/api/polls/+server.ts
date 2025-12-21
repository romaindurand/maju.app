import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { DEFAULT_GRADES } from '$lib/config';

// POST /api/polls - Create a new poll
export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = await request.json();

		// Validate required fields
		if (!data.title || typeof data.title !== 'string') {
			return json({ error: 'Title is required' }, { status: 400 });
		}

		    if (!data.options || !Array.isArray(data.options) || data.options.length < 2) {
			    return json({ error: 'At least 2 options are required' }, { status: 400 });
		}

		// Use default grades if not provided
		const grades = data.grades || DEFAULT_GRADES;

		// Create poll in database
		const poll = await db.poll.create({
			data: {
				title: data.title.trim(),
				description: data.description?.trim() || null,
				options: JSON.stringify(data.options.map((c: string) => c.trim())),
				grades: JSON.stringify(grades)
			}
		});

		return json({
			id: poll.id,
			title: poll.title,
			description: poll.description,
			options: JSON.parse(poll.options),
			grades: JSON.parse(poll.grades),
			createdAt: poll.createdAt
		});
	} catch (error) {
		console.error('Error creating poll:', error);
		return json({ error: 'Failed to create poll' }, { status: 500 });
	}
};

// GET /api/polls - List all polls (optional feature)
export const GET: RequestHandler = async () => {
	try {
		const polls = await db.poll.findMany({
			orderBy: { createdAt: 'desc' },
			take: 50
		});

		return json(
			polls.map((poll) => ({
				id: poll.id,
				title: poll.title,
				description: poll.description,
				optionCount: JSON.parse(poll.options).length,
				createdAt: poll.createdAt
			}))
		);
	} catch (error) {
		console.error('Error fetching polls:', error);
		return json({ error: 'Failed to fetch polls' }, { status: 500 });
	}
};
