// Configuration for the majority judgment polling application

export const DEFAULT_GRADES = [
	'Excellent',
	'Très bien',
	'Bien',
	'Assez bien',
	'Passable',
	'Insuffisant',
	'À rejeter'
] as const;

export type Grade = (typeof DEFAULT_GRADES)[number];

// Configuration for voter identification
export const VOTER_CONFIG = {
	cookieName: 'maju_voter_id',
	cookieMaxAge: 365 * 24 * 60 * 60, // 1 year in seconds
	localStorageKey: 'maju_voter_token'
} as const;
