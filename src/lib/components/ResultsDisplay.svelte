<script lang="ts">
	import tinygradient from 'tinygradient';

	interface Props {
		results: {
			pollId: string;
			title: string;
			description: string | null;
			totalVotes: number;
			expiresAt?: string | Date;
			isExpired?: boolean;
			ranking: Array<{
				rank: number;
				name: string;
				medianGrade: number;
				medianGradeLabel: string;
				distribution: { gradeIndex: number; label: string; count: number; percentage: number }[];
			}>;
			grades: string[];
		};
	}

	let { results }: Props = $props();

	let remainingMs = $state(0);
	let countdownText = $derived(formatCountdown(remainingMs));
	let hasCountdown = $derived(!!parseExpiresAt());
	let expired = $derived(hasCountdown ? (remainingMs <= 0 || results.isExpired === true) : false);

	function parseExpiresAt(): Date | null {
		if (!results.expiresAt) return null;
		const d = typeof results.expiresAt === 'string' ? new Date(results.expiresAt) : (results.expiresAt as Date);
		return isNaN(d.getTime()) ? null : d;
	}

	function formatCountdown(ms: number): string {
		if (ms <= 0) return '00:00:00';
		const totalSeconds = Math.floor(ms / 1000);
		const days = Math.floor(totalSeconds / 86400);
		const hours = Math.floor((totalSeconds % 86400) / 3600);
		const minutes = Math.floor((totalSeconds % 3600) / 60);
		const seconds = totalSeconds % 60;
		const hh = String(hours).padStart(2, '0');
		const mm = String(minutes).padStart(2, '0');
		const ss = String(seconds).padStart(2, '0');
		return days > 0 ? `${days}j ${hh}:${mm}:${ss}` : `${hh}:${mm}:${ss}`;
	}

	{
		if (typeof window !== 'undefined') {
			const target = parseExpiresAt();
			if (target) {
				let timer: number | undefined;
				const update = () => {
					remainingMs = target.getTime() - Date.now();
				};
				update();
				timer = setInterval(update, 1000) as unknown as number;
			}
		}
	}

	// Get color for grade
	function getGradeColor(gradeIndex: number): string {
		let gradient = tinygradient(['#880000', '#88FF88']);
		let tinycolors = gradient.hsv(results.grades.length, false);
		let colors = tinycolors.map((t: any) => t.toHexString());
		return colors[gradeIndex] || '#6b7280';
	}

	// Get medal emoji for top 3
	function getMedal(rank: number): string {
		if (rank === 0) return '🥇';
		if (rank === 1) return '🥈';
		if (rank === 2) return '🥉';
		return '';
	}

	// Position of the 50% cumulative point along the normalized bar
	function getMedianPositionPercent(): number {
		return 50;
	}

	let activeTooltip: string | null = $state(null);
	function tooltipKey(name: string, gradeIndex: number) {
		return `${name}-${gradeIndex}`;
	}
</script>

