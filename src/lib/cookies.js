import cookie from 'react-cookies';
const cookieName = 'maju';

export default {
  load() {
    return cookie.load(cookieName) || this.saveDefaults();
  },

  saveDefaults() {
    const data = {
      language: 'en-US',
      polls: [],
    };
    this.save(data)
    return data;
  },

  save(data) {
    cookie.save(cookieName, data, { maxAge: 60 * 60 * 24 * 365 });
  },

  hasVoteCookie(pollId) {
    const data = this.load();
    if (!data.polls) return false;
    return data.polls.includes(pollId)
  },

  getLanguage() {
    return this.load().language;
  },

  setLanguage(language) {
    this.save({
      ...this.load(),
      language,
    })
  },

  setVoteCookie(pollId) {
    const data = this.load()
    data.polls.push(pollId)
    this.save(data);
  }
};
