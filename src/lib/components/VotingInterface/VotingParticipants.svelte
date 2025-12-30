<script lang="ts">
	interface Props {
		participants?: string[];
		voteCount?: number;
		showParticipants?: 'always' | 'after_expiration' | 'never';
		expired: boolean;
	}

	let { participants, voteCount, showParticipants = 'never', expired }: Props = $props();

	const shouldShowParticipants = $derived(
		participants &&
			participants.length > 0 &&
			(showParticipants === 'always' || (showParticipants === 'after_expiration' && expired))
	);

	const count = $derived(voteCount ?? participants?.length ?? 0);
</script>

{#if shouldShowParticipants && count >= 2}
	<div class="mt-10 bg-gray-50 p-4 rounded-lg border border-gray-200">
		<h4 class="font-semibold text-gray-800 mb-2">Participants ({participants?.length})</h4>
		<ul class="list-disc pl-5 text-gray-700">
			{#each participants as p, i (i)}
				<li>{p}</li>
			{/each}
		</ul>
	</div>
{:else if count === 1}
	<div class="mt-10 bg-gray-50 p-4 rounded-lg border border-gray-200 text-gray-700">
		1 personne a voté.
	</div>
{/if}
