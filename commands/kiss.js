const {interactionWithRandomGif} = require("../responses")
module.exports = {
  usage: '+kiss {@mention}',
  handler(msg, paramters) {
    return interactionWithRandomGif(msg, paramters, {
      gifQuery: 'kiss',
      messageTemplate: (author, target) => `**${target}** received a kiss from **${author}**`,
      onInvalidParameters: () => msg.channel.send(`<@${msg.author.id}> kissed the mirror... awkward`)
    })
  }
}
