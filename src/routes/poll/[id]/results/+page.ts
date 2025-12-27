import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
	const response = await fetch(`/api/polls/${params.id}/results`);

	if (!response.ok) {
		throw new Error('Failed to load results');
	}

	const results = await response.json();
	return { results };
};
