<script lang="ts">
	import PollCreator from '$lib/components/PollCreator.svelte';
</script>

<div class="container">
	<header>
		<h1>🗳️ Jugement Majoritaire</h1>
		<p class="tagline">
			Créez des sondages équitables avec le système de vote par jugement majoritaire
		</p>
	</header>

	<main>
		<PollCreator />
	</main>

	<footer>
		<p>
			Le jugement majoritaire permet à chaque votant d'évaluer toutes les options sur une échelle de
			mentions. Le gagnant est celui qui obtient la meilleure mention majoritaire.
		</p>
	</footer>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
			sans-serif;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		min-height: 100vh;
	}

	.container {
		min-height: 100vh;
		padding: 2rem 1rem;
	}

	header {
		text-align: center;
		margin-bottom: 3rem;
		color: white;
	}

	h1 {
		font-size: 3rem;
		font-weight: 800;
		margin-bottom: 0.5rem;
		text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
	}

	.tagline {
		font-size: 1.25rem;
		opacity: 0.95;
	}

	main {
		background: white;
		border-radius: 1rem;
		padding: 2.5rem;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
		margin-bottom: 2rem;
	}

	footer {
		text-align: center;
		color: white;
		opacity: 0.9;
		max-width: 600px;
		margin: 0 auto;
		font-size: 0.95rem;
		line-height: 1.6;
	}

	@media (max-width: 640px) {
		h1 {
			font-size: 2rem;
		}

		.tagline {
			font-size: 1rem;
		}

		main {
			padding: 1.5rem;
		}
	}
</style>
