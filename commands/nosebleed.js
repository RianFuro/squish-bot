const {randomAnimeGifResponse} = require('../responses')

module.exports = {
  aliases: ['horni'],
  handler(msg) {
    return randomAnimeGifResponse(msg, { gifQuery: 'nosebleed' })
  }
}
