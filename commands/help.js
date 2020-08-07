const requireDir = require('require-dir')

const otherCommands = requireDir()

module.exports = {
  description: 'Shows this message',
  handler(msg, parameters) {
    const mergedCommands = {help: module.exports, ...otherCommands}

    const helpText =
      `I am Squish Bot ^.^! I am considered to be in the early stages of construction, so I might break sometimes >.< please apologize!\n` +
      `<@${msg.author.id}>, this is what i can do for you, master:\n` +
      '```' + Object.entries(mergedCommands).reduce((acc, [k, v]) => {
        const usage = v.usage || `+${k}`
        return acc +
          usage.padEnd(20, ' ') +
          (v.description ? `${v.description} ` : '') +
          (v.aliases && v.aliases.length ? `(aliases: ${v.aliases.join(', ')})` : '') +
          '\n'
      }, '') + '```' +
      'If you find any bugs, or have suggestions or want to participate in any other way, you can open an Issue here: <https://github.com/RianFuro/squish-bot/issues>'


    if (parameters[0] === 'here') {
      msg.channel.send(helpText)
    } else {
      msg.author.send(helpText)
      msg.reply("I've sent you a message, master (* ^ ω ^)")
    }
  }
}
