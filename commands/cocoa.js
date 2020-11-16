const {gifFromListResponse} = require('../responses')
const gifList = require('../lists/hot-chocolate.json')

module.exports = {
  aliases: ['hot-chocolate'],
  handler(msg) {
    return gifFromListResponse(msg, { gifList })
  }
}
