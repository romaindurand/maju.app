import type { PageLoad } from './$types';
import { getPollResults } from '$lib/remotes/polls.remote';

export const load: PageLoad = async ({ params }) => {
	const results = await getPollResults(params.id);
	return { results };
};
