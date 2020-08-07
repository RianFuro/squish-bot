const snacks = require('../lists/snacks.json')

module.exports = {
  usage: '+snack [healthy] [<amount>]',
  aliases: ['snacc'],
  handler(msg, parameters) {
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
}
