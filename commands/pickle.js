module.exports = {
  description: 'Calculates the size of your pickle with extreme precision',
  aliases: ['psize', 'picklesize'],
  handler(msg, parameters) {
    const size = ((msg.author.id % 2500) + 500) / 100
    let comment
    if (size < 10) comment = 'Aww, how cute (´｡• ω •｡`)'
    else if (size < 15) comment = "That's... underwhelming (--_--)"
    else if (size < 20) comment = 'Perfectly fine (¬‿¬ )'
    else if (size < 25) comment = 'Wow (´♡‿♡`)'
    else comment = "(⊙_⊙)"
    msg.reply(`your pickle is exactly ${size}cm. ${comment}`)
  }
}
