const uid = require('randomstring');

module.exports = {
  isValidPoll (poll) {
    return Array.isArray(poll.options) &&
      poll.options.every(option => typeof option === 'string' && option.length <= 280) &&
      poll.options.length > 1 && poll.options.length < 30
  },
  async getUid (collection) {
    const newUid = await uid.generate({
      length: 5,
      charset: 'alphanumeric'
    });
    const uidExists = await collection.findOne({uid: newUid});
    if (uidExists) return this.getUid(collection);
    return newUid;
  }
}
