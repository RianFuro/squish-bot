const {interactionWithRandomGif} = require("../responses")
module.exports = {
  usage: '+poke {@mention}',
  aliases: ['touch', 'boop'],
  handler (msg, parameters) {
    return interactionWithRandomGif(msg, parameters, {
      gifQuery: 'poke',
      messageTemplate: (author, target) => `**${target}** was poked by **${author}**`,
      onInvalidParameters: () => msg.channel.send(`<@${msg.author.id}> is poking their nose`)
    })
  }
}
