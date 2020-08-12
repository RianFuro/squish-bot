const {randomTenorPicture, randomAnimeTenorPicture} = require("./gifs")
const Booru = require('booru')

async function interactionWithRandomGif(msg, parameters, { gifQuery, messageTemplate, onInvalidParameters, limit, imageLoader }) {
  if (!parameters.length)
    return onInvalidParameters()

  let targetName = parseTarget(msg, parameters[0])
  if (!targetName)
    return msg.channel.send(`<@${msg.author.id}> is very confused`)

  let gif, retry = 0
  while (!gif && ++retry < 10) gif = await (imageLoader || randomAnimeTenorPicture)(msg.guild, gifQuery, limit)
  if (!gif) return msg.reply('I am sorry master, but I did not find any gifs for you :(')

  tenorImageResponse(msg,
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
  tenorImageResponse(msg, '', {url: gifList[pick]})
}

function randomAnimeGifResponse(msg, { gifQuery }) {
  return randomGifResponse(msg, {gifQuery, imageLoader: randomAnimeTenorPicture})
}

async function randomGifResponse(msg, { gifQuery, imageLoader }) {
  const gif = await (imageLoader || randomTenorPicture)(msg.guild, gifQuery)
  tenorImageResponse(msg, '', {url: gif.media[0].gif.url, id: gif.id})
}

const illegalTags = ["loli", "shota", "teen", "child", "underage", "little", "shotacon", "cub"]
async function randomBooruImageResponse(msg, parameters, { tags = [], booru = 'gelbooru', limit = 10} = {}) {
  if (illegalTags.some(i => parameters.includes(i))) return msg.reply("That's illegal and you know it.")

  let rating = 'explicit'
  if (parameters[0] === 'safe') {
    rating = 'questionable'
    parameters.shift()
  }

  let query = parameters.map(p => `*${p}*`).concat(tags).concat(['-animated', `rating:${rating}`]).concat(illegalTags.map(t => `-${t}`))
  const entries = await Booru.search(booru, query, {limit, random: true})
  if (!entries.length) return msg.reply("I couldn't find anything :(")

  const pick = entries[Math.ceil(Math.random() * entries.length) - 1]
  console.log(query, pick)

  return imageResponse(msg, '', {url: pick.fileUrl, id: pick.id})
}

function textResponse(msg, text) {
  msg.channel.send(text, {}).catch(console.error)
}

function tenorImageResponse(msg, text, image) {
  return imageResponse(msg, text, image, {
    footer: 'Powered by https://tenor.com',
    author: {
      name: 'Tenor',
      url: 'http://tenor.com'
    }})
}
function imageResponse(msg, text, image, {footer, author} = {}) {
  msg.channel.send('', {
    embed: {
      title: text,
      ...(process.env.DEV && {description: image.id}),
      image: {
        url: `${image.url}?${image.id}`
      },
      ...(!!footer && {footer: {
        text: footer
      }}),
      ...(!!author && {author: {
        name: author.name,
        url: author.url
      }})
    }
  }).catch(console.error)
}

module.exports = {
  interactionWithRandomGif,
  interactionWithText,
  randomAnimeGifResponse,
  randomGifResponse,
  randomBooruImageResponse,
  textResponse,
  gifFromListResponse,
  imageResponse
}
