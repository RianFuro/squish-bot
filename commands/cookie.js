const {interactionWithText} = require("../responses")
module.exports = {
  usage: '+cookie {@mention}',
  handler(msg, parameters) {
    return interactionWithText(msg, parameters, {
      messageTemplate: (author, target) => `**${author}** gave **${target}** a cookie! 🍪`,
      onInvalidParameters: () => msg.channel.send(`<@${msg.author.id}> ate the cookie themselves!`)
    })
  }
}
