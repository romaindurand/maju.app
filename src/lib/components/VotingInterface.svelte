<script lang="ts">
	import { goto } from '$app/navigation';
	import { generateVoterIdentifier, hasVotedLocally, markAsVoted } from '$lib/utils/voter';
	import { generateBrowserFingerprint } from '$lib/utils/fingerprint';

	interface Props {
		poll: {
			id: string;
			title: string;
			description: string | null;
			options: string[];
			grades: string[];
			preventMultipleVotes: boolean;
			expiresAt?: string | Date;
			isExpired?: boolean;
			askName?: boolean;
			showParticipants?: 'always' | 'after_expiration' | 'never';
			voteCount?: number;
			participants?: string[];
		};
	}

	let { poll }: Props = $props();

	let ballot = $state<Record<string, number>>({});
	let isSubmitting = $state(false);
	let error = $state('');
	let success = $state(false);
	let alreadyVoted = $derived(poll.preventMultipleVotes && hasVotedLocally(poll.id));
	let firstName = $state('');

	// Countdown state
	let remainingMs = $state(0);
	let countdownText = $derived(formatCountdown(remainingMs));
	let hasCountdown = $derived(!!parseExpiresAt());
	let expired = $derived(hasCountdown ? remainingMs <= 0 || poll.isExpired === true : false);

	function parseExpiresAt(): Date | null {
		if (!poll.expiresAt) return null;
		const d =
			typeof poll.expiresAt === 'string' ? new Date(poll.expiresAt) : (poll.expiresAt as Date);
		return isNaN(d.getTime()) ? null : d;
	}

	function formatCountdown(ms: number): string {
		if (ms <= 0) return '00:00:00';
		const totalSeconds = Math.floor(ms / 1000);
		const days = Math.floor(totalSeconds / 86400);
		const hours = Math.floor((totalSeconds % 86400) / 3600);
		const minutes = Math.floor((totalSeconds % 3600) / 60);
		const seconds = totalSeconds % 60;
		const hh = String(hours).padStart(2, '0');
		const mm = String(minutes).padStart(2, '0');
		const ss = String(seconds).padStart(2, '0');
		return days > 0 ? `${days}j ${hh}:${mm}:${ss}` : `${hh}:${mm}:${ss}`;
	}

	// Init countdown
	{
		if (typeof window !== 'undefined') {
			const target = parseExpiresAt();
			if (target) {
				let timer: number | undefined;
				const update = () => {
					remainingMs = target.getTime() - Date.now();
					if ((remainingMs <= 0 || poll.isExpired === true) && timer !== undefined) {
						clearInterval(timer);
					}
				};
				update();
				timer = setInterval(update, 1000) as unknown as number;
			}
		}
	}

	// Initialize ballot with null selections (single init)
	// svelte-ignore state_referenced_locally
	ballot = Object.fromEntries(poll.options.map((option) => [option, -1])) as Record<string, number>;

	function selectGrade(option: string, gradeIndex: number) {
		ballot[option] = gradeIndex;
	}

	function isComplete(): boolean {
		return poll.options.every((option) => ballot[option] >= 0);
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		error = '';

		if (expired) {
			error = 'Le sondage est terminé';
			return;
		}

		if (!isComplete()) {
			error = 'Veuillez évaluer toutes les options';
			return;
		}

		if (poll.askName && !firstName.trim()) {
			error = 'Veuillez saisir votre prénom';
			return;
		}

		isSubmitting = true;

		try {
			// Generate voter identifier and fingerprint
			const voterIdentifier = await generateVoterIdentifier();
			const fingerprint = await generateBrowserFingerprint();

			const response = await fetch(`/api/polls/${poll.id}/vote`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					ballot,
					voterIdentifier,
					fingerprint,
					...(poll.askName ? { name: firstName.trim() } : {})
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
		} catch (err) {
			error = err instanceof Error ? err.message : 'Une erreur est survenue';
		} finally {
			isSubmitting = false;
		}
	}

	// Get color for grade (gradient from green to red)
	function getGradeColor(index: number): string {
		const colors = [
			'#dc2626', // À rejeter - red
			'#ef4444',
			'#f97316', // Passable - orange
			'#fb923c',
			'#fbbf24', // Bien - yellow
			'#34d399',
			'#10b981' // Excellent - green
		];
		return colors[index] || '#6b7280';
	}
</script>

<div class="max-w-3xl mx-auto">
	{#if expired}
		<div class="text-center p-12">
			<h3 class="text-2xl font-bold text-gray-800 mb-2">Sondage terminé</h3>
			<p class="text-gray-600 mb-6">Les votes ne sont plus possibles.</p>
			<a
				href="/poll/{poll.id}/results"
				class="inline-block px-6 py-3 bg-linear-to-tr from-blue-500 to-blue-600 text-white rounded-lg font-semibold transition hover:-translate-y-0.5 hover:shadow-lg"
				>Voir les résultats</a
			>
		</div>
	{:else if alreadyVoted && success}
		<div class="text-center p-12">
			<div
				class="w-20 h-20 mx-auto mb-6 bg-linear-to-tr from-emerald-500 to-emerald-600 text-white rounded-full flex items-center justify-center text-3xl"
			>
				✓
			</div>
			<h3 class="text-2xl font-bold text-gray-800 mb-2">Vote enregistré !</h3>
			<p class="text-gray-600 mb-6">Votre vote a bien été pris en compte.</p>
			<a
				href="/poll/{poll.id}/results"
				class="inline-block px-6 py-3 bg-linear-to-tr from-blue-500 to-blue-600 text-white rounded-lg font-semibold transition hover:-translate-y-0.5 hover:shadow-lg"
				>Voir les résultats</a
			>
		</div>
	{:else if alreadyVoted}
		<div class="text-center p-12">
			<p class="text-xl text-gray-500 mb-6">Vous avez déjà voté pour ce sondage.</p>
			<a
				href="/poll/{poll.id}/results"
				class="inline-block px-6 py-3 bg-linear-to-tr from-blue-500 to-blue-600 text-white rounded-lg font-semibold transition hover:-translate-y-0.5 hover:shadow-lg"
				>Voir les résultats</a
			>
		</div>
	{:else}
		<div class="mb-8">
			<h2 class="text-3xl font-bold mb-3 text-gray-800">{poll.title}</h2>
			{#if poll.description}
				<p class="text-lg text-gray-500 mb-4">{poll.description}</p>
			{/if}
			<div class="flex items-center justify-between gap-4">
				<p class="text-sm text-gray-600 italic">
					Évaluez chaque option selon l'échelle du jugement majoritaire :
				</p>
				<div class="text-sm font-medium text-gray-700">
					{#if hasCountdown}
						{#if !expired}
							<span class="inline-flex items-center gap-2 px-3 py-1 rounded bg-gray-100 border"
								>⏳ Termine dans {countdownText}</span
							>
						{:else}
							<span
								class="inline-flex items-center gap-2 px-3 py-1 rounded bg-red-50 border border-red-200 text-red-700"
								>Sondage terminé</span
							>
						{/if}
					{/if}
				</div>
			</div>
		</div>

		<form onsubmit={handleSubmit} class="space-y-6">
			{#if poll.askName}
				<div>
					<label for="first-name" class="block font-semibold mb-2 text-gray-700">Votre prénom</label
					>
					<input
						id="first-name"
						type="text"
						placeholder="Ex: Alice"
						bind:value={firstName}
						class="w-full p-3 border-2 border-gray-200 rounded-lg text-base focus:outline-none focus:border-blue-500"
					/>
					<p class="text-xs text-gray-500 mt-1">
						Ce prénom sera visible selon la configuration du sondage.
					</p>
				</div>
			{/if}
			<div class="flex flex-col gap-6 mb-8">
				{#each poll.options as option (option)}
					<div
						class="bg-white border-2 border-gray-200 rounded-xl p-6 transition"
						class:border-blue-500={ballot[option] >= 0}
					>
						<h3 class="text-xl font-semibold mb-4 text-gray-800">{option}</h3>
						<div class="flex flex-col sm:flex-row sm:flex-nowrap gap-2">
							{#each poll.grades as grade, gradeIndex (gradeIndex)}
								<button
									type="button"
									onclick={() => selectGrade(option, gradeIndex)}
									class="px-2 sm:px-3 py-1 sm:py-2 border-2 rounded-md bg-white text-gray-700 text-xs sm:text-sm font-medium transition text-center hover:-translate-y-0.5"
									style="
										border-color: {getGradeColor(gradeIndex)};
										background-color: {ballot[option] === gradeIndex ? getGradeColor(gradeIndex) : ''};
										color: {ballot[option] === gradeIndex ? '#fff' : ''};
									"
								>
									{grade}
								</button>
							{/each}
						</div>
					</div>
				{/each}
			</div>

			{#if error}
				<div class="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-center">
					{error}
				</div>
			{/if}

			<button
				type="submit"
				class="w-full px-6 py-3 bg-linear-to-tr from-blue-500 to-blue-600 text-white rounded-lg text-lg font-semibold transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
				disabled={isSubmitting || !isComplete() || expired}
			>
				{isSubmitting ? 'Envoi...' : 'Soumettre mon vote'}
			</button>
		</form>

		{#if poll.participants && (poll.voteCount ?? poll.participants.length) >= 2}
			<div class="mt-10 bg-gray-50 p-4 rounded-lg border border-gray-200">
				<h4 class="font-semibold text-gray-800 mb-2">
					Participants ({poll.participants.length})
				</h4>
				<ul class="list-disc pl-5 text-gray-700">
					{#each poll.participants as p, i (i)}
						<li>{p}</li>
					{/each}
				</ul>
			</div>
		{:else if poll.voteCount === 1}
			<div class="mt-10 bg-gray-50 p-4 rounded-lg border border-gray-200 text-gray-700">
				1 personne a voté.
			</div>
		{/if}
	{/if}
</div>

<!-- Styles supprimés au profit des utilitaires Tailwind -->
