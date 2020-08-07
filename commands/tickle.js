const {interactionWithRandomGif} = require("../responses")
module.exports = {
  usage: '+tickle {@mention}',
  handler(msg, parameters) {
    return interactionWithRandomGif(msg, parameters, {
      gifQuery: 'tickle',
      messageTemplate: (author, target) => `**${target}** was tickled by **${author}**`,
      onInvalidParameters: () => msg.channel.send(`<@${msg.author.id}> was tickled by a tick... ew`)
    })
  }
}
