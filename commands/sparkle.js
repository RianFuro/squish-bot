const {gifFromListResponse} = require('../responses')
const sparkleGifs = require('../lists/sparkle.json')

module.exports = {
  handler(msg) {
    return gifFromListResponse(msg, { gifList: sparkleGifs })
  }
}
