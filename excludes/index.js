const pg = new (require('pg').Client)({
  connectionString: process.env.DATABASE_URL,
  ...(!process.env.DEV && {ssl: {rejectUnauthorized: false}})
})

pg.connect()
const staticExclude = (require('./global-exclude.json') || []).reduce((acc, cur) => ({...acc, [cur]: true}), {})
const guildExcludes = {}
pg.query("CREATE TABLE IF NOT EXISTS guild_excludes(id serial primary key, guild_id varchar unique, excludes json default '[]')")
  .then(() => {
    pg.query('SELECT * FROM guild_excludes')
      .then(result => {
        for (let row of result.rows) {
          guildExcludes[row.guild_id] = row.excludes.reduce((acc, cur) => ({...acc, [cur]: true}), {})
        }
      })
  }).catch(console.error)

function storeExcludes(guild) {
  console.log(guild, JSON.stringify(Object.keys(guildExcludes[guild])))
  try {
    pg.query(`
      INSERT INTO guild_excludes (guild_id, excludes)
      VALUES ($1, $2) 
      ON CONFLICT (guild_id) DO UPDATE 
        SET "excludes" = EXCLUDED."excludes";
    `, [guild, JSON.stringify(Object.keys(guildExcludes[guild]))])
  } catch (e) {
    console.error(e)
  }
}

module.exports = {
  excludesFor(guild) {
    return {...staticExclude, ...guildExcludes[guild]}
  },
  addGuildExclude(guild, gifId) {
    if (!(guild in guildExcludes)) guildExcludes[guild] = []
    guildExcludes[guild][gifId] = true

    storeExcludes(guild)
  },
  removeGuildExclude(guild, gifId) {
    if (!(guild in guildExcludes)) guildExcludes[guild] = []
    delete guildExcludes[guild][gifId]

    storeExcludes(guild)
  }
}
