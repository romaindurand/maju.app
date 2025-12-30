<script lang="ts">
	interface Props {
		status: 'expired' | 'success' | 'already_voted' | 'voting';
		pollId: string;
	}

	let { status, pollId }: Props = $props();
</script>

{#if status === 'expired'}
	<div class="text-center p-12">
		<h3 class="text-2xl font-bold text-gray-800 mb-2">Sondage terminé</h3>
		<p class="text-gray-600 mb-6">Les votes ne sont plus possibles.</p>
		<a
			href="/poll/{pollId}/results"
			class="inline-block px-6 py-3 bg-linear-to-tr from-blue-500 to-blue-600 text-white rounded-lg font-semibold transition hover:-translate-y-0.5 hover:shadow-lg"
			>Voir les résultats</a
		>
	</div>
{:else if status === 'success'}
	<div class="text-center p-12">
		<div
			class="w-20 h-20 mx-auto mb-6 bg-linear-to-tr from-emerald-500 to-emerald-600 text-white rounded-full flex items-center justify-center text-3xl"
		>
			✓
		</div>
		<h3 class="text-2xl font-bold text-gray-800 mb-2">Vote enregistré !</h3>
		<p class="text-gray-600 mb-6">Votre vote a bien été pris en compte.</p>
		<a
			href="/poll/{pollId}/results"
			class="inline-block px-6 py-3 bg-linear-to-tr from-blue-500 to-blue-600 text-white rounded-lg font-semibold transition hover:-translate-y-0.5 hover:shadow-lg"
			>Voir les résultats</a
		>
	</div>
{:else if status === 'already_voted'}
	<div class="text-center p-12">
		<p class="text-xl text-gray-500 mb-6">Vous avez déjà voté pour ce sondage.</p>
		<a
			href="/poll/{pollId}/results"
			class="inline-block px-6 py-3 bg-linear-to-tr from-blue-500 to-blue-600 text-white rounded-lg font-semibold transition hover:-translate-y-0.5 hover:shadow-lg"
			>Voir les résultats</a
		>
	</div>
{/if}
