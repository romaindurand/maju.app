import localStorage from './localStorage'
import cookiesLib from './cookies'

export default $cookies => {
  const cookies = cookiesLib($cookies)
  return {
    setVote (pollId) {
      cookies.setVote(pollId)
      localStorage.setVote(pollId)
    },

    hasVoted (pollId) {
      return cookies.hasVoted(pollId) || localStorage.hasVoted(pollId)
    },

    reset (pollId) {
      cookies.removeVote(pollId)
      localStorage.removeVote(pollId)
    }
  }
}
