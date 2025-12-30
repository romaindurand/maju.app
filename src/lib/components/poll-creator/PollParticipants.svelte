<script lang="ts">
	import ToggleSwitch from '$lib/components/ToggleSwitch.svelte';
	import { slide } from 'svelte/transition';
	import { pollCreatorStore } from '$lib/stores/pollCreatorStore.svelte';
</script>

<div class="space-y-4">
	<ToggleSwitch
		label="Demander le prénom"
		description="Chaque participant devra saisir son prénom avant de voter. Les votes restent anonymes."
		bind:checked={pollCreatorStore.askName}
	/>

	{#if pollCreatorStore.askName}
		<div class="bg-white border-2 border-gray-200 rounded-lg p-4" transition:slide>
			<label for="show-participants" class="block font-semibold text-gray-700 mb-2"
				>Affichage des participants</label
			>
			<select
				id="show-participants"
				bind:value={pollCreatorStore.showParticipants}
				class="w-full p-2 border-2 border-gray-200 rounded"
			>
				<option value="never">Ne pas montrer</option>
				<option value="always">Montrer</option>
				{#if pollCreatorStore.expirationMode !== 'none'}
					<option value="after_expiration">Montrer après l'expiration du sondage</option>
				{/if}
			</select>

			<p class="text-sm text-gray-500 mt-2">
				La liste des prénoms sera visible sur la page de vote et les résultats selon le mode choisi.
			</p>
		</div>
	{/if}
</div>
