// @flow
import Hapi from 'hapi'
import { notifyLauncherDoneInitializing } from '../server-launcher'

// Create a server with a host and port
const server = Hapi.server({
  host: 'localhost',
  port: 8000
})

// Add the route
server.route({
  method: 'POST',
  path: '/_stop',
  handler: () => process.kill(process.pid, 'SIGINT')
})

server.route({
  method: 'GET',
  path: '/_health',
  handler: () => true
})

server.route({
  method: 'GET',
  path: '/next-card',
  handler: () => {
    return {
      id: 'abc123',
      sideA: 'bonjour',
      sideB: 'hello'
    }
  }
})

// Stop the server
async function stop () {
  let exitStatus = 0
  try {
    await server.stop({ timeout: 10000 })
  } catch (err) {
    exitStatus = 1
  }
  process.exit(exitStatus)
}

// Start the server
async function start () {
  try {
    await server.start()

    // listen on SIGINT signal and gracefully stop the server
    process.on('SIGINT', stop)
  } catch (err) {
    console.log(err)
    process.exit(1)
  }

  notifyLauncherDoneInitializing()
}

start()
