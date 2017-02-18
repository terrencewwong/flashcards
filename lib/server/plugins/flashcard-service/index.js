const routes = require('./routes')

function register (server, options, next) {
  server.route(routes)
  next()
}

register.attributes = {
  name: 'flashcard-service',
  version: '0.0.1'
}

module.exports = register
