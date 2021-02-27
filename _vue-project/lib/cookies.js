const cookieName = 'maju'

export default cookie => ({
  load () {
    return cookie.get(cookieName) || this.saveDefaults()
  },

  saveDefaults () {
    const data = {
      language: 'en-US',
      polls: []
    }
    this.save(data)
    return data
  },

  save (data) {
    cookie.set(cookieName, data, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365
    })
  },

  hasVoted (pollId) {
    const data = this.load()
    if (!data.polls) return false
    return data.polls.includes(pollId)
  },

  getLanguage () {
    return this.load().language
  },

  setLanguage (language) {
    this.save({
      ...this.load(),
      language
    })
  },

  removeVote (pollId) {
    const data = this.load()
    data.polls = data.polls.filter(poll => poll !== pollId)
    this.save(data)
  },

  setVote (pollId) {
    const data = this.load()
    data.polls.push(pollId)
    this.save(data)
  },

  setAuth (token) {
    const data = this.load()
    data.auth = token
    this.save(data)
  },

  getAuthToken () {
    return this.load().auth || null
  }
})
