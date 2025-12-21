// Configuration for the majority judgment polling application

export const DEFAULT_GRADES = [
	'À rejeter',
	'Insuffisant',
	'Passable',
	'Assez bien',
	'Bien',
	'Très bien'
] as const;

export type Grade = (typeof DEFAULT_GRADES)[number];

// Configuration for voter identification
export const VOTER_CONFIG = {
	cookieName: 'maju_voter_id',
	cookieMaxAge: 365 * 24 * 60 * 60, // 1 year in seconds
	localStorageKey: 'maju_voter_token'
} as const;
