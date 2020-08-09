# squish-bot

This is a discord bot! It posts themed random anime (and sometimes non-anime) gifs according to the given command. 
The gifs are sourced at random from https://tenor.com, so the quality of the result is often dependent on tagging-quality there.

This bot is supposed to be a kind of replacement for the now [discontinued](https://twitter.com/KawaiiDiscord/status/1289620488239620096) [KawaiiBot](https://kawaiibot.xyz/),
however there are no plans to reproduce the full feature set or be an actual drop-in-replacement.

# Dependencies

- NodeJS
- PostgreSQL

# Setup

Bot needs (not strictly, but will copmlain) a postgresql database where it stores exclude lists. Keys for services and connection string are sourced via `dotenv`,
so either from a `.env` file or the environment.

Needed variables:
```
DISCORD_KEY="<your bot secret>"
TENOR_KEY="<tenor api key>"
DATABASE_URL="<connection string to postgres db>"
```

# Commands

A full list of commands can be fetched via the `+help`/`+help here` command. Alternatively, just have a look at the `commands` folder in this repository.

## Excluding gifs

Since the quality of the posted gifs is dependent on the tagging quality over at Tenor.com, the bot provides an option to prevent gifs from showing up again on
the respective server. Simply react with 👎 on the gif; as long as there are more 👎 then 👍 reactions gif-post made by Squish Bot, the gif wont show up in any
further commands. Squish Bot will indicate this with a ❌ reaction on the post.

# Bugs

If you have any problem with the bot, please open up an issue. This includes if you feel that the bot provides subpar results to a command on average,
to the extend that using the voting function wouldn't make sense.
