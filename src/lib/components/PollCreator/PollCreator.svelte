<script lang="ts">
	import { goto } from '$app/navigation';
	import { pollCreatorStore } from '$lib/components/PollCreator/pollCreatorStore.svelte';
	import PollBasicInfo from './PollBasicInfo.svelte';
	import PollOptions from './PollOptions.svelte';
	import PollSettings from './PollSettings.svelte';
	import PollParticipants from './PollParticipants.svelte';
	import PollExpiration from './PollExpiration.svelte';
	import { createPoll } from './createPoll.remote';

	function validateBeforeSubmit(): string | null {
		// Validate via store
		const validationError = pollCreatorStore.validate();
		if (validationError) return validationError;
		return null;
	}
</script>

<div class="max-w-xl mx-auto">
	<h2 class="text-3xl font-bold mb-6 text-gray-800">Créer un nouveau sondage</h2>

	<form
		{...createPoll.enhance(async ({ submit }) => {
			pollCreatorStore.error = '';
			const err = validateBeforeSubmit();
			if (err) {
				pollCreatorStore.error = err;
				return;
			}
			pollCreatorStore.isSubmitting = true;
			try {
				await submit();
				const id = createPoll.result?.id;
				if (id) {
					pollCreatorStore.reset();
					await goto(`/poll/${id}`);
				}
			} catch (e) {
				pollCreatorStore.error = e instanceof Error ? e.message : 'Une erreur est survenue';
			} finally {
				pollCreatorStore.isSubmitting = false;
			}
		})}
		class="space-y-6"
	>
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

		<!-- Charge utile JSON transmise via champ caché pour la remote form -->
		<input
			{...createPoll.fields.payload.as('text')}
			value={JSON.stringify(pollCreatorStore.getFormData())}
			type="hidden"
		/>

		<button
			type="submit"
			class="w-full px-6 py-3 bg-linear-to-tr from-blue-500 to-blue-600 text-white rounded-lg text-lg font-semibold transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
			disabled={pollCreatorStore.isSubmitting}
		>
			{pollCreatorStore.isSubmitting ? 'Création...' : 'Créer le sondage'}
		</button>
	</form>
</div>
