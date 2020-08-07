const {animeGifResponse} = require("../responses")
module.exports = {
  aliases: ['sad'],
  handler(msg) {
    return animeGifResponse(msg, { gifQuery: 'cry' })
  }
}
