<script lang="ts">
	import { goto } from '$app/navigation';
	import { DEFAULT_GRADES } from '$lib/config';

	let title = $state('');
	let description = $state('');
	let candidates = $state(['', '']);
	let isSubmitting = $state(false);
	let error = $state('');

	function addCandidate() {
		candidates = [...candidates, ''];
	}

	function removeCandidate(index: number) {
		if (candidates.length > 2) {
			candidates = candidates.filter((_, i) => i !== index);
		}
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		error = '';

		// Validate
		if (!title.trim()) {
			error = 'Le titre est requis';
			return;
		}

		const validCandidates = candidates.filter((c) => c.trim());
		if (validCandidates.length < 2) {
			error = 'Au moins 2 candidats sont requis';
			return;
		}

		isSubmitting = true;

		try {
			const response = await fetch('/api/polls', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					title: title.trim(),
					description: description.trim() || null,
					candidates: validCandidates,
					grades: DEFAULT_GRADES
				})
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Erreur lors de la création du sondage');
			}

			const poll = await response.json();
			goto(`/poll/${poll.id}`);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Une erreur est survenue';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="poll-creator">
	<h2>Créer un nouveau sondage</h2>

	<form onsubmit={handleSubmit}>
		<div class="form-group">
			<label for="title">Titre du sondage *</label>
			<input
				id="title"
				type="text"
				bind:value={title}
				placeholder="Ex: Meilleur langage de programmation"
				required
			/>
		</div>

		<div class="form-group">
			<label for="description">Description (optionnel)</label>
			<textarea
				id="description"
				bind:value={description}
				placeholder="Décrivez votre sondage..."
				rows="3"
			></textarea>
		</div>

		<div class="form-group">
			<label>Candidats *</label>
			<div class="candidates-list">
				{#each candidates as candidate, index}
					<div class="candidate-input">
						<input
							type="text"
							bind:value={candidates[index]}
							placeholder={`Candidat ${index + 1}`}
							required
						/>
						{#if candidates.length > 2}
							<button
								type="button"
								class="btn-remove"
								onclick={() => removeCandidate(index)}
								aria-label="Supprimer"
							>
								✕
							</button>
						{/if}
					</div>
				{/each}
			</div>
			<button type="button" class="btn-add" onclick={addCandidate}> + Ajouter un candidat </button>
		</div>

		{#if error}
			<div class="error">{error}</div>
		{/if}

		<button type="submit" class="btn-primary" disabled={isSubmitting}>
			{isSubmitting ? 'Création...' : 'Créer le sondage'}
		</button>
	</form>
</div>

<style>
	.poll-creator {
		max-width: 600px;
		margin: 0 auto;
	}

	h2 {
		font-size: 1.75rem;
		font-weight: 700;
		margin-bottom: 1.5rem;
		color: #1f2937;
	}

	.form-group {
		margin-bottom: 1.5rem;
	}

	label {
		display: block;
		font-weight: 600;
		margin-bottom: 0.5rem;
		color: #374151;
	}

	input[type='text'],
	textarea {
		width: 100%;
		padding: 0.75rem;
		border: 2px solid #e5e7eb;
		border-radius: 0.5rem;
		font-size: 1rem;
		transition: border-color 0.2s;
	}

	input[type='text']:focus,
	textarea:focus {
		outline: none;
		border-color: #3b82f6;
	}

	.candidates-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-bottom: 0.75rem;
	}

	.candidate-input {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	.candidate-input input {
		flex: 1;
	}

	.btn-remove {
		padding: 0.5rem 0.75rem;
		background: #ef4444;
		color: white;
		border: none;
		border-radius: 0.375rem;
		cursor: pointer;
		font-size: 1.25rem;
		line-height: 1;
		transition: background-color 0.2s;
	}

	.btn-remove:hover {
		background: #dc2626;
	}

	.btn-add {
		padding: 0.5rem 1rem;
		background: #f3f4f6;
		color: #374151;
		border: 2px dashed #d1d5db;
		border-radius: 0.375rem;
		cursor: pointer;
		font-weight: 500;
		transition: all 0.2s;
	}

	.btn-add:hover {
		background: #e5e7eb;
		border-color: #9ca3af;
	}

	.btn-primary {
		width: 100%;
		padding: 0.875rem 1.5rem;
		background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
		color: white;
		border: none;
		border-radius: 0.5rem;
		font-size: 1.125rem;
		font-weight: 600;
		cursor: pointer;
		transition:
			transform 0.2s,
			box-shadow 0.2s;
	}

	.btn-primary:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);
	}

	.btn-primary:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.error {
		padding: 0.75rem;
		background: #fef2f2;
		border: 1px solid #fecaca;
		border-radius: 0.375rem;
		color: #dc2626;
		margin-bottom: 1rem;
	}
</style>
