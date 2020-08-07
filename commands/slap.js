const {interactionWithRandomGif} = require("../responses")
module.exports = {
  usage: '+slap {@mention}',
  handler(msg, parameters) {
    return interactionWithRandomGif(msg, parameters, {
      gifQuery: 'slap',
      messageTemplate: (author, target) => `**${target}** was slapped by **${author}**`,
      onInvalidParameters: () => msg.channel.send(`<@${msg.author.id}> slapped itself in it's confusion`)
    })
  }
}
