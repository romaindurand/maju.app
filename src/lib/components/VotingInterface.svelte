<script lang="ts">
	import { goto } from '$app/navigation';
	import { generateVoterIdentifier, hasVotedLocally, markAsVoted } from '$lib/utils/voter';
	import { generateBrowserFingerprint } from '$lib/utils/fingerprint';

	interface Props {
		poll: {
			id: string;
			title: string;
			description: string | null;
			options: string[];
			grades: string[];
			preventMultipleVotes: boolean;
		};
	}

	let { poll }: Props = $props();

	let ballot = $state<Record<string, number>>({});
	let isSubmitting = $state(false);
	let error = $state('');
	let success = $state(false);
	let alreadyVoted = $derived(poll.preventMultipleVotes && hasVotedLocally(poll.id));

	// Initialize ballot with null selections (single init)
	// svelte-ignore state_referenced_locally
		ballot = Object.fromEntries(poll.options.map((option) => [option, -1])) as Record<string, number>;

	function selectGrade(option: string, gradeIndex: number) {
		ballot[option] = gradeIndex;
	}

	function isComplete(): boolean {
		return poll.options.every((option) => ballot[option] >= 0);
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		error = '';

		if (!isComplete()) {
			error = 'Veuillez évaluer toutes les options';
			return;
		}

		isSubmitting = true;

		try {
			// Generate voter identifier and fingerprint
			const voterIdentifier = await generateVoterIdentifier();
			const fingerprint = await generateBrowserFingerprint();

			const response = await fetch(`/api/polls/${poll.id}/vote`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					ballot,
					voterIdentifier,
					fingerprint
				})
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Erreur lors du vote');
			}

			// Mark as voted locally
			markAsVoted(poll.id);
			success = true;
			alreadyVoted = true;

			// Redirect to results after a short delay
			setTimeout(() => {
				goto(`/poll/${poll.id}/results`);
			}, 1500);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Une erreur est survenue';
		} finally {
			isSubmitting = false;
		}
	}

	// Get color for grade (gradient from green to red)
	function getGradeColor(index: number): string {
		const colors = [
			'#dc2626', // À rejeter - red
			'#ef4444',
			'#f97316', // Passable - orange
			'#fb923c',
			'#fbbf24', // Bien - yellow
			'#34d399',
			'#10b981' // Excellent - green
		];
		return colors[index] || '#6b7280';
	}
</script>

<div class="max-w-3xl mx-auto">
	{#if alreadyVoted && success}
		<div class="text-center p-12">
			<div class="w-20 h-20 mx-auto mb-6 bg-linear-to-tr from-emerald-500 to-emerald-600 text-white rounded-full flex items-center justify-center text-3xl">✓</div>
			<h3 class="text-2xl font-bold text-gray-800 mb-2">Vote enregistré !</h3>
			<p class="text-gray-600">Redirection vers les résultats...</p>
		</div>
	{:else if alreadyVoted}
		<div class="text-center p-12">
			<p class="text-xl text-gray-500 mb-6">Vous avez déjà voté pour ce sondage.</p>
			<a href="/poll/{poll.id}/results" class="inline-block px-6 py-3 bg-linear-to-tr from-blue-500 to-blue-600 text-white rounded-lg font-semibold transition hover:-translate-y-0.5 hover:shadow-lg">Voir les résultats</a>
		</div>
	{:else}
		<div class="mb-8">
			<h2 class="text-3xl font-bold mb-3 text-gray-800">{poll.title}</h2>
			{#if poll.description}
				<p class="text-lg text-gray-500 mb-4">{poll.description}</p>
			{/if}
			<p class="text-sm text-gray-600 italic">Évaluez chaque option selon l'échelle du jugement majoritaire :</p>
		</div>

		<form onsubmit={handleSubmit} class="space-y-6">
			<div class="flex flex-col gap-6 mb-8">
				{#each poll.options as option (option)}
					<div class="bg-white border-2 border-gray-200 rounded-xl p-6 transition" class:border-blue-500={ballot[option] >= 0}>
						<h3 class="text-xl font-semibold mb-4 text-gray-800">{option}</h3>
						<div class="flex flex-col sm:flex-row sm:flex-nowrap gap-2">
							{#each poll.grades as grade, gradeIndex (gradeIndex)}
								<button
									type="button"
									onclick={() => selectGrade(option, gradeIndex)}
									class="px-2 sm:px-3 py-1 sm:py-2 border-2 rounded-md bg-white text-gray-700 text-xs sm:text-sm font-medium transition text-center hover:-translate-y-0.5"
									style="
										border-color: {getGradeColor(gradeIndex)};
										background-color: {ballot[option] === gradeIndex ? getGradeColor(gradeIndex) : ''};
										color: {ballot[option] === gradeIndex ? '#fff' : ''};
									"
								>
									{grade}
								</button>
							{/each}
						</div>
					</div>
				{/each}
			</div>

			{#if error}
				<div class="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-center">{error}</div>
			{/if}

			<button
				type="submit"
				class="w-full px-6 py-3 bg-linear-to-tr from-blue-500 to-blue-600 text-white rounded-lg text-lg font-semibold transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
				disabled={isSubmitting || !isComplete()}
			>
				{isSubmitting ? 'Envoi...' : 'Soumettre mon vote'}
			</button>
		</form>
	{/if}
</div>

<!-- Styles supprimés au profit des utilitaires Tailwind -->
