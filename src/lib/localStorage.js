const localStorageKey = 'polls';
const separator = ',';

export default {
  getPolls() {
    const polls = window.localStorage.getItem(localStorageKey);
    if (!polls) return [];
    return polls.split(separator);
  },

  hasVoted(pollId) {
    const polls = this.getPolls();
    if (!polls.length) return false;
    return polls.includes(pollId);
  },

  setVote(pollId) {
    const polls = this.getPolls();
    polls.push(pollId);
    window.localStorage.setItem(localStorageKey, polls.join(separator));
  }
};
