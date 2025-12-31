import type { PageLoad } from './$types';
import { getPopularPolls } from '$lib/remotes/polls.remote';

export const load: PageLoad = async () => {
	const popular = await getPopularPolls();
	return { popular };
};
