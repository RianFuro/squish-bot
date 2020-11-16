const {gifFromListResponse} = require('../responses')
const gifList = require('../lists/coffee.json')

module.exports = {
  handler(msg) {
    return gifFromListResponse(msg, { gifList })
  }
}
