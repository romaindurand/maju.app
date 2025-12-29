import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const res = await fetch('/api/polls/popular');
	if (!res.ok) {
		return { popular: [] };
	}
	const popular = await res.json();
	return { popular };
};
