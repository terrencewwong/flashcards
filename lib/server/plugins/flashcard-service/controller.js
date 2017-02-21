const store = require('./models/store')

function handleNextCardRequest (request, reply) {
  const {deck} = request.query
  reply(store.getNextCard(deck))
}

function handleSubmitCardRequest (request, reply) {
  const {deck, answer} = request.payload
  store.submitCard(deck, answer)
  reply()
}

module.exports = {
  handleNextCardRequest,
  handleSubmitCardRequest,
}
