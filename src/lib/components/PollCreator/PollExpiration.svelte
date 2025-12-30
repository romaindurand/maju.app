<script lang="ts">
	import ToggleSwitch from '$lib/components/ToggleSwitch.svelte';
	import { pollCreatorStore } from '$lib/components/PollCreator/pollCreatorStore.svelte';
</script>

<div class="border-2 border-gray-200 rounded-lg p-4">
	<h3 class="font-semibold text-gray-700 mb-3">Expiration du sondage</h3>
	<div class="flex flex-wrap gap-3 mb-4">
		<label class="inline-flex items-center gap-2">
			<input
				type="radio"
				name="exp-mode"
				value="duration"
				checked={pollCreatorStore.expirationMode === 'duration'}
				onchange={() => (pollCreatorStore.expirationMode = 'duration')}
			/>
			<span>Durée</span>
		</label>
		<label class="inline-flex items-center gap-2">
			<input
				type="radio"
				name="exp-mode"
				value="datetime"
				checked={pollCreatorStore.expirationMode === 'datetime'}
				onchange={() => (pollCreatorStore.expirationMode = 'datetime')}
			/>
			<span>Date/Heure</span>
		</label>
		<label class="inline-flex items-center gap-2">
			<input
				type="radio"
				name="exp-mode"
				value="none"
				checked={pollCreatorStore.expirationMode === 'none'}
				onchange={() => {
					pollCreatorStore.expirationMode = 'none';
					if (pollCreatorStore.showParticipants === 'after_expiration') {
						pollCreatorStore.showParticipants = 'never';
					}
				}}
			/>
			<span>Aucune limite</span>
		</label>
	</div>

	{#if pollCreatorStore.expirationMode === 'duration'}
		<div class="flex items-center gap-3">
			<div>
				<label for="exp-hours" class="block text-sm text-gray-600 mb-1">Heures</label>
				<input
					id="exp-hours"
					type="number"
					min="0"
					max="168"
					bind:value={pollCreatorStore.durationHours}
					class="w-24 p-2 border-2 border-gray-200 rounded"
				/>
			</div>
			<div>
				<label for="exp-mins" class="block text-sm text-gray-600 mb-1">Minutes</label>
				<input
					id="exp-mins"
					type="number"
					min="0"
					max="59"
					bind:value={pollCreatorStore.durationMinutes}
					class="w-24 p-2 border-2 border-gray-200 rounded"
				/>
			</div>
		</div>
	{:else if pollCreatorStore.expirationMode === 'datetime'}
		<div>
			<label for="exp-datetime" class="block text-sm text-gray-600 mb-1">Date et heure de fin</label
			>
			<input
				id="exp-datetime"
				type="datetime-local"
				bind:value={pollCreatorStore.expiresAtLocal}
				class="p-2 border-2 border-gray-200 rounded w-64"
			/>
		</div>
	{:else}
		<div class="text-sm text-gray-600">Le sondage n'aura pas de limite de temps.</div>
	{/if}

	{#if pollCreatorStore.expirationMode !== 'none'}
		<div class="mt-4">
			<ToggleSwitch
				label="Cacher les résultats avant l'expiration"
				description="Les résultats ne seront visibles qu'après l'expiration du sondage."
				bind:checked={pollCreatorStore.hideResultsUntilExpiration}
			/>
		</div>
	{/if}
</div>
