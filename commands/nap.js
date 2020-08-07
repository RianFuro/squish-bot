const {animeGifResponse} = require("../responses")
module.exports = {
  aliases: ['sleep', 'sleepy'],
  handler(msg) {
    return animeGifResponse(msg, { gifQuery: 'nap' })
  }
}
