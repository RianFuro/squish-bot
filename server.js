global.fetch = require('node-fetch')
require('dotenv').config()

const eightball = require('./eightball')
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
  cuddle: {alias: 'hug'},
  lick: {
    usage: '+lick {@mention}',
    handler: processLickRequest
  },
  poke: {
    usage: '+poke {@mention}',
    handler: processPokeRequest
  },
  touch: {alias: 'poke'},
  tickle: {
    usage: '+tickle {@mention}',
    handler: processTickleRequest
  },
  squish: {
    usage: '+squish {@mention}',
    handler: processSquishRequest
  },
  slap: {
    usage: '+slap {@mentaion}',
    handler: processSlapRequest
  },
  '8ball': {
    usage: '+8ball {question}',
    description: 'Ask Squish-senpai what to do',
    handler: processEightBallRequest
  },
  eightball: {alias: '8ball'},
  dog: {
    handler: processDogRequest
  },
  cat: {
    handler: processCatRequest
  },
  inu: {alias: 'dog'},
  neko: {alias: 'cat'},
  dance: {
    handler: processDanceRequest
  },
  cry: {
    handler: processCryRequest
  },
  sad: {alias: 'cry'},
  laugh: {
    handler: processLaughRequest
  },
  happy: {alias: 'laugh'},
  wag: {
    handler: processWagRequest
  }
}

const COMMAND = /^\+(?<command>\w+)(?<parameters>.*)/
const PARAMETERS = /(?:[^\s"]+|"[^"]*")/g
const MENTION = /(?:@(?<group>\w+)|<@!?(?<id>.*)>)/

client.on('message', msg => {
  const match = COMMAND.exec(msg.content)
  if (match) {
    let command = commands[match.groups.command]
    if (!command) return msg.reply('this are not the droids you are looking for')

    const parameters = Array.from(match.groups.parameters.matchAll(PARAMETERS)).map(x => x[0])
    if (command.alias) command = commands[command.alias]
    return command.handler(msg, parameters)
  }
})

client.login(process.env.DISCORD_KEY).catch(console.error)

function processHelpRequest(msg) {
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
      usage.padEnd(20, ' ') +
      (v.description ? `${v.description} ` : '') +
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

function processEightBallRequest(msg, parameters) {
  const answer = eightball.possibleAnswers[Math.floor(Math.random() * eightball.possibleAnswers.length)]
  sendTextResponse(msg, `> ${parameters.join(' ')}\n${answer}`)
}

function processDogRequest(msg) {
  return gifResponse(msg, { gifQuery: 'dog cute' })
}

function processCatRequest(msg) {
  return gifResponse(msg, { gifQuery: 'cat cute' })
}

function processDanceRequest(msg) {
  return animeGifResponse(msg, { gifQuery: 'dance' })
}

function processCryRequest(msg) {
  return animeGifResponse(msg, {gifQuery: 'cry' })
}

function processLaughRequest(msg) {
  return animeGifResponse(msg, { gifQuery: 'laugh' })
}

function processWagRequest(msg) {
  return animeGifResponse(msg, { gifQuery: 'wag tail' })
}

async function interactionWithRandomGif(msg, parameters, { gifQuery, messageTemplate, onInvalidParameters, limit }) {
  if (!parameters)
    return onInvalidParameters()

  const userIdMatch = MENTION.exec(parameters[0])
  if (!userIdMatch)
    return msg.channel.send(`<@${msg.author.id}> is very confused`)

  const gif = await randomAnimeTenorPicture(gifQuery, limit)

  let targetName
  if (userIdMatch.groups.id) {
    const guildUser = msg.guild.member(msg.mentions.users.get(userIdMatch.groups.id))
    targetName = guildUser.nickname || guildUser.user.username
  } else if (userIdMatch.groups.group === 'everyone' || userIdMatch.groups.group === 'here') {
    targetName = 'everyone'
  } else targetName = userIdMatch.groups.group

  sendEmbedResponse(msg,
    messageTemplate(msg.author.username, targetName),
    {url: gif.media[0].gif.url, id: gif.id})
}

function animeGifResponse(msg, { gifQuery }) {
  return gifResponse(msg, {gifQuery, imageLoader: randomAnimeTenorPicture})
}
async function gifResponse(msg, { gifQuery, imageLoader }) {
  const gif = await (imageLoader || randomTenorPicture)(gifQuery)
  sendEmbedResponse(msg, '', {url: gif.media[0].gif.url, id: gif.id})
}

function randomAnimeTenorPicture(query, limit = 10) {
  return randomTenorPicture(`anime ${query}`, limit)
}

async function randomTenorPicture(query, limit = 10) {
  let pick = Math.ceil(Math.random() * limit) - 1

  const gifs = (await tenor.Search.Random(query, limit))
    .filter(g => !(g.id in exclude))

  if (gifs.length < pick) pick = gifs.length - 1

  return gifs[pick]
}

function sendEmbedResponse(msg, text, image) {
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

function sendTextResponse(msg, text) {
  msg.channel.send(text, {}).catch(console.error)
}
