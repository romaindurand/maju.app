import type { PageLoad } from './$types';
import { getPoll } from '$lib/remotes/polls.remote';

export const load: PageLoad = async ({ params }) => {
	const poll = await getPoll(params.id);
	return {poll};
};

