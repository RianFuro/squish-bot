global.fetch = require('node-fetch')
require('dotenv').config()

const exclude = (require('./exclude.json') || []).reduce((acc, cur) => ({...acc, [cur]: true}), {})

const Discord = require('discord.js')
const tenor = require("tenorjs").client({
  Key: process.env.TENOR_KEY,
  Filter: "off", // not case sensitive
  Locale: "en_US",
  MediaFilter: "minimal",
  DateFormat: 'YYYY-MM-DD - hh:mm:ss'
});
const client = new Discord.Client()

client.on('ready', () => console.log('ready'))

const commands = {
  help: {
    description: 'Shows this message',
    handler: processHelpRequest,
  },
  hug: {
    usage: '+hug {@mention}',
    handler: processHugRequest
  },
  cuddle: {
    alias: 'hug'
  },
  lick: {
    usage: '+lick {@mention}',
    handler: processLickRequest
  },
  poke: {
    usage: '+poke {@mention}',
    handler: processPokeRequest
  },
  touch: {
    alias: 'poke'
  },
  tickle: {
    usage: '+tickle {@mention}',
    handler: processTickleRequest
  },
  squish: {
    usage: '+squish {@mention}',
    handler: processSquishRequest
  }
}

const COMMAND = /^\+(?<command>\w+)(?<parameters>.*)/
const PARAMETERS = /(?:[^\s"]+|"[^"]*")+/
const MENTION = /<@(?<id>.*)>/
client.on('message', msg => {
  const match = COMMAND.exec(msg.content)
  if (match) {
    let command = commands[match.groups.command]
    if (!command) return msg.reply('this are not the droids you are looking for')

    const parameters = match.groups.parameters.match(PARAMETERS)
    if (command.alias) command = commands[command.alias]
    return command.handler(msg, parameters)
  }
})

client.login(process.env.DISCORD_KEY).catch(console.error)

function processHelpRequest(msg, parameters) {
  const mergedCommands = Object.entries(commands).reduce((acc, [k, v]) => {
    if (v.alias) {
      if (!acc[v.alias]) acc[v.alias] = {aliases: [k]}
      else acc[v.alias].aliases.push(k)
    }
    else acc[k] = {aliases: [], ...acc[k], ...v}
    return acc
  },{})

  const helpText = Object.entries(mergedCommands).reduce((acc, [k, v]) => {
    const usage = v.usage || `+${k}`
    return acc +
      usage.padEnd(30, ' ') +
      (v.description || '') +
      (v.aliases.length ? `(aliases: ${v.aliases.join(', ')})` : '') +
      '\n'
  }, '')

  msg.reply(`this is what i can do for you, master:\n\`\`\`${helpText}\`\`\``)
}

function processHugRequest(msg, parameters) {
  return interactionWithRandomGif(msg, parameters, {
    gifQuery: 'hug',
    messageTemplate: (author, target) => `**${author}** is hugging **${target}**`,
    onInvalidParameters: () => msg.channel.send(`<@${msg.author.id}> is hugging the floor`)
  })
}

function processLickRequest(msg, parameters) {
  return interactionWithRandomGif(msg, parameters, {
    gifQuery: 'lick',
    messageTemplate: (author, target) => `**${target}** was licked by **${author}**`,
    onInvalidParameters: () => msg.channel.send(`<@${msg.author.id}>, you shouldn't lick **that**`)
  })
}

function processPokeRequest(msg, parameters) {
  return interactionWithRandomGif(msg, parameters, {
    gifQuery: 'poke',
    messageTemplate: (author, target) => `**${target}** was poked by **${author}**`,
    onInvalidParameters: () => msg.channel.send(`<@${msg.author.id}> is poking his nose`)
  })
}

function processSlapRequest(msg, parameters) {
  return interactionWithRandomGif(msg, parameters, {
    gifQuery: 'slap',
    messageTemplate: (author, target) => `**${target}** was slapped by **${author}**`,
    onInvalidParameters: () => msg.channel.send(`<@${msg.author.id}> slapped itself in it's confusion`)
  })
}

function processTickleRequest(msg, parameters) {
  return interactionWithRandomGif(msg, parameters, {
    gifQuery: 'tickle',
    messageTemplate: (author, target) => `**${target}** was tickled by **${author}**`,
    onInvalidParameters: () => msg.channel.send(`<@${msg.author.id}> was tickled by a tick... ew`)
  })
}

function processSquishRequest(msg, parameters) {
  return interactionWithRandomGif(msg, parameters, {
    gifQuery: 'cheeks',
    messageTemplate: (author, target) => `**${author}** squishes **${target}'s** cheeks!`,
    onInvalidParameters: () => msg.channel.send(`<@${msg.author.id}> squishes me! >////<`)
  })
}

async function interactionWithRandomGif(msg, parameters, { gifQuery, messageTemplate, onInvalidParameters, limit }) {
  if (!parameters)
    return onInvalidParameters()

  const userIdMatch = MENTION.exec(parameters[0])
  if (!userIdMatch)
    return msg.channel.send(`<@${msg.author.id}> is very confused`)

  const gif = await randomAnimeTenorPicture(gifQuery, limit)
  sendResponse(msg,
    messageTemplate(msg.author.username, msg.mentions.users.get(userIdMatch.groups.id).username),
    {url: gif.media[0].gif.url, id: gif.id})
}

function randomAnimeTenorPicture(query, limit = 10) {
  return randomTenorPicture(`anime ${query}`, limit)
}

async function randomTenorPicture(query, limit) {
  let pick = Math.ceil(Math.random() * limit) - 1

  const gifs = (await tenor.Search.Random(query, limit))
    .filter(g => !(g.id in exclude))

  if (gifs.length < pick) pick = gifs.length - 1

  return gifs[pick]
}

function sendResponse(msg, text, image) {
  msg.channel.send('', {
    embed: {
      title: text,
      ...(process.env.DEV && {description: image.id}),
      image: {
        url: image.url
      },
      footer: {
        text: 'Powered by https://tenor.com',
      },
    }
  }).catch(console.error)
}
