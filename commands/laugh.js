const {animeGifResponse} = require("../responses")
module.exports = {
  aliases: ['happy'],
  handler(msg) {
    return animeGifResponse(msg, { gifQuery: 'laugh' })
  }
}
