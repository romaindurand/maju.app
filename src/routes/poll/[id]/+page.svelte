<script lang="ts">
	import VotingInterface from '$lib/components/VotingInterface/VotingInterface.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="min-h-screen bg-linear-to-tr from-indigo-500 to-purple-600 px-4 py-8">
	<header class="max-w-3xl mx-auto mb-8">
		<a href="/" class="text-white font-semibold text-lg hover:opacity-80">← Accueil</a>
	</header>

	<main class="bg-white rounded-2xl p-6 sm:p-10 shadow-2xl max-w-3xl mx-auto">
		<VotingInterface poll={data.poll} />
	</main>
</div>
