const {gifFromListResponse} = require('../responses')
const gifs = require('../lists/violin.json')

module.exports = {
  description: 'Play on the smallest violin',
  handler(msg) {
    return gifFromListResponse(msg, { gifList: gifs })
  }
}
