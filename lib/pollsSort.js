export default {
  alphabetical(a, b) {
    if (!a.question && !b.question) return b.voteCount - a.voteCount
    return a.question.toLowerCase() > b.question.toLowerCase() ? 1 : -1
  },
  votes(a, b) {
    return b.voteCount - a.voteCount
  },
  date(a, b) {
    if (!a.date && !b.date) return b.voteCount - a.voteCount
    return a.date > b.date
  }
}
