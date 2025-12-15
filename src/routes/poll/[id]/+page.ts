import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
	const response = await fetch(`/api/polls/${params.id}`);

	if (!response.ok) {
		throw new Error('Poll not found');
	}

	const poll = await response.json();
	return { poll };
};
