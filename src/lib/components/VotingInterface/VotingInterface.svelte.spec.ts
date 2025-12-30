import { describe, it, expect, beforeEach, vi } from 'vitest';
import { votingInterfaceStore } from './votingInterfaceStore.svelte';

// Mock the voter utilities
vi.mock('$lib/utils/voter', () => ({
  generateVoterIdentifier: vi.fn(() => Promise.resolve('test-voter-id')),
  hasVotedLocally: vi.fn(() => false),
  markAsVoted: vi.fn()
}));

vi.mock('$lib/utils/fingerprint', () => ({
  generateBrowserFingerprint: vi.fn(() => Promise.resolve('test-fingerprint'))
}));

describe('VotingInterfaceStore', () => {
  const mockPoll = {
    id: 'test-poll-id',
    title: 'Test Poll',
    description: 'Test Description',
    options: ['Option 1', 'Option 2', 'Option 3'],
    grades: ['À rejeter', 'Insuffisant', 'Passable', 'Assez bien', 'Bien', 'Très bien'],
    preventMultipleVotes: true,
    askName: false
  };

  beforeEach(() => {
    votingInterfaceStore.reset();
    vi.clearAllMocks();
  });

  it('should initialize with poll data', () => {
    votingInterfaceStore.initialize(mockPoll);

    expect(votingInterfaceStore.poll).toEqual(mockPoll);
    expect(votingInterfaceStore.ballot).toEqual({
      'Option 1': -1,
      'Option 2': -1,
      'Option 3': -1
    });
    expect(votingInterfaceStore.firstName).toBe('');
    expect(votingInterfaceStore.error).toBe('');
    expect(votingInterfaceStore.success).toBe(false);
  });

  it('should select grades for options', () => {
    votingInterfaceStore.initialize(mockPoll);

    votingInterfaceStore.selectGrade('Option 1', 3);
    votingInterfaceStore.selectGrade('Option 2', 5);

    expect(votingInterfaceStore.ballot['Option 1']).toBe(3);
    expect(votingInterfaceStore.ballot['Option 2']).toBe(5);
    expect(votingInterfaceStore.ballot['Option 3']).toBe(-1);
  });

  it('should check if ballot is complete', () => {
    votingInterfaceStore.initialize(mockPoll);

    expect(votingInterfaceStore.isComplete()).toBe(false);

    votingInterfaceStore.selectGrade('Option 1', 3);
    votingInterfaceStore.selectGrade('Option 2', 5);
    expect(votingInterfaceStore.isComplete()).toBe(false);

    votingInterfaceStore.selectGrade('Option 3', 2);
    expect(votingInterfaceStore.isComplete()).toBe(true);
  });

  it('should return correct grade colors', () => {
    expect(votingInterfaceStore.getGradeColor(0)).toBe('#dc2626');
    expect(votingInterfaceStore.getGradeColor(6)).toBe('#10b981');
    expect(votingInterfaceStore.getGradeColor(99)).toBe('#6b7280');
  });

  it('should validate incomplete ballot on submit', async () => {
    votingInterfaceStore.initialize(mockPoll);

    await votingInterfaceStore.submitVote();

    expect(votingInterfaceStore.error).toBe('Veuillez évaluer toutes les options');
    expect(votingInterfaceStore.isSubmitting).toBe(false);
  });

  it('should validate missing name when required', async () => {
    const pollWithName = { ...mockPoll, askName: true };
    votingInterfaceStore.initialize(pollWithName);

    // Complete ballot
    votingInterfaceStore.selectGrade('Option 1', 3);
    votingInterfaceStore.selectGrade('Option 2', 5);
    votingInterfaceStore.selectGrade('Option 3', 2);

    await votingInterfaceStore.submitVote();

    expect(votingInterfaceStore.error).toBe('Veuillez saisir votre prénom');
  });

  it('should reset store correctly', () => {
    votingInterfaceStore.initialize(mockPoll);
    votingInterfaceStore.selectGrade('Option 1', 3);
    votingInterfaceStore.firstName = 'Test';
    votingInterfaceStore.error = 'Test error';

    votingInterfaceStore.reset();

    expect(votingInterfaceStore.poll).toBeNull();
    expect(votingInterfaceStore.ballot).toEqual({});
    expect(votingInterfaceStore.firstName).toBe('');
    expect(votingInterfaceStore.error).toBe('');
    expect(votingInterfaceStore.success).toBe(false);
  });
});
