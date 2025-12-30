<script lang="ts">
	import ToggleSwitch from '$lib/components/ToggleSwitch.svelte';
	import { pollCreatorStore } from '$lib/components/PollCreator/pollCreatorStore.svelte';
</script>

<ToggleSwitch
	label="Interdire les votes multiples"
	description="Empêche un même utilisateur de voter plusieurs fois pour ce sondage."
	bind:checked={pollCreatorStore.preventMultipleVotes}
/>

<ToggleSwitch
	label="Sondage public"
	description="Permet d'afficher ce sondage sur la page d'accueil dans la section 'Sondages populaires'."
	bind:checked={pollCreatorStore.isPublic}
	classes="mt-4"
/>
