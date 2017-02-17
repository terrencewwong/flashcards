const store = require('./models/store')

function handleNextCardRequest (request, reply) {
  reply(store.getNextCard())
}

function handleSubmitCardRequest (request, reply) {

}

module.exports = {
  handleNextCardRequest,
  handleSubmitCardRequest,
}
