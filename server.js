global.fetch = require('node-fetch')
require('dotenv').config()

const eightball = require('./eightball')
const {addGuildExclude, excludesFor, removeGuildExclude} = require('./excludes')

const Discord = require('discord.js')
const tenor = require("tenorjs").client({
  Key: process.env.TENOR_KEY,
  Filter: "off", // not case sensitive
  Locale: "en_US",
  MediaFilter: "minimal",
  DateFormat: 'YYYY-MM-DD - hh:mm:ss'
});
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] })


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
  kiss: {
    usage: '+kiss {@mention}',
    handler: processKissRequest
  },
  pat: {
    usage: '+pat {@mention}',
    handler: processPatRequest
  },
  bite: {
    usage: '+bite {@mention}',
    handler: processBiteRequest
  },
  cookie: {
    usage: '+cookie {@mention}',
    handler: processCookieRequest
  },
  star: {
    usage: '+star {@mention}',
    handler: processStarRequest
  },
  snack: {
    usage: '+snack [healthy] [<amount>]',
    handler: processSnackRequest
  },
  snacc: {alias: 'snack'},
  nom: {alias: 'bite'},
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
  nap: {
    handler: processNapRequest
  },
  sleep: {alias: 'nap'},
  sleepy: {alias: 'nap'},
  cry: {
    handler: processCryRequest
  },
  blush: {
    usage: '+blush',
    handler: processBlushRequest
  },
  sad: {alias: 'cry'},
  laugh: {
    handler: processLaughRequest
  },
  happy: {alias: 'laugh'},
  wag: {
    handler: processWagRequest
  },
}

