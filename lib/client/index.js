const request = require('request')
const endPoints = require('./end-points')

function getNextCard (deck, callback) {
  const {url, method} = endPoints.nextCard
  request(
    {
      url,
      method,
      qs: {
        deck: deck
      },
      json: true
    },
    (err, _, card) => callback(err, card)
  )
}

function submitCard (deck, answer, callback) {
  const {url, method} = endPoints.submitCard
  request({
    url,
    method,
    json: {
      deck,
      answer
    }
  }, callback)
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

function getServerPid (callback) {
  const {url, method} = endPoints.getServerPid
  request(
    {
      url,
      method
    },
    (err, _, pid) => callback(err, pid)
  )
}

module.exports = {
  getNextCard,
  submitCard,
  checkHealth,
  getServerPid
}
