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

// Coefficients for popularity score calculation
// Score =
//   creationFreshness * f(age since creation)
// + totalVotes       * total_votes
// + votesLast24h     * recent_24h_votes
// + lastVoteRecency  * f(time since last vote)
export const POPULARITY_COEFFS = {
	creationFreshness: 0.25,
	totalVotes: 0.25,
	votesLast24h: 0.35,
	lastVoteRecency: 0.15
} as const;

export type PopularityCoeffs = typeof POPULARITY_COEFFS;
