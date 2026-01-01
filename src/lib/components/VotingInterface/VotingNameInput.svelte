<script lang="ts">
	import { votingInterfaceStore } from './votingInterfaceStore.svelte';

	interface Props {
		askName: boolean;
	}

	let { askName }: Props = $props();
</script>

{#if askName}
	<div>
		<label for="first-name" class="block font-semibold mb-2 text-gray-700">Votre prénom</label>
		<input
			id="first-name"
			type="text"
			placeholder="Ex: Alice"
			bind:value={votingInterfaceStore.firstName}
			class="w-full p-3 border-2 border-gray-200 rounded-lg text-base focus:outline-none focus:border-blue-500"
		/>
		<p class="text-xs text-gray-500 mt-1">
			Ce prénom sera visible selon la configuration du sondage.
		</p>
	</div>
{/if}
