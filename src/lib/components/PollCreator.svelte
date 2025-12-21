<script lang="ts">
	import { goto } from '$app/navigation';
	import { DEFAULT_GRADES } from '$lib/config';
	import { tick } from 'svelte';

	let title = $state('');
	let description = $state('');
	let options = $state(['', '']);
	let optionRefs: HTMLInputElement[] = [];
	let isSubmitting = $state(false);
	let error = $state('');

	function setOptionRef(idx: number) {
		return (node: HTMLInputElement) => {
			optionRefs[idx] = node;
			return () => {
				// Optionnel: nettoyage si nécessaire
				optionRefs[idx] = undefined as unknown as HTMLInputElement;
			};
		};
	}

	async function addOption() {
		options = [...options, ''];
		await tick();
		// Focus sur le nouvel input créé
		optionRefs[options.length - 1]?.focus();
	}

	function removeOption(index: number) {
		if (options.length > 2) {
			options = options.filter((_, i) => i !== index);
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

		const validOptions = options.filter((c) => c.trim());
		if (validOptions.length < 2) {
			error = 'Au moins 2 options sont requises';
			return;
		}

		// Duplicate validation (case-insensitive, trimmed)
		const normalized = validOptions.map((c) => c.trim().toLowerCase());
		const seen: Record<string, true> = {};
		for (let i = 0; i < normalized.length; i++) {
			const val = normalized[i];
			if (seen[val]) {
				error = 'Les options doivent être uniques';
				return;
			}
			seen[val] = true;
		}

		isSubmitting = true;

		try {
			const response = await fetch('/api/polls', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					title: title.trim(),
					description: description.trim() || null,
					options: validOptions,
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

<div class="max-w-xl mx-auto">
	<h2 class="text-3xl font-bold mb-6 text-gray-800">Créer un nouveau sondage</h2>

	<form onsubmit={handleSubmit} class="space-y-6">
		<div>
			<label for="title" class="block font-semibold mb-2 text-gray-700">Titre du sondage *</label>
			<input
				id="title"
				type="text"
				bind:value={title}
				placeholder="Ex: Meilleur langage de programmation"
				required
				class="w-full p-3 border-2 border-gray-200 rounded-lg text-base focus:outline-none focus:border-blue-500"
			/>
		</div>

		<div>
			<label for="description" class="block font-semibold mb-2 text-gray-700">Description (optionnel)</label>
			<textarea
				id="description"
				bind:value={description}
				placeholder="Décrivez votre sondage..."
				rows="3"
				class="w-full p-3 border-2 border-gray-200 rounded-lg text-base focus:outline-none focus:border-blue-500"
			></textarea>
		</div>

		<fieldset>
			<legend class="mb-2 font-semibold text-gray-700">Options *</legend>
			<div class="flex flex-col gap-3 mb-3">
				{#each options as option, index (index)}
					<div class="flex items-center gap-2">
						<input
							type="text"
							bind:value={options[index]}
							{@attach setOptionRef(index)}
							placeholder={`Option ${index + 1}`}
							required
							class="flex-1 p-3 border-2 border-gray-200 rounded-lg text-base focus:outline-none focus:border-blue-500"
						/>
						{#if options.length > 2}
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

		{#if error}
			<div class="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 mb-4">{error}</div>
		{/if}

		<button
			type="submit"
			class="w-full px-6 py-3 bg-gradient-to-tr from-blue-500 to-blue-600 text-white rounded-lg text-lg font-semibold transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
			disabled={isSubmitting}
		>
			{isSubmitting ? 'Création...' : 'Créer le sondage'}
		</button>
	</form>
</div>
