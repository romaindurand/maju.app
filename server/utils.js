const uid = require('randomstring');
const fetch = require('node-fetch');
const recaptchaSecret = process.env.RECAPTCHA_SECRET

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
  },

  async isValidRecaptchaToken(token) {
    const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${token}`);
    const recaptchaResult = await response.json();
    return recaptchaResult.success;
  },
  
  stringArrayEqual(array1, array2) {
    return array1.every((value, index) => value === array2[index]) && array1.length === array2.length
  }
}
