global.fetch = require('node-fetch')
const keys = require('./keys.json')

const Discord = require('discord.js')
const tenor = require("tenorjs").client({
  Key: keys.tenor,
  Filter: "off", // not case sensitive
  Locale: "en_US",
  MediaFilter: "minimal",
  DateFormat: 'YYYY-MM-DD - hh:mm:ss'
});
const client = new Discord.Client()

client.on('ready', () => console.log('ready'))

const COMMAND = /^\+(?<command>\w+)(?<parameters>.*)/
const PARAMETERS = /(?:[^\s"]+|"[^"]*")+/g
const MENTION = /<@(?<id>.*)>/
client.on('message', msg => {
  console.log(msg)
  const match = COMMAND.exec(msg.content)
  if (match) {
    const parameters = PARAMETERS.exec(match.groups.parameters)
    switch (match.groups.command) {
      case 'hug':
        return processHugRequest(msg, parameters)
      case 'lick':
        return processLickRequest(msg, parameters
        )
    }
  }
})

client.login(keys.discord)

async function processHugRequest(msg, parameters) {
  if (!parameters)
    return msg.channel.send(`<@${msg.author.id}> is hugging the floor`)

  const userIdMatch = MENTION.exec(parameters[0])
  if (!userIdMatch)
    return msg.channel.send(`<@${msg.author.id}> is very confused`)

  const gif = await randomPicture('anime hug')
  sendResponse(msg,
    `**${msg.author.username}** is hugging **${msg.mentions.users.get(userIdMatch.groups.id).username}**`,
    gif.media[0].gif.url)
}

async function processLickRequest(msg, parameters) {
  if (!parameters)
    return msg.channel.send(`<@${msg.author.id}>, you shouldn't lick **that**`)

  const userIdMatch = MENTION.exec(parameters[0])
  if (!userIdMatch)
    return msg.channel.send(`<@${msg.author.id}> is very confused`)

  const gif = await randomPicture('anime lick')
  sendResponse(msg,
    `**${msg.mentions.users.get(userIdMatch.groups.id).username}** was licked by **${msg.author.username}**`,
    gif.media[0].gif.url)
}

async function randomPicture(query, limit = 10) {
  let pick = Math.ceil(Math.random() * limit) - 1

  const gifs = await tenor.Search.Query(query, limit)
  if (gifs.length < pick) pick = gifs.length - 1

  return gifs[pick]
}

function sendResponse(msg, text, imageUrl) {
  msg.channel.send('', {
    embed: {
      title: text,
      image: {
        url: imageUrl
      },
      footer: {
        text: 'Powered by https://tenor.com',
      },
    }
  }).catch(console.error)
}
