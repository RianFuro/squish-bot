const {gifFromListResponse} = require('../responses')
const bakaList = require('../lists/baka.json')

module.exports = {
  handler(msg, parameters) {
    return gifFromListResponse(msg, {gifList: bakaList})
  }
}
