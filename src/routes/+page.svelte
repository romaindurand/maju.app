<script lang="ts">
	import PollCreator from '$lib/components/PollCreator.svelte';
	const { data } = $props<{
		data: {
			popular: Array<{
				id: string;
				title: string;
				createdAt: string;
				totalVotes: number;
				recentVotes: number;
				score: number;
				description?: string | null;
				options?: string[];
				lastVoteAt?: string | null;
			}>;
		};
	}>();
	const safePopular = $derived(data?.popular ?? []);

	function timeAgo(iso?: string | null): string {
		if (!iso) return '—';
		const d = new Date(iso);
		if (isNaN(d.getTime())) return '—';
		const diffMs = Date.now() - d.getTime();
		const sec = Math.floor(diffMs / 1000);
		if (sec < 60) return `il y a ${sec} s`;
		const min = Math.floor(sec / 60);
		if (min < 60) return `il y a ${min} minute${min > 1 ? 's' : ''}`;
		const hr = Math.floor(min / 60);
		if (hr < 24) return `il y a ${hr} heure${hr > 1 ? 's' : ''}`;
		const days = Math.floor(hr / 24);
		if (days < 30) return `il y a ${days} jour${days > 1 ? 's' : ''}`;
		const months = Math.floor(days / 30);
		if (months < 12) return `il y a ${months} mois`;
		const years = Math.floor(months / 12);
		return `il y a ${years} an${years > 1 ? 's' : ''}`;
	}
</script>

<div class="min-h-screen bg-linear-to-tr from-indigo-500 to-purple-600 px-4 py-8">
	<header class="text-center mb-12 text-white">
		<h1 class="text-3xl sm:text-5xl font-extrabold mb-2">🗳️ Jugement Majoritaire</h1>
		<p class="text-base sm:text-xl opacity-90">
			Créez des sondages équitables avec le système de vote par jugement majoritaire
		</p>
	</header>

	<main class="bg-white rounded-2xl p-6 sm:p-10 shadow-2xl mb-8">
		<PollCreator />
	</main>

	{#if safePopular.length > 0}
		<section class="mt-8 px-4">
			<h2 class="text-2xl font-bold mb-4 text-white">Sondages populaires</h2>
			<div class="flex flex-wrap gap-4">
				{#each safePopular as poll (poll.id)}
					<a
						href={`/poll/${poll.id}`}
						class="block rounded-xl border border-gray-200 bg-white/90 p-4 shadow-sm hover:border-blue-400 hover:shadow-md transition-colors w-[320px]"
					>
						<h3 class="text-lg font-semibold text-gray-800">{poll.title}</h3>
						{#if poll.description}
							<p class="text-sm text-gray-700 mt-1">{poll.description}</p>
						{/if}
						{#if poll.options?.length}
							<ul class="flex flex-wrap gap-2 mt-3">
								{#each poll.options.slice(0, 6) as opt (opt)}
									<li class="px-2 py-1 text-xs bg-gray-100 border border-gray-200 rounded">
										{opt}
									</li>
								{/each}
							</ul>
						{/if}
						<div class="mt-3 text-sm text-gray-700">
							<span class="font-medium">Votes:</span>
							{poll.totalVotes}
						</div>
						<div class="mt-1 text-xs text-gray-600">
							<span class="font-medium">Dernier vote:</span>
							{timeAgo(poll.lastVoteAt)}
						</div>
					</a>
				{/each}
			</div>
		</section>
	{/if}

	<footer class="text-center text-white opacity-90 max-w-xl mx-auto text-sm leading-relaxed">
		<p>
			Le jugement majoritaire permet à chaque votant d'évaluer toutes les options sur une échelle de
			mentions. Le gagnant est celui qui obtient la meilleure mention majoritaire.
		</p>
	</footer>
</div>
