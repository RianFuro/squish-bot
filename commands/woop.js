const {gifFromListResponse} = require('../responses')

module.exports = {
  handler(msg) {
    return gifFromListResponse(msg, { gifList: [
      'https://media1.tenor.com/images/fe83bb80bd966f57d75d3003de7a9805/tenor.gif'
      ]
    })
  }
}
