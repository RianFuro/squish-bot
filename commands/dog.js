const {randomGifResponse} = require("../responses")
module.exports = {
  aliases: ['inu'],
  handler(msg) {
    return randomGifResponse(msg, { gifQuery: 'dog cute' })
  }
}
