const {gifResponse} = require("../responses")
module.exports = {
  aliases: ['neko'],
  handler(msg) {
    return gifResponse(msg, { gifQuery: 'cat cute' })
  }
}
