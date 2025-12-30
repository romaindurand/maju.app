<script lang="ts">
	import { votingInterfaceStore } from './votingInterfaceStore.svelte';
	import { getGradeColor } from '$lib/utils/grades';

	interface Props {
		options: string[];
		grades: string[];
	}

	let { options, grades }: Props = $props();
</script>

<div class="flex flex-col gap-6 mb-8">
	{#each options as option (option)}
		<div
			class="bg-white border-2 border-gray-200 rounded-xl p-6 transition"
			class:border-blue-500={votingInterfaceStore.ballot[option] >= 0}
		>
			<h3 class="text-xl font-semibold mb-4 text-gray-800">{option}</h3>
			<div class="flex flex-col sm:flex-row sm:flex-nowrap gap-2">
				{#each grades as grade, gradeIndex (gradeIndex)}
					<button
						type="button"
						onclick={() => votingInterfaceStore.selectGrade(option, gradeIndex)}
						class="px-2 sm:px-3 py-1 sm:py-2 border-2 rounded-md bg-white text-gray-700 text-xs sm:text-sm font-medium transition text-center hover:-translate-y-0.5"
						style="
							border-color: {getGradeColor(grades.length, gradeIndex)};
							background-color: {votingInterfaceStore.ballot[option] === gradeIndex
							? getGradeColor(grades.length, gradeIndex)
							: ''};
							color: {votingInterfaceStore.ballot[option] === gradeIndex ? '#fff' : ''};
						"
					>
						{grade}
					</button>
				{/each}
			</div>
		</div>
	{/each}
</div>
