<script lang="ts">
	import { onMount } from 'svelte';
	import { votingInterfaceStore } from './votingInterfaceStore.svelte';
	import VotingHeader from './VotingHeader.svelte';
	import VotingNameInput from './VotingNameInput.svelte';
	import VotingBallot from './VotingBallot.svelte';
	import VotingStatusMessage from './VotingStatusMessage.svelte';
	import VotingParticipants from './VotingParticipants.svelte';
	import type { ParticipantsVisibility } from '$lib/types';

	interface Props {
		poll: {
			id: string;
			title: string;
			description: string | null;
			options: string[];
			grades: string[];
			preventMultipleVotes: boolean;
			expiresAt: Date | null;
			isExpired?: boolean;
			askName?: boolean;
			showParticipants: ParticipantsVisibility;
			voteCount?: number;
			participants?: string[];
		};
	}

	let { poll }: Props = $props();

	// Initialize store with poll data
	onMount(() => {
		votingInterfaceStore.initialize(poll);
		return () => votingInterfaceStore.reset();
	});

	async function handleSubmit(e: Event) {
		e.preventDefault();
		await votingInterfaceStore.submitVote();
	}

	// Determine current status
	const status = $derived.by(() => {
		if (votingInterfaceStore.expired) return 'expired';
		if (votingInterfaceStore.alreadyVoted && votingInterfaceStore.success) return 'success';
		if (votingInterfaceStore.alreadyVoted) return 'already_voted';
		return 'voting';
	});
</script>

<div class="max-w-3xl mx-auto">
	{#if status !== 'voting'}
		<VotingStatusMessage {status} pollId={poll.id} />
	{:else}
		<VotingHeader
			title={poll.title}
			description={poll.description}
			hasCountdown={votingInterfaceStore.hasCountdown}
			countdownText={votingInterfaceStore.countdownText}
			expired={votingInterfaceStore.expired}
		/>

		<form onsubmit={handleSubmit} class="space-y-6">
			<VotingNameInput askName={poll.askName ?? false} />

			<VotingBallot options={poll.options} grades={poll.grades} />

			{#if votingInterfaceStore.error}
				<div class="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-center">
					{votingInterfaceStore.error}
				</div>
			{/if}

			<button
				type="submit"
				class="w-full px-6 py-3 bg-linear-to-tr from-blue-500 to-blue-600 text-white rounded-lg text-lg font-semibold transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
				disabled={votingInterfaceStore.isSubmitting ||
					!votingInterfaceStore.isComplete() ||
					votingInterfaceStore.expired}
			>
				{votingInterfaceStore.isSubmitting ? 'Envoi...' : 'Soumettre mon vote'}
			</button>
		</form>

		<VotingParticipants
			participants={poll.participants}
			voteCount={poll.voteCount}
			showParticipants={poll.showParticipants}
			expired={votingInterfaceStore.expired}
		/>
	{/if}
</div>
