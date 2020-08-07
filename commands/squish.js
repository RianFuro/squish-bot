const {interactionWithRandomGif} = require("../responses")
module.exports = {
  usage: '+squish {@mention}',
  handler(msg, parameters) {
    return interactionWithRandomGif(msg, parameters, {
      gifQuery: 'cheeks',
      messageTemplate: (author, target) => `**${author}** squishes **${target}'s** cheeks!`,
      onInvalidParameters: () => msg.channel.send(`<@${msg.author.id}> squishes me! >////<`)
    })
  }
}
