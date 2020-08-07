const {interactionWithRandomGif} = require("../responses")
module.exports = {
  usage: '+lick {@mention}',
  handler(msg, parameters) {
    return interactionWithRandomGif(msg, parameters, {
      gifQuery: 'lick',
      messageTemplate: (author, target) => `**${target}** was licked by **${author}**`,
      onInvalidParameters: () => msg.channel.send(`<@${msg.author.id}>, you shouldn't lick **that**`)
    })
  }
}
