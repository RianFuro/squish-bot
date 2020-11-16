const {gifFromListResponse} = require('../responses')
const gifList = require('../lists/tea.json')

module.exports = {
  handler(msg) {
    return gifFromListResponse(msg, { gifList })
  }
}
