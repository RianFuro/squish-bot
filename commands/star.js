const {interactionWithText} = require("../responses")
module.exports = {
  usage: '+star {@mention}',
  handler(msg, parameters) {
    return interactionWithText(msg, parameters, {
      messageTemplate: (author, target) => `**${target}** received a star from **${author}**! ⭐`,
      onInvalidParameters: () => msg.channel.send(`<@${msg.author.id}> made themselves invincible!`)
    })
  }
}
