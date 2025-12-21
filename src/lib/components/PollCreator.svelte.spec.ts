import { describe, it, expect, vi } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import PollCreator from './PollCreator.svelte';

describe('PollCreator.svelte', () => {
	it('empêche la création si des options sont dupliquées (insensible à la casse)', async () => {
		// Mock fetch pour vérifier qu'il n'est pas appelé
		const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(JSON.stringify({ id: 'dummy' }), { status: 200 })
		);

		render(PollCreator);

		// Remplit le titre via le placeholder
		await page.getByPlaceholder('Ex: Meilleur langage de programmation').fill('Sondage de test');

		// Remplit deux options identiques (différence de casse)
		await page.getByPlaceholder('Option 1').fill('Java');
		await page.getByPlaceholder('Option 2').fill('java');

		// Soumet le formulaire
		await page.getByRole('button', { name: 'Créer le sondage' }).click();

		// Vérifie l'affichage de l'erreur
		await expect.element(page.getByText('Les options doivent être uniques')).toBeInTheDocument();

		// Vérifie que la requête réseau n'a pas été envoyée
		expect(fetchSpy).not.toHaveBeenCalled();

		fetchSpy.mockRestore();
	});
});
