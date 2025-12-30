<script lang="ts">
	import { pollCreatorStore } from '$lib/stores/pollCreatorStore.svelte';
</script>

<div>
	<label for="title" class="block font-semibold mb-2 text-gray-700">Titre du sondage *</label>
	<input
		id="title"
		type="text"
		bind:value={pollCreatorStore.title}
		placeholder="Ex: Meilleur langage de programmation"
		required
		class="w-full p-3 border-2 border-gray-200 rounded-lg text-base focus:outline-none focus:border-blue-500"
	/>
</div>

<div>
	<label for="description" class="block font-semibold mb-2 text-gray-700"
		>Description (optionnel)</label
	>
	<textarea
		id="description"
		bind:value={pollCreatorStore.description}
		placeholder="Décrivez votre sondage..."
		rows="3"
		class="w-full p-3 border-2 border-gray-200 rounded-lg text-base focus:outline-none focus:border-blue-500"
	></textarea>
</div>
