<script lang="ts">
	import { tick } from 'svelte';
	import { pollCreatorStore } from '$lib/stores/pollCreatorStore.svelte';

	let optionRefs: HTMLInputElement[] = [];

	function setOptionRef(idx: number) {
		return (node: HTMLInputElement) => {
			optionRefs[idx] = node;
			return () => {
				optionRefs[idx] = undefined as unknown as HTMLInputElement;
			};
		};
	}

	async function addOption() {
		pollCreatorStore.options = [...pollCreatorStore.options, ''];
		await tick();
		optionRefs[pollCreatorStore.options.length - 1]?.focus();
	}

	function removeOption(index: number) {
		if (pollCreatorStore.options.length > 2) {
			pollCreatorStore.options = pollCreatorStore.options.filter((_, i) => i !== index);
		}
	}
</script>

<fieldset>
	<legend class="mb-2 font-semibold text-gray-700">Options *</legend>
	<div class="flex flex-col gap-3 mb-3">
		{#each pollCreatorStore.options as option, index (index)}
			<div class="flex items-center gap-2">
				<input
					type="text"
					bind:value={pollCreatorStore.options[index]}
					{@attach setOptionRef(index)}
					placeholder={`Option ${index + 1}`}
					required
					class="flex-1 p-3 border-2 border-gray-200 rounded-lg text-base focus:outline-none focus:border-blue-500"
				/>
				{#if pollCreatorStore.options.length > 2}
					<button
						type="button"
						class="p-2 bg-red-500 text-white rounded-md cursor-pointer text-xl leading-none hover:bg-red-600"
						onclick={() => removeOption(index)}
						aria-label="Supprimer"
					>
						✕
					</button>
				{/if}
			</div>
		{/each}
	</div>
	<button
		type="button"
		class="px-4 py-2 bg-gray-100 text-gray-700 border-2 border-dashed border-gray-300 rounded-md cursor-pointer font-medium hover:bg-gray-200 hover:border-gray-400"
		onclick={addOption}
	>
		+ Ajouter une option
	</button>
</fieldset>
