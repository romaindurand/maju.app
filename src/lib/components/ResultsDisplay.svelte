<script lang="ts">
	import tinygradient from 'tinygradient';

	interface Props {
		results: {
			pollId: string;
			title: string;
			description: string | null;
			totalVotes: number;
			ranking: Array<{
				rank: number;
				name: string;
				medianGrade: number;
				medianGradeLabel: string;
				score: number;
			}>;
			grades: string[];
		};
	}

	let { results }: Props = $props();

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
</script>

<div class="max-w-4xl mx-auto">
	<div class="text-center mb-12">
		<h2 class="text-4xl font-bold mb-3 text-gray-800">{results.title}</h2>
		{#if results.description}
			<p class="text-lg text-gray-500 mb-4">{results.description}</p>
		{/if}
		<p class="text-base text-blue-500 font-semibold">
			{results.totalVotes} vote{results.totalVotes > 1 ? 's' : ''} enregistré{results.totalVotes > 1 ? 's' : ''}
		</p>
	</div>

	{#if results.totalVotes === 0}
		<div class="text-center p-12 bg-gray-50 rounded-xl mb-8">
			<p class="text-xl text-gray-500 mb-6">Aucun vote pour le moment.</p>
			<a href="/poll/{results.pollId}" class="inline-block px-6 py-3 bg-gradient-to-tr from-blue-500 to-blue-600 text-white rounded-lg font-semibold transition hover:-translate-y-0.5 hover:shadow-lg">Soyez le premier à voter !</a>
		</div>
	{:else}
		<div class="mb-12">
			<h3 class="text-2xl font-bold mb-6 text-gray-800">Résultats</h3>
			<div class="flex flex-col gap-4">
				{#each results.ranking as option (option.name)}
					<div class="flex items-center gap-6 p-6 bg-white border-2 border-gray-200 rounded-xl transition hover:border-blue-500 hover:translate-x-1 hover:shadow-md">
						<div class="flex-shrink-0 w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-tr from-gray-100 to-gray-200 text-2xl">
							{#if option.rank <= 2}
								<span>{getMedal(option.rank)}</span>
							{:else}
								<span class="text-xl font-bold text-gray-700">{option.rank + 1}</span>
							{/if}
						</div>
						<div class="flex-1">
							<h4 class="text-xl font-semibold mb-2 text-gray-800">{option.name}</h4>
							<div class="flex items-center gap-3">
								<span class="px-2 py-1 rounded-md text-white font-semibold text-sm" style="background-color: {getGradeColor(option.medianGrade)}">{option.medianGradeLabel}</span>
								<span class="text-sm text-gray-500">Mention majoritaire</span>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<div class="bg-gray-50 p-6 rounded-xl mb-8">
			<h4 class="text-lg font-semibold mb-4 text-gray-800">Échelle d'évaluation</h4>
			<div class="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
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