const COMMAND = /^\+(?<command>\w+)(?<parameters>.*)/
const PARAMETERS = /(?:[^\s"]+|"[^"]*")/g
const MENTION = /(?:@(?<group>\w+)|<@!?(?<id>.*)>)/

client.on('message', msg => {
  if (msg.partial) return
  const match = COMMAND.exec(msg.content)
  if (match) {
    let command = commands[match.groups.command]
    if (!command) return msg.reply('this are not the droids you are looking for')

    const parameters = Array.from(match.groups.parameters.matchAll(PARAMETERS)).map(x => x[0])
    if (command.alias) command = commands[command.alias]
    return command.handler(msg, parameters)
  }
})

client.on('messageReactionAdd', handleReactionsChanged)
client.on('messageReactionRemove', handleReactionsChanged)

async function handleReactionsChanged(payload) {
  if (payload.message.partial) await payload.message.fetch()
  if (payload.message.author.id !== client.user.id) return
  if (!payload.message.embeds[0]) return

  const embed = payload.message.embeds[0]
  if (!embed.author || embed.author.name !== 'Tenor') return

  const imageUrl = embed.image.url
  const gifId = imageUrl.split('?').pop()
  if (!gifId) return

  const totalReactions = payload.message.reactions.cache.mapValues(v => v.count)
  const thumbsUp = totalReactions.get('👍') || 0
  const thumbsDown = totalReactions.get('👎') || 0
  if (thumbsDown > thumbsUp && !(gifId in excludesFor(payload.message.guild.id))) {
    addGuildExclude(payload.message.guild.id, gifId)
    payload.message.react('❌').catch(console.error)
  } else if (thumbsDown <= thumbsUp && gifId in excludesFor(payload.message.guild.id)) {
    removeGuildExclude(payload.message.guild.id, gifId)
    const banReaction = payload.message.reactions.cache.get('❌')
    if (banReaction && banReaction.me) banReaction.remove().catch(console.error)
  }
}

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

  const helpText =
    `I am Squish Bot ^.^! I am considered to be in the early stages of construction, so I might break sometimes >.< please apologize!\n` +
    `<@${msg.author.id}>, this is what i can do for you, master:\n` +
    '```' + Object.entries(mergedCommands).reduce((acc, [k, v]) => {
      const usage = v.usage || `+${k}`
      return acc +
        usage.padEnd(20, ' ') +
        (v.description ? `${v.description} ` : '') +
        (v.aliases.length ? `(aliases: ${v.aliases.join(', ')})` : '') +
        '\n'
    }, '') + '```' +
    'If you find any bugs, or have suggestions or want to participate in any other way, you can open an Issue here: <https://github.com/RianFuro/squish-bot/issues>'


  msg.author.send(helpText)
  msg.reply("I've sent you a message, master (* ^ ω ^)")
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

function processKissRequest(msg, paramters) {
  return interactionWithRandomGif(msg, paramters, {
    gifQuery: 'kiss',
    messageTemplate: (author, target) => `**${target}** received a kiss from **${author}**`,
    onInvalidParameters: () => msg.channel.send(`<@${msg.author.id}> kissed the mirror... awkward`)
  })
}

function processPatRequest(msg, parameters) {
  return interactionWithRandomGif(msg, parameters, {
    gifQuery: 'pat',
    messageTemplate: (author, target) => `**${author}** patted **${target}** on the head`,
    onInvalidParameters: () => msg.channel.send(`<@${msg.author.id}> patted themselves on the back. Good job!`)
  })
}

function processBiteRequest(msg, parameters) {
  return interactionWithRandomGif(msg, parameters, {
    gifQuery: 'bite',
    messageTemplate: (author, target) => `**${target}** was bitten by **${author}**`,
    onInvalidParameters: () => msg.channel.send(`<@${msg.author.id}> bit their own tongue. Yikes! ~(>\_<~)`),
    imageLoader: topRatedAnimeTenorPicture,
    limit: 30
  })
}

function processCookieRequest(msg, parameters) {
  return interactionWithText(msg, parameters, {
    messageTemplate: (author, target) => `**${author}** gave **${target}** a cookie! 🍪`,
    onInvalidParameters: () => msg.channel.send(`<@${msg.author.id}> ate the cookie themselves!`)
  })
}

function processStarRequest(msg, parameters) {
  return interactionWithText(msg, parameters, {
    messageTemplate: (author, target) => `**${target}** received a star from **${author}**! ⭐`,
    onInvalidParameters: () => msg.channel.send(`<@${msg.author.id}> made themselves invincible!`)
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
  return animeGifResponse(msg, { gifQuery: 'cry' })
}

function processNapRequest(msg) {
  return animeGifResponse(msg, { gifQuery: 'nap' })
}

function processBlushRequest(msg) {
  return animeGifResponse(msg, { gifQuery: 'blush'})
}

function processLaughRequest(msg) {
  return animeGifResponse(msg, { gifQuery: 'laugh' })
}

function processWagRequest(msg) {
  return animeGifResponse(msg, { gifQuery: 'wag tail' })
}

const snacks = require('./lists/snacks.json')
function processSnackRequest(msg, parameters) {
  let kind, amount
  const pOne = parameters.shift()
  if (!pOne) {
    kind = 'all'
    amount = 1
  } else if (pOne === 'healthy') {
    kind = 'healthy'
    const pTwo = parameters.shift()
    if (!pTwo) amount = 1
    else if (!isNaN(pTwo)) amount = pTwo | 0
    else return msg.channel.send(`<@${msg.author.id}> is very confused`)
  } else if (!isNaN(pOne)) {
    kind = 'all'
    amount = pOne | 0
  } else return msg.channel.send("I'm not sure I've got something like that (╯_╰)")

  if (amount > 50) return msg.reply("b-but, that's way too many, master! ∑(O_O;)")

  let snackList
    if (kind === 'all')
     snackList = Object.values(snacks).flat()
    else if (kind === 'healthy')
     snackList = snacks.healthy
    else snackList = []

  const chosenSnacks = []
  for (let i = 0; i < amount; i++) {
    let pick = Math.ceil(Math.random() * snackList.length) - 1
    chosenSnacks.push(snackList[pick])
  }

  msg.reply('here you go, master! (o´▽`o)\n' + chosenSnacks.join(''))
}

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

  sendTextResponse(msg,
    messageTemplate(msg.author.username, targetName))
}

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

function animeGifResponse(msg, { gifQuery }) {
  return gifResponse(msg, {gifQuery, imageLoader: randomAnimeTenorPicture})
}
async function gifResponse(msg, { gifQuery, imageLoader }) {
  const gif = await (imageLoader || randomTenorPicture)(msg.guild, gifQuery)
  sendEmbedResponse(msg, '', {url: gif.media[0].gif.url, id: gif.id})
}

function randomAnimeTenorPicture(guild, query, limit = 10) {
  return randomTenorPicture(guild, `anime ${query}`, limit)
}

function topRatedAnimeTenorPicture(guild, query, limit = 10) {
  return randomTenorPicture(guild, `anime ${query}`, limit, 'Query')
}

async function randomTenorPicture(guild, query, limit = 10, func = 'Random') {
  let pick = Math.ceil(Math.random() * limit) - 1

  const gifs = (await tenor.Search[func](query, limit))
    .filter(g => !(g.id in excludesFor(guild.id)))

  if (gifs.length < pick) pick = gifs.length - 1

  return gifs[pick]
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

function sendTextResponse(msg, text) {
  msg.channel.send(text, {}).catch(console.error)
}
