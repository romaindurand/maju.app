import cookie from './cookies';
import localStorage from './localStorage';

export default {
  setVote(pollId) {
    cookie.setVote(pollId);
    localStorage.setVote(pollId);
  },

  hasVoted(pollId) {
    return cookie.hasVoted(pollId) || localStorage.hasVoted(pollId);
  }
};
