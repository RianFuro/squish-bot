const {gifResponse} = require("../responses")
module.exports = {
  aliases: ['inu'],
  handler(msg) {
    return gifResponse(msg, { gifQuery: 'dog cute' })
  }
}
