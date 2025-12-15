<script lang="ts">
	import { goto } from '$app/navigation';
	import { generateVoterIdentifier, hasVotedLocally, markAsVoted } from '$lib/utils/voter';

	interface Props {
		poll: {
			id: string;
			title: string;
			description: string | null;
			candidates: string[];
			grades: string[];
		};
	}

	let { poll }: Props = $props();

	let ballot = $state<Record<string, number>>({});
	let isSubmitting = $state(false);
	let error = $state('');
	let success = $state(false);
	let alreadyVoted = $state(hasVotedLocally(poll.id));

	// Initialize ballot with null selections
	$effect(() => {
		const initialBallot: Record<string, number> = {};
		poll.candidates.forEach((candidate) => {
			initialBallot[candidate] = -1; // -1 means not selected yet
		});
		ballot = initialBallot;
	});

	function selectGrade(candidate: string, gradeIndex: number) {
		ballot[candidate] = gradeIndex;
	}

	function isComplete(): boolean {
		return poll.candidates.every((candidate) => ballot[candidate] >= 0);
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		error = '';

		if (!isComplete()) {
			error = 'Veuillez évaluer tous les candidats';
			return;
		}

		isSubmitting = true;

		try {
			// Generate voter identifier
			const voterIdentifier = await generateVoterIdentifier();

			const response = await fetch(`/api/polls/${poll.id}/vote`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					ballot,
					voterIdentifier
				})
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Erreur lors du vote');
			}

			// Mark as voted locally
			markAsVoted(poll.id);
			success = true;
			alreadyVoted = true;

			// Redirect to results after a short delay
			setTimeout(() => {
				goto(`/poll/${poll.id}/results`);
			}, 1500);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Une erreur est survenue';
		} finally {
			isSubmitting = false;
		}
	}

	// Get color for grade (gradient from green to red)
	function getGradeColor(index: number): string {
		const colors = [
			'#10b981', // Excellent - green
			'#34d399',
			'#fbbf24', // Bien - yellow
			'#fb923c',
			'#f97316', // Passable - orange
			'#ef4444',
			'#dc2626' // À rejeter - red
		];
		return colors[index] || '#6b7280';
	}
</script>

<div class="voting-interface">
	{#if alreadyVoted && success}
		<div class="success-message">
			<div class="success-icon">✓</div>
			<h3>Vote enregistré !</h3>
			<p>Redirection vers les résultats...</p>
		</div>
	{:else if alreadyVoted}
		<div class="already-voted">
			<p>Vous avez déjà voté pour ce sondage.</p>
			<a href="/poll/{poll.id}/results" class="btn-results">Voir les résultats</a>
		</div>
	{:else}
		<div class="poll-header">
			<h2>{poll.title}</h2>
			{#if poll.description}
				<p class="description">{poll.description}</p>
			{/if}
			<p class="instructions">Évaluez chaque candidat selon l'échelle du jugement majoritaire :</p>
		</div>

		<form onsubmit={handleSubmit}>
			<div class="candidates">
				{#each poll.candidates as candidate}
					<div class="candidate-card">
						<h3 class="candidate-name">{candidate}</h3>
						<div class="grades">
							{#each poll.grades as grade, gradeIndex}
								<button
									type="button"
									class="grade-button"
									class:selected={ballot[candidate] === gradeIndex}
									style="--grade-color: {getGradeColor(gradeIndex)}"
									onclick={() => selectGrade(candidate, gradeIndex)}
								>
									{grade}
								</button>
							{/each}
						</div>
					</div>
				{/each}
			</div>

			{#if error}
				<div class="error">{error}</div>
			{/if}

			<button type="submit" class="btn-submit" disabled={isSubmitting || !isComplete()}>
				{isSubmitting ? 'Envoi...' : 'Soumettre mon vote'}
			</button>
		</form>
	{/if}
</div>

<style>
	.voting-interface {
		max-width: 800px;
		margin: 0 auto;
	}

	.poll-header {
		margin-bottom: 2rem;
	}

	h2 {
		font-size: 2rem;
		font-weight: 700;
		margin-bottom: 0.75rem;
		color: #1f2937;
	}

	.description {
		font-size: 1.125rem;
		color: #6b7280;
		margin-bottom: 1rem;
	}

	.instructions {
		font-size: 0.95rem;
		color: #4b5563;
		font-style: italic;
	}

	.candidates {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		margin-bottom: 2rem;
	}

	.candidate-card {
		background: white;
		border: 2px solid #e5e7eb;
		border-radius: 0.75rem;
		padding: 1.5rem;
		transition: border-color 0.2s;
	}

	.candidate-card:has(.grade-button.selected) {
		border-color: #3b82f6;
	}

	.candidate-name {
		font-size: 1.25rem;
		font-weight: 600;
		margin-bottom: 1rem;
		color: #1f2937;
	}

	.grades {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
		gap: 0.5rem;
	}

	.grade-button {
		padding: 0.75rem 0.5rem;
		border: 2px solid #e5e7eb;
		border-radius: 0.5rem;
		background: white;
		color: #374151;
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
		text-align: center;
	}

	.grade-button:hover {
		border-color: var(--grade-color);
		transform: translateY(-2px);
	}

	.grade-button.selected {
		background: var(--grade-color);
		border-color: var(--grade-color);
		color: white;
		font-weight: 600;
		transform: scale(1.05);
	}

	.btn-submit {
		width: 100%;
		padding: 1rem 1.5rem;
		background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
		color: white;
		border: none;
		border-radius: 0.5rem;
		font-size: 1.125rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-submit:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);
	}

	.btn-submit:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.error {
		padding: 0.75rem;
		background: #fef2f2;
		border: 1px solid #fecaca;
		border-radius: 0.375rem;
		color: #dc2626;
		margin-bottom: 1rem;
		text-align: center;
	}

	.success-message {
		text-align: center;
		padding: 3rem 2rem;
	}

	.success-icon {
		width: 80px;
		height: 80px;
		margin: 0 auto 1.5rem;
		background: linear-gradient(135deg, #10b981 0%, #059669 100%);
		color: white;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 3rem;
		animation: scaleIn 0.5s ease-out;
	}

	@keyframes scaleIn {
		from {
			transform: scale(0);
		}
		to {
			transform: scale(1);
		}
	}

	.success-message h3 {
		font-size: 1.75rem;
		font-weight: 700;
		color: #1f2937;
		margin-bottom: 0.5rem;
	}

	.already-voted {
		text-align: center;
		padding: 3rem 2rem;
	}

	.already-voted p {
		font-size: 1.25rem;
		color: #6b7280;
		margin-bottom: 1.5rem;
	}

	.btn-results {
		display: inline-block;
		padding: 0.875rem 1.5rem;
		background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
		color: white;
		text-decoration: none;
		border-radius: 0.5rem;
		font-weight: 600;
		transition: all 0.2s;
	}

	.btn-results:hover {
		transform: translateY(-2px);
		box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);
	}
</style>
