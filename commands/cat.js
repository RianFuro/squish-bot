const {randomGifResponse} = require("../responses")
module.exports = {
  aliases: ['neko'],
  handler(msg) {
    return randomGifResponse(msg, { gifQuery: 'cat cute' })
  }
}