<div class="max-w-4xl mx-auto">
	<div class="text-center mb-12">
		<h2 class="text-4xl font-bold mb-3 text-gray-800">{results.title}</h2>
		<div class="mt-2">
			{#if hasCountdown}
				{#if expired}
					<span class="inline-flex items-center gap-2 px-3 py-1 rounded bg-red-50 border border-red-200 text-red-700">Sondage terminé</span>
				{:else}
					<span class="inline-flex items-center gap-2 px-3 py-1 rounded bg-gray-100 border">⏳ Termine dans {countdownText}</span>
				{/if}
			{/if}
		</div>
	</div>

	{#if results.totalVotes === 0}
		<div class="text-center p-12 bg-gray-50 rounded-xl mb-8">
			<p class="text-xl text-gray-500 mb-6">Aucun vote pour le moment.</p>
			<a href="/poll/{results.pollId}" class="inline-block px-6 py-3 bg-linear-to-tr from-blue-500 to-blue-600 text-white rounded-lg font-semibold transition hover:-translate-y-0.5 hover:shadow-lg">Soyez le premier à voter !</a>
		</div>
	{:else}
		<div class="mb-12">
			<h3 class="text-2xl font-bold mb-6 text-gray-800">Résultats</h3>
			<div class="flex flex-col gap-4">
				{#each results.ranking as option (option.name)}
					<div class="relative p-6 bg-white border-2 border-gray-200 rounded-xl transition hover:border-blue-500 hover:translate-x-1 hover:shadow-md">
						<!-- En-tête: médaille à gauche, nom + mention en dessous -->
						<div class="flex items-start gap-4 mb-3">
							<div class="w-12 h-12 flex items-center justify-center rounded-full bg-linear-to-tr from-gray-100 to-gray-200 text-2xl">
								{#if option.rank <= 2}
									<span>{getMedal(option.rank)}</span>
								{:else}
									<span class="text-xl font-bold text-gray-700">{option.rank + 1}</span>
								{/if}
							</div>
							<!-- CHANGEMENT: empiler le nom puis la mention sous le nom -->
							<div class="flex flex-col gap-1">
								<h4 class="text-xl font-semibold text-gray-800">{option.name}</h4>
								<div class="flex items-center gap-2">
									<span class="px-2 py-1 rounded-md text-white font-semibold text-sm" style="background-color: {getGradeColor(option.medianGrade)}">{option.medianGradeLabel}</span>
									<span class="text-sm text-gray-500">Mention majoritaire</span>
								</div>
							</div>
						</div>

						{#if results.totalVotes > 0}
							<!-- Barre horizontale pleine largeur -->
							<div class="relative flex flex-row h-8 w-full rounded overflow-visible bg-gray-100 gap-px">
								{#each option.distribution as seg (seg.gradeIndex)}
									{#if seg.percentage > 0}
										<button
											type="button"
											class="group relative flex items-center justify-center text-[10px] sm:text-xs font-semibold text-white"
											style="background-color: {getGradeColor(seg.gradeIndex)}; flex: 0 0 {seg.percentage}%"
											onmouseenter={() => (activeTooltip = tooltipKey(option.name, seg.gradeIndex))}
											onmouseleave={() => (activeTooltip = null)}
											onfocus={() => (activeTooltip = tooltipKey(option.name, seg.gradeIndex))}
											onblur={() => (activeTooltip = null)}
											onclick={() => (activeTooltip = activeTooltip === tooltipKey(option.name, seg.gradeIndex) ? null : tooltipKey(option.name, seg.gradeIndex))}
										>
											<span class="pointer-events-none select-none">{seg.percentage}%</span>

											{#if activeTooltip === tooltipKey(option.name, seg.gradeIndex)}
												<div class="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 text-white text-xs px-2 py-1 shadow z-20">
													{seg.label} — {seg.count} vote{seg.count > 1 ? 's' : ''} — {seg.percentage}%
												</div>
											{:else}
												<div class="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 text-white text-xs px-2 py-1 shadow hidden group-hover:block z-20">
													{seg.label} — {seg.count} vote{seg.count > 1 ? 's' : ''} — {seg.percentage}%
												</div>
											{/if}
										</button>
									{/if}
								{/each}

								<!-- Repère 50% vertical -->
								<div class="absolute top-0 bottom-0 left-1/2">
									<div class="h-full w-px bg-gray-700 opacity-40"></div>
								</div>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</div>

		<div class="bg-gray-50 p-6 rounded-xl mb-8">
			<h4 class="text-lg font-semibold mb-4 text-gray-800">Échelle d'évaluation</h4>
			<!-- CHANGEMENT: affichage vertical forcé -->
			<div class="grid grid-cols-1 gap-3">
				{#each results.grades as grade, index (index)}
					<div class="flex items-center gap-2">
						<span class="w-6 h-6 rounded" style="background-color: {getGradeColor(index)}"></span>
						<span>{grade}</span>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<div class="flex gap-4 justify-center flex-wrap">
		<a href="/poll/{results.pollId}" class="inline-block px-4 py-3 bg-white text-blue-500 border-2 border-blue-500 rounded-lg font-semibold transition hover:bg-blue-500 hover:text-white hover:-translate-y-0.5">Retour au sondage</a>
		<a href="/" class="inline-block px-4 py-3 bg-white text-blue-500 border-2 border-blue-500 rounded-lg font-semibold transition hover:bg-blue-500 hover:text-white hover:-translate-y-0.5">Créer un nouveau sondage</a>
	</div>
	</div>

	<!-- Styles supprimés au profit des utilitaires Tailwind -->
