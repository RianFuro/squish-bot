const {interactionWithRandomGif} = require("../responses")

module.exports = {
  usage: '+hug {@mention}',
  aliases: ['cuddle', 'snug'],
  handler(msg, parameters) {
    return interactionWithRandomGif(msg, parameters, {
      gifQuery: 'hug',
      messageTemplate: (author, target) => `**${author}** is hugging **${target}**`,
      onInvalidParameters: () => msg.channel.send(`<@${msg.author.id}> is hugging the floor`)
    })
  }
}
