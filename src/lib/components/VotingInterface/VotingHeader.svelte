<script lang="ts">
	interface Props {
		title: string;
		description: string | null;
		hasCountdown: boolean;
		countdownText: string;
		expired: boolean;
	}

	let { title, description, hasCountdown, countdownText, expired }: Props = $props();
</script>

<div class="mb-8">
	<h2 class="text-3xl font-bold mb-3 text-gray-800">{title}</h2>
	{#if description}
		<p class="text-lg text-gray-500 mb-4">{description}</p>
	{/if}
	<div class="flex items-center justify-between gap-4">
		<p class="text-sm text-gray-600 italic">
			Évaluez chaque option selon l'échelle du jugement majoritaire :
		</p>
		<div class="text-sm font-medium text-gray-700">
			{#if hasCountdown}
				{#if !expired}
					<span class="inline-flex items-center gap-2 px-3 py-1 rounded bg-gray-100 border"
						>⏳ Termine dans {countdownText}</span
					>
				{:else}
					<span
						class="inline-flex items-center gap-2 px-3 py-1 rounded bg-red-50 border border-red-200 text-red-700"
						>Sondage terminé</span
					>
				{/if}
			{/if}
		</div>
	</div>
</div>
