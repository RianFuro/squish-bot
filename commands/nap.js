const {randomAnimeGifResponse} = require("../responses")
module.exports = {
  aliases: ['sleep', 'sleepy'],
  handler(msg) {
    return randomAnimeGifResponse(msg, { gifQuery: 'nap' })
  }
}
