const {randomBooruImageResponse} = require('../responses')

module.exports = {
  aliases: ['genderswap'],
  handler(msg, parameters) {
    return randomBooruImageResponse(msg, parameters, {tags: ['rule_63']})
  }
}
