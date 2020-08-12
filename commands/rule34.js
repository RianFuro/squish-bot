const {randomBooruImageResponse} = require('../responses')

module.exports = {
  async handler(msg, parameters) {
    return randomBooruImageResponse(msg, parameters)
  }
}
