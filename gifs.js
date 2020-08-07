const {excludesFor} = require("./excludes")
const tenor = require("tenorjs").client({
  Key: process.env.TENOR_KEY,
  Filter: "off", // not case sensitive
  Locale: "en_US",
  MediaFilter: "minimal",
  DateFormat: 'YYYY-MM-DD - hh:mm:ss'
});

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

module.exports = {
  randomAnimeTenorPicture,
  randomTenorPicture,
  topRatedAnimeTenorPicture
}
