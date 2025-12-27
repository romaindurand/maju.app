<script lang="ts">
	import { goto } from '$app/navigation';
	import { DEFAULT_GRADES } from '$lib/config';
	import { tick } from 'svelte';
	import ToggleSwitch from '$lib/components/ToggleSwitch.svelte';
	import { slide } from 'svelte/transition';

	let title = $state('');
	let description = $state('');
	let options = $state(['', '']);
	let optionRefs: HTMLInputElement[] = [];
	let isSubmitting = $state(false);
	let error = $state('');
	let preventMultipleVotes = $state(true);
	let askName = $state(false);
	let showParticipants: 'always' | 'after_expiration' | 'never' = $state('never');

	// Expiration configuration
	let expirationMode: 'duration' | 'datetime' | 'none' = $state('duration');
	let durationHours = $state(24);
	let durationMinutes = $state(0);
	let expiresAtLocal = $state(''); // YYYY-MM-DDTHH:MM (local)

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
					grades: DEFAULT_GRADES,
					preventMultipleVotes,
					askName,
					showParticipants,
					...(expirationMode === 'none'
						? { noTimeLimit: true }
						: expirationMode === 'datetime'
							? (() => {
									// Convert datetime-local to ISO
									const local = expiresAtLocal?.trim();
									if (local) {
										// Treat as local time, create Date
										const d = new Date(local);
										if (!isNaN(d.getTime())) {
											return { expiresAt: d.toISOString() };
										}
									}
									return {};
								})()
							: {
									durationSeconds: Math.max(60, durationHours * 3600 + durationMinutes * 60)
								})
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
			<label for="description" class="block font-semibold mb-2 text-gray-700"
				>Description (optionnel)</label
			>
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

		<fieldset class="mt-6">
			<legend class="mb-2 font-semibold text-gray-700">Paramètres</legend>
			<ToggleSwitch
				label="Interdire les votes multiples"
				description="Empêche un même utilisateur de voter plusieurs fois pour ce sondage."
				bind:checked={preventMultipleVotes}
			/>

			<div class="mt-4 space-y-4">
				<ToggleSwitch
					label="Demander le prénom"
					description="Chaque participant devra saisir son prénom avant de voter."
					bind:checked={askName}
				/>

				{#if askName}
					<div class="bg-white border-2 border-gray-200 rounded-lg p-4" transition:slide>
						<label for="show-participants" class="block font-semibold text-gray-700 mb-2"
							>Affichage des participants</label
						>
						<select
							id="show-participants"
							bind:value={showParticipants}
							class="w-full p-2 border-2 border-gray-200 rounded"
						>
							<option value="never">Ne pas montrer</option>
							<option value="always">Montrer</option>
							{#if expirationMode !== 'none'}
								<option value="after_expiration">Montrer après l'expiration du sondage</option>
							{/if}
						</select>

						<p class="text-sm text-gray-500 mt-2">
							La liste des prénoms sera visible sur la page de vote et les résultats selon le mode choisi.
						</p>
					</div>
				{/if}
			</div>

			<div class="mt-6 border-2 border-gray-200 rounded-lg p-4">
				<h3 class="font-semibold text-gray-700 mb-3">Expiration du sondage</h3>
				<div class="flex flex-wrap gap-3 mb-4">
					<label class="inline-flex items-center gap-2">
						<input
							type="radio"
							name="exp-mode"
							value="duration"
							checked={expirationMode === 'duration'}
							onchange={() => (expirationMode = 'duration')}
						/>
						<span>Durée</span>
					</label>
					<label class="inline-flex items-center gap-2">
						<input
							type="radio"
							name="exp-mode"
							value="datetime"
							checked={expirationMode === 'datetime'}
							onchange={() => (expirationMode = 'datetime')}
						/>
						<span>Date/Heure</span>
					</label>
					<label class="inline-flex items-center gap-2">
						<input
							type="radio"
							name="exp-mode"
							value="none"
							checked={expirationMode === 'none'}
							onchange={() => {
								expirationMode = 'none';
								if (showParticipants === 'after_expiration') {
									showParticipants = 'never';
								}
							}}
						/>
						<span>Aucune limite</span>
					</label>
				</div>

				{#if expirationMode === 'duration'}
					<div class="flex items-center gap-3">
						<div>
							<label for="exp-hours" class="block text-sm text-gray-600 mb-1">Heures</label>
							<input
								id="exp-hours"
								type="number"
								min="0"
								max="168"
								bind:value={durationHours}
								class="w-24 p-2 border-2 border-gray-200 rounded"
							/>
						</div>
						<div>
							<label for="exp-mins" class="block text-sm text-gray-600 mb-1">Minutes</label>
							<input
								id="exp-mins"
								type="number"
								min="0"
								max="59"
								bind:value={durationMinutes}
								class="w-24 p-2 border-2 border-gray-200 rounded"
							/>
						</div>
					</div>
				{:else if expirationMode === 'datetime'}
					<div>
						<label for="exp-datetime" class="block text-sm text-gray-600 mb-1"
							>Date et heure de fin</label
						>
						<input
							id="exp-datetime"
							type="datetime-local"
							bind:value={expiresAtLocal}
							class="p-2 border-2 border-gray-200 rounded w-64"
						/>
					</div>
				{:else}
					<div class="text-sm text-gray-600">Le sondage n’aura pas de limite de temps.</div>
				{/if}
			</div>
		</fieldset>

		{#if error}
			<div class="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 mb-4">{error}</div>
		{/if}

		<button
			type="submit"
			class="w-full px-6 py-3 bg-linear-to-tr from-blue-500 to-blue-600 text-white rounded-lg text-lg font-semibold transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
			disabled={isSubmitting}
		>
			{isSubmitting ? 'Création...' : 'Créer le sondage'}
		</button>
	</form>
</div>
