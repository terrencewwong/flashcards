const request = require('request')
const endPoints = require('./end-points')

function getNextCard (callback) {
  const {url, method} = endPoints.nextCard
  request(
    {
      url,
      method,
      json: true
    },
    (err, _, card) => callback(err, card)
  )
}

function submitCard (cardId, grade, callback) {
  const {url, method} = endPoints.submitCard
  request({
    url,
    method,
    json: {
      cardId,
      grade
    }
  })
}

function checkHealth (callback) {
  const {url, method} = endPoints.checkHealth
  request(
    {
      url,
      method   
    },
    (err, response, body) => callback(err, response, body)
  )
}

module.exports = {
  getNextCard,
  submitCard,
  checkHealth
}
