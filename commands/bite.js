const {topRatedAnimeTenorPicture} = require("../gifs")
const {interactionWithRandomGif} = require("../responses")
module.exports = {
  usage: '+bite {@mention}',
  aliases: ['nom'],
  handler(msg, parameters) {
    return interactionWithRandomGif(msg, parameters, {
      gifQuery: 'bite',
      messageTemplate: (author, target) => `**${target}** was bitten by **${author}**`,
      onInvalidParameters: () => msg.channel.send(`<@${msg.author.id}> bit their own tongue. Yikes! ~(>\_<~)`),
      imageLoader: topRatedAnimeTenorPicture,
      limit: 30
    })
  }
}
