import { generateVoterIdentifier, hasVotedLocally, markAsVoted } from '$lib/utils/voter';
import { generateBrowserFingerprint } from '$lib/utils/fingerprint';

interface Poll {
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
}

class VotingInterfaceStore {
  // Poll data
  poll = $state<Poll | null>(null);

  // Ballot state
  ballot = $state<Record<string, number>>({});
  firstName = $state('');

  // Submission state
  isSubmitting = $state(false);
  error = $state('');
  success = $state(false);
  alreadyVoted = $state(false);

  // Countdown state
  remainingMs = $state(0);
  private timer: number | undefined;

  hasCountdown = $derived(!!this.parseExpiresAt());

  expired = $derived(
    this.hasCountdown ? this.remainingMs <= 0 || this.poll?.isExpired === true : false
  );

  countdownText = $derived(this.formatCountdown(this.remainingMs));

  /**
   * Initialize the store with poll data
   */
  initialize(poll: Poll) {
    this.poll = poll;
    this.ballot = Object.fromEntries(poll.options.map((option) => [option, -1]));
    this.firstName = '';
    this.error = '';
    this.success = false;
    this.isSubmitting = false;
    this.alreadyVoted = poll.preventMultipleVotes && poll.id ? hasVotedLocally(poll.id) : false;

    // Initialize countdown
    this.startCountdown();
  }

  /**
   * Parse the expiresAt date
   */
  private parseExpiresAt(): Date | null {
    if (!this.poll?.expiresAt) return null;
    const d =
      typeof this.poll.expiresAt === 'string'
        ? new Date(this.poll.expiresAt)
        : (this.poll.expiresAt as Date);
    return isNaN(d.getTime()) ? null : d;
  }

  /**
   * Format countdown milliseconds to display string
   */
  private formatCountdown(ms: number): string {
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

  /**
   * Start the countdown timer
   */
  private startCountdown() {
    if (typeof window === 'undefined') return;

    const target = this.parseExpiresAt();
    if (!target) return;

    const update = () => {
      this.remainingMs = target.getTime() - Date.now();
      if ((this.remainingMs <= 0 || this.poll?.isExpired === true) && this.timer !== undefined) {
        clearInterval(this.timer);
      }
    };

    update();
    this.timer = setInterval(update, 1000) as unknown as number;
  }

  /**
   * Select a grade for an option
   */
  selectGrade(option: string, gradeIndex: number) {
    this.ballot[option] = gradeIndex;
  }

  /**
   * Check if all options have been graded
   */
  isComplete(): boolean {
    if (!this.poll) return false;
    return this.poll.options.every((option) => this.ballot[option] >= 0);
  }

  /**
   * Get color for a grade index
   */
  getGradeColor(index: number): string {
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

  /**
   * Submit the vote
   */
  async submitVote(): Promise<void> {
    if (!this.poll) return;

    this.error = '';

    if (this.expired) {
      this.error = 'Le sondage est terminé';
      return;
    }

    if (!this.isComplete()) {
      this.error = 'Veuillez évaluer toutes les options';
      return;
    }

    if (this.poll.askName && !this.firstName.trim()) {
      this.error = 'Veuillez saisir votre prénom';
      return;
    }

    this.isSubmitting = true;

    try {
      // Generate voter identifier and fingerprint
      const voterIdentifier = await generateVoterIdentifier();
      const fingerprint = await generateBrowserFingerprint();

      const response = await fetch(`/api/polls/${this.poll.id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ballot: this.ballot,
          voterIdentifier,
          fingerprint,
          ...(this.poll.askName ? { name: this.firstName.trim() } : {})
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors du vote');
      }

      // Mark as voted locally
      markAsVoted(this.poll.id);
      this.alreadyVoted = true;
      this.success = true;
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Une erreur est survenue';
    } finally {
      this.isSubmitting = false;
    }
  }

  /**
   * Reset the store
   */
  reset() {
    if (this.timer !== undefined) {
      clearInterval(this.timer);
    }
    this.poll = null;
    this.ballot = {};
    this.firstName = '';
    this.isSubmitting = false;
    this.error = '';
    this.success = false;
    this.alreadyVoted = false;
    this.remainingMs = 0;
  }
}

// Export a singleton instance
export const votingInterfaceStore = new VotingInterfaceStore();
