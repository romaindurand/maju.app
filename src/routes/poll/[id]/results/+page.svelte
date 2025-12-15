<script lang="ts">
	import ResultsDisplay from '$lib/components/ResultsDisplay.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="container">
	<header>
		<a href="/" class="back-link">← Accueil</a>
	</header>

	<main>
		<ResultsDisplay results={data.results} />
	</main>
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
		max-width: 900px;
		margin: 0 auto 2rem;
	}

	.back-link {
		color: white;
		text-decoration: none;
		font-weight: 600;
		font-size: 1.125rem;
		transition: opacity 0.2s;
	}

	.back-link:hover {
		opacity: 0.8;
	}

	main {
		background: white;
		border-radius: 1rem;
		padding: 2.5rem;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
		max-width: 900px;
		margin: 0 auto;
	}

	@media (max-width: 640px) {
		main {
			padding: 1.5rem;
		}
	}
</style>
