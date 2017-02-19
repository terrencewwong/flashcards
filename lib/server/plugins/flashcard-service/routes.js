const controller = require('./controller')

const nextCardRoute = {
  method: 'GET',
  path: '/next-card',
  config: {
    handler: controller.handleNextCardRequest
  }
}

const submitCardRoute = {
  method: 'POST',
  path: '/submit-card',
  config: {
    handler: controller.handleSubmitCardRequest
  }
}

const _health = {
  method: 'GET',
  path: '/_health',
  handler: function (request, reply) {
    reply()
  }
}

module.exports = [
  nextCardRoute,
  submitCardRoute,
  _health
]
