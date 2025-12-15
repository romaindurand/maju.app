// Multi-layered voter identification system
// Combines browser fingerprint, localStorage, and cookies

import { generateBrowserFingerprint } from './fingerprint';
import { VOTER_CONFIG } from '$lib/config';

// Generate a unique voter identifier combining multiple sources
export async function generateVoterIdentifier(): Promise<string> {
	const components: string[] = [];

	// 1. Browser fingerprint
	const fingerprint = await generateBrowserFingerprint();
	components.push(`fp:${fingerprint}`);

	// 2. localStorage token (persistent across sessions)
	let localStorageToken = '';
	if (typeof localStorage !== 'undefined') {
		localStorageToken = localStorage.getItem(VOTER_CONFIG.localStorageKey) || '';
		if (!localStorageToken) {
			localStorageToken = generateRandomToken();
			localStorage.setItem(VOTER_CONFIG.localStorageKey, localStorageToken);
		}
		components.push(`ls:${localStorageToken}`);
	}

	// 3. Cookie token (will be set server-side, but we read it here if available)
	const cookieToken = getCookie(VOTER_CONFIG.cookieName);
	if (cookieToken) {
		components.push(`ck:${cookieToken}`);
	}

	// Combine and hash all components
	const combinedString = components.join('|');
	return await hashString(combinedString);
}

// Check if user has already voted on a specific poll (client-side check)
export function hasVotedLocally(pollId: string): boolean {
	if (typeof localStorage === 'undefined') return false;

	const votedPolls = localStorage.getItem('maju_voted_polls');
	if (!votedPolls) return false;

	try {
		const polls = JSON.parse(votedPolls) as string[];
		return polls.includes(pollId);
	} catch {
		return false;
	}
}

// Mark poll as voted (client-side)
export function markAsVoted(pollId: string): void {
	if (typeof localStorage === 'undefined') return;

	const votedPolls = localStorage.getItem('maju_voted_polls');
	let polls: string[] = [];

	if (votedPolls) {
		try {
			polls = JSON.parse(votedPolls) as string[];
		} catch {
			polls = [];
		}
	}

	if (!polls.includes(pollId)) {
		polls.push(pollId);
		localStorage.setItem('maju_voted_polls', JSON.stringify(polls));
	}
}

// Generate a random token
function generateRandomToken(): string {
	const array = new Uint8Array(32);
	crypto.getRandomValues(array);
	return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

// Get cookie value by name
function getCookie(name: string): string | null {
	if (typeof document === 'undefined') return null;

	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) {
		return parts.pop()?.split(';').shift() || null;
	}
	return null;
}

// Hash string using SHA-256
async function hashString(str: string): Promise<string> {
	const encoder = new TextEncoder();
	const data = encoder.encode(str);
	const hashBuffer = await crypto.subtle.digest('SHA-256', data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}
