const {animeGifResponse} = require("../responses")
module.exports = {
  handler(msg) {
    return animeGifResponse(msg, { gifQuery: 'blush'})
  }
}
