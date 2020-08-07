const {interactionWithRandomGif} = require("../responses")
module.exports = {
  usage: '+pat {@mention}',
  handler(msg, parameters) {
    return interactionWithRandomGif(msg, parameters, {
      gifQuery: 'pat',
      messageTemplate: (author, target) => `**${author}** patted **${target}** on the head`,
      onInvalidParameters: () => msg.channel.send(`<@${msg.author.id}> patted themselves on the back. Good job!`)
    })
  }
}
