const {gifFromListResponse} = require("../responses")
const gifs = require('../lists/roll.json')
module.exports = {
  aliases: [],
  handler(msg) {
    return gifFromListResponse(msg, { gifList: gifs })
  }
}
