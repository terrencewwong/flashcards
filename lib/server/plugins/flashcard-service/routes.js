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

module.exports = [
  nextCardRoute,
  submitCardRoute
]
