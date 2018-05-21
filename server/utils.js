const uid = require('randomstring');

module.exports = {
  isValidPoll (poll) {
    return this.isValidQuestion(poll.question) && this.isValidOptions(poll.options);
  },
  isValidQuestion (question) {
    return typeof question === 'string' && question.length > 0 && question.length <= 280
  },
  isValidOptions (options) {
    return Array.isArray(options) && options.every(option => typeof option === 'string' && option.length <= 280)
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
