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

const _pid = {
  method: 'GET',
  path: '/_pid',
  handler: function (request, reply) {
    reply(process.pid)
  }
}

module.exports = [
  nextCardRoute,
  submitCardRoute,
  _health,
  _pid
]
