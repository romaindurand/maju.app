import { page } from 'vitest/browser';
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-svelte';
import ResultsDisplay from './ResultsDisplay.svelte';
import type { ParticipantsVisibility } from '$lib/types';

describe('ResultsDisplay', () => {
	const baseResults = {
		pollId: 'test',
		title: 'Sondage',
		description: null as string | null,
		totalVotes: 1,
		expiresAt: null,
		isExpired: false,
		showParticipants: 'never' as ParticipantsVisibility,
		ranking: [
			{
				rank: 0,
				name: 'Option A',
				medianGrade: 0,
				medianGradeLabel: 'Mauvais',
				distribution: [{ gradeIndex: 0, label: 'Mauvais', count: 1, percentage: 100 }]
			}
		],
		grades: ['Mauvais', 'Moyen', 'Bon']
	};

	it("n'affiche pas le message 1 personne a voté quand askName=false", async () => {
		render(ResultsDisplay, { results: { ...baseResults, askName: false } });
		await expect.element(page.getByText('1 personne a voté.')).not.toBeInTheDocument();
	});

	it('affiche le message 1 personne a voté quand askName=true', async () => {
		render(ResultsDisplay, { results: { ...baseResults, askName: true } });
		await expect.element(page.getByText('1 personne a voté.')).toBeInTheDocument();
	});
});
