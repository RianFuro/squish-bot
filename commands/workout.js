const {randomAnimeGifResponse, gifFromListResponse} = require('../responses')
module.exports = {
  usage: '+workout [random]',
  handler(msg, parameters) {
    if (['r', 'rand', 'random']) return randomAnimeGifResponse(msg, {gifQuery: 'workout'})
    else return gifFromListResponse(msg, { gifList: require('../lists/workout.json') })
  }
}
