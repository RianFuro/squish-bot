const querystring = require("querystring");
const rule34Search = tags => `https://gelbooru.com/index.php?page=dapi&json=1&s=post&q=index&limit=30&${querystring.stringify({tags})}`

const {imageResponse} = require('../responses')

const illegalTags = ["loli", "shota", "teen", "child", "underage", "little", "shotacon", "cub"]

module.exports = {
  handler(msg, parameters) {
    if (illegalTags.some(i => parameters.includes(i))) return msg.reply("That's illegal and you know it.")

    let rating = 'explicit'
    if (parameters[0] === 'safe') {
      rating = 'questionable'
      parameters.shift()
    }

    fetch(rule34Search(parameters.map(p => `*${p}*`).concat([`rating:${rating}`]).join(" "))).then(async r => {
      try {
        const entries = (await r.json())
          .filter(e => !illegalTags.some(i => e.tags.split(" ").includes(i)))

        console.log(entries)
        console.log(rule34Search(parameters.map(p => `*${p}*`).concat([`rating:${rating}`]).join(" ")))

        const pick = entries[Math.ceil(Math.random() * entries.length) - 1]

        return imageResponse(msg, '', {url: pick.file_url, id: pick.id})
      } catch (e) {
        msg.reply("I couldn't find anything :(")
      }
    }).catch(console.error)
  }
}
