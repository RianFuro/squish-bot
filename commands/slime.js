const {randomGifResponse} = require('../responses')

module.exports = {
  handler(msg) {
    return randomGifResponse(msg, {gifQuery: 'slime-rancher'})
  }
}
