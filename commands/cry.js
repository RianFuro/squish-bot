const {randomAnimeGifResponse} = require("../responses")
module.exports = {
  aliases: ['sad'],
  handler(msg) {
    return randomAnimeGifResponse(msg, { gifQuery: 'cry' })
  }
}
