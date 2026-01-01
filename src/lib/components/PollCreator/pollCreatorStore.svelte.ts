import { DEFAULT_GRADES } from '$lib/config';
import type { ParticipantsVisibility } from '$lib/types';

class PollCreatorStore {
  // Basic info
  title = $state('');
  description = $state('');

  // Options
  options = $state<string[]>(['', '']);

  // Settings
  preventMultipleVotes = $state(true);
  isPublic = $state(false);

  // Participants
  askName = $state(false);
  showParticipants = $state<ParticipantsVisibility>('never');

  // Expiration
  expirationMode = $state<'duration' | 'datetime' | 'none'>('duration');
  durationHours = $state(24);
  durationMinutes = $state(0);
  expiresAtLocal = $state(''); // YYYY-MM-DDTHH:MM (local)
  hideResultsUntilExpiration = $state(false);

  // Submission state
  isSubmitting = $state(false);
  error = $state('');

  /**
   * Reset all fields to their default values
   */
  reset() {
    this.title = '';
    this.description = '';
    this.options = ['', ''];
    this.preventMultipleVotes = true;
    this.isPublic = false;
    this.askName = false;
    this.showParticipants = 'never';
    this.expirationMode = 'duration';
    this.durationHours = 24;
    this.durationMinutes = 0;
    this.expiresAtLocal = '';
    this.hideResultsUntilExpiration = false;
    this.isSubmitting = false;
    this.error = '';
  }

  /**
   * Validate the form and return validation errors
   */
  validate(): string | null {
    if (!this.title.trim()) {
      return 'Le titre est requis';
    }

    const validOptions = this.options.filter((c) => c.trim());
    if (validOptions.length < 2) {
      return 'Au moins 2 options sont requises';
    }

    // Duplicate validation (case-insensitive, trimmed)
    const normalized = validOptions.map((c) => c.trim().toLowerCase());
    const seen: Record<string, true> = {};
    for (let i = 0; i < normalized.length; i++) {
      const val = normalized[i];
      if (seen[val]) {
        return 'Les options doivent être uniques';
      }
      seen[val] = true;
    }

    return null;
  }

  /**
   * Get formatted data ready for API submission
   */
  getFormData() {
    const validOptions = this.options.filter((c) => c.trim());

    return {
      title: this.title.trim(),
      description: this.description.trim() || null,
      options: validOptions,
      grades: DEFAULT_GRADES,
      preventMultipleVotes: this.preventMultipleVotes,
      isPublic: this.isPublic,
      askName: this.askName,
      showParticipants: this.showParticipants,
      hideResultsUntilExpiration:
        this.expirationMode === 'none' ? false : this.hideResultsUntilExpiration,
      ...(this.expirationMode === 'none'
        ? { noTimeLimit: true }
        : this.expirationMode === 'datetime'
          ? (() => {
            const local = this.expiresAtLocal?.trim();
            const d = local ? new Date(local) : null;
            return d && !isNaN(d.getTime()) ? { expiresAt: d.toISOString() } : {};
          })()
          : {
            durationSeconds: Math.max(
              60,
              this.durationHours * 3600 + this.durationMinutes * 60
            )
          })
    };
  }
}

// Export a singleton instance
export const pollCreatorStore = new PollCreatorStore();
