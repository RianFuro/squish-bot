const {randomAnimeGifResponse} = require("../responses")
module.exports = {
  handler(msg) {
    return randomAnimeGifResponse(msg, { gifQuery: 'blush'})
  }
}
