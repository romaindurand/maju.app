<script lang="ts">
	import PollCreator from '$lib/components/PollCreator.svelte';
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

	<footer class="text-center text-white opacity-90 max-w-xl mx-auto text-sm leading-relaxed">
		<p>
			Le jugement majoritaire permet à chaque votant d'évaluer toutes les options sur une échelle de
			mentions. Le gagnant est celui qui obtient la meilleure mention majoritaire.
		</p>
	</footer>
</div>
