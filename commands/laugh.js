const {randomAnimeGifResponse} = require("../responses")
module.exports = {
  aliases: ['happy'],
  handler(msg) {
    return randomAnimeGifResponse(msg, { gifQuery: 'laugh' })
  }
}
