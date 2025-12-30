<script lang="ts">
	import { goto } from '$app/navigation';
	import { pollCreatorStore } from '$lib/stores/pollCreatorStore.svelte';
	import PollBasicInfo from './poll-creator/PollBasicInfo.svelte';
	import PollOptions from './poll-creator/PollOptions.svelte';
	import PollSettings from './poll-creator/PollSettings.svelte';
	import PollParticipants from './poll-creator/PollParticipants.svelte';
	import PollExpiration from './poll-creator/PollExpiration.svelte';

	async function handleSubmit(e: Event) {
		e.preventDefault();
		pollCreatorStore.error = '';

		// Validate
		const validationError = pollCreatorStore.validate();
		if (validationError) {
			pollCreatorStore.error = validationError;
			return;
		}

		pollCreatorStore.isSubmitting = true;

		try {
			const response = await fetch('/api/polls', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(pollCreatorStore.getFormData())
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Erreur lors de la création du sondage');
			}

			const poll = await response.json();
			pollCreatorStore.reset();
			goto(`/poll/${poll.id}`);
		} catch (err) {
			pollCreatorStore.error = err instanceof Error ? err.message : 'Une erreur est survenue';
		} finally {
			pollCreatorStore.isSubmitting = false;
		}
	}
</script>

<div class="max-w-xl mx-auto">
	<h2 class="text-3xl font-bold mb-6 text-gray-800">Créer un nouveau sondage</h2>

	<form onsubmit={handleSubmit} class="space-y-6">
		<PollBasicInfo />

		<PollOptions />

		<fieldset class="mt-6">
			<legend class="mb-2 font-semibold text-gray-700">Paramètres</legend>

			<PollSettings />

			<div class="mt-4">
				<PollParticipants />
			</div>

			<div class="mt-6">
				<PollExpiration />
			</div>
		</fieldset>

		{#if pollCreatorStore.error}
			<div class="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 mb-4">
				{pollCreatorStore.error}
			</div>
		{/if}

		<button
			type="submit"
			class="w-full px-6 py-3 bg-linear-to-tr from-blue-500 to-blue-600 text-white rounded-lg text-lg font-semibold transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
			disabled={pollCreatorStore.isSubmitting}
		>
			{pollCreatorStore.isSubmitting ? 'Création...' : 'Créer le sondage'}
		</button>
	</form>
</div>
