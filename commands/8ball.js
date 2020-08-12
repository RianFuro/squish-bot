const eightball = require('../eightball')
const {textResponse} = require("../responses")

module.exports = {
  usage: '+8ball {question}',
  description: 'Ask Squish-senpai what to do',
  aliases: ['eightball'],
  handler(msg, parameters) {
    const answer = eightball.possibleAnswers[Math.ceil(Math.random() * eightball.possibleAnswers.length) - 1]
    textResponse(msg, `> ${parameters.join(' ')}\n${answer}`)
  }
}
