const store = require('./models/store')

function handleNextCardRequest (request, reply) {
  const {deck} = request.query
  reply(store.getNextCard(deck))
}

function handleSubmitCardRequest (request, reply) {

}

module.exports = {
  handleNextCardRequest,
  handleSubmitCardRequest,
}
