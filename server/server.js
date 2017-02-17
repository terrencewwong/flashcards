const Hapi = require('hapi')
const path = require('path')

const config = require('./config')

const server = new Hapi.Server()
server.connection(config.hapi)

server.register([
	{
		register: require('./plugins/flashcard-service'),
		options: {
			path: path.resolve(`${__dirname}/../cards/spanish-vocabulary/all.json`)
		}
	}
], (err) => {
  if (err) {
    server.log(['init', 'plugins', 'error'], err)
  }
})

server.start((err) => {
  if (err) {
    throw err;
  }
  console.log(`Server running at: ${server.info.uri}`)
})
