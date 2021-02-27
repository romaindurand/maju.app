import { compareDesc } from 'date-fns'

export default {
  alphabetical(a, b) {
    if (!a.question && !b.question) return b.voteCount - a.voteCount
    return a.question.toLowerCase() > b.question.toLowerCase() ? 1 : -1
  },
  votes(a, b) {
    return b.voteCount - a.voteCount
  },
  date(a, b) {
    const desc = -1
    const asc = 1
    if (!a.date && b.date) return asc
    if (a.date && !b.date) return desc
    if (a.date === b.date) return 0
    return compareDesc(a.date, b.date)
  }
}
