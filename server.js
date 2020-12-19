global.fetch = require('node-fetch')
require('dotenv').config()

const Discord = require('discord.js')
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] })

client.on('ready', () => console.log('ready'))

const requireDir = require('require-dir')
const commands = Object.entries(requireDir('commands')).reduce((acc, [k, v]) => {
  acc[k] = v
  if (v.aliases) v.aliases.forEach(a => acc[a] = {alias: k})
  return acc
}, {})

const COMMAND = /^\+(?<command>\w+)(?<parameters>.*)/
const PARAMETERS = /(?:[^\s"]+|"[^"]*")/g

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

const {addGuildExclude, excludesFor, removeGuildExclude} = require('./excludes')
async function handleReactionsChanged(payload) {
  console.log('entry handleReactionsChanged', payload, client.user.id)

  if (payload.message.partial) await payload.message.fetch()
  if (payload.message.author.id !== client.user.id) return
  if (!payload.message.embeds[0]) return

  const embed = payload.message.embeds[0]
  if (!embed) return

  const imageUrl = embed.image.url
  if (!imageUrl.includes('media.tenor.com')) return
  const gifId = imageUrl.split('?').pop()
  if (!gifId) return

  const totalReactions = payload.message.reactions.cache.mapValues(v => v.count)
  const thumbsUp = totalReactions.get('👍') || 0
  const thumbsDown = totalReactions.get('👎') || 0

  console.log('handling change in gif reaction', payload.message.guild.id, gifId, thumbsUp, thumbsDown)
  if (thumbsDown > thumbsUp && !(gifId in excludesFor(payload.message.guild.id))) {
    addGuildExclude(payload.message.guild.id, gifId)
    payload.message.react('❌').catch(console.error)
    console.log('added gif to local exclude list', payload.message.guild.id, gifId)
  } else if (thumbsDown <= thumbsUp && gifId in excludesFor(payload.message.guild.id)) {
    removeGuildExclude(payload.message.guild.id, gifId)
    const banReaction = payload.message.reactions.cache.get('❌')
    if (banReaction && banReaction.me) banReaction.remove().catch(console.error)
  }
}

client.login(process.env.DISCORD_KEY).catch(console.error)
