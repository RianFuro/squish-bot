const {randomTenorPicture, randomAnimeTenorPicture} = require("./gifs")

async function interactionWithRandomGif(msg, parameters, { gifQuery, messageTemplate, onInvalidParameters, limit, imageLoader }) {
  if (!parameters.length)
    return onInvalidParameters()

  let targetName = parseTarget(msg, parameters[0])
  if (!targetName)
    return msg.channel.send(`<@${msg.author.id}> is very confused`)

  let gif, retry = 0
  while (!gif && ++retry < 10) gif = await (imageLoader || randomAnimeTenorPicture)(msg.guild, gifQuery, limit)
  if (!gif) return msg.reply('I am sorry master, but I did not find any gifs for you :(')

  sendEmbedResponse(msg,
    messageTemplate(msg.author.username, targetName),
    {url: gif.media[0].gif.url, id: gif.id})
}

async function interactionWithText(msg, parameters, { messageTemplate, onInvalidParameters }) {
  if (!parameters.length)
    return onInvalidParameters()

  let targetName = parseTarget(msg, parameters[0])
  if (!targetName)
    return msg.channel.send(`<@${msg.author.id}> is very confused`)

  textResponse(msg,
    messageTemplate(msg.author.username, targetName))
}

const MENTION = /(?:@(?<group>\w+)|<@!?(?<id>.*)>)/
function parseTarget(msg, argument) {
  const userIdMatch = MENTION.exec(argument)
  if (!userIdMatch)
    return undefined

  if (userIdMatch.groups.id) {
    const guildUser = msg.guild.member(msg.mentions.users.get(userIdMatch.groups.id))
    return guildUser.nickname || guildUser.user.username
  } else if (userIdMatch.groups.group === 'everyone' || userIdMatch.groups.group === 'here') {
    return 'everyone'
  } else return userIdMatch.groups.group
}

function gifFromListResponse(msg, { gifList }) {
  let pick = Math.ceil(Math.random() * gifList.length) - 1
  sendEmbedResponse(msg, '', {url: gifList[pick]})
}

function randomAnimeGifResponse(msg, { gifQuery }) {
  return randomGifResponse(msg, {gifQuery, imageLoader: randomAnimeTenorPicture})
}

async function randomGifResponse(msg, { gifQuery, imageLoader }) {
  const gif = await (imageLoader || randomTenorPicture)(msg.guild, gifQuery)
  sendEmbedResponse(msg, '', {url: gif.media[0].gif.url, id: gif.id})
}

function textResponse(msg, text) {
  msg.channel.send(text, {}).catch(console.error)
}

function sendEmbedResponse(msg, text, image) {
  msg.channel.send('', {
    embed: {
      title: text,
      ...(process.env.DEV && {description: image.id}),
      image: {
        url: `${image.url}?${image.id}`
      },
      footer: {
        text: 'Powered by https://tenor.com',
      },
      author: {
        name: 'Tenor',
        url: 'https://tenor.com'
      }
    }
  }).catch(console.error)
}

module.exports = {
  interactionWithRandomGif,
  interactionWithText,
  randomAnimeGifResponse,
  randomGifResponse,
  textResponse,
  gifFromListResponse
}
