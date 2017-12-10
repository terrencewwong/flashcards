// @flow
import Wreck from 'wreck'
import serverLauncher from '../../lib/server-launcher'

module.exports = {
  command: 'server',
  desc: 'Start the flashcard server',
  handler: async () => {
    // TODO: refactor this, make url configurable
    try {
      await Wreck.get('http://localhost:8000/_health')
      console.log('server is already running')
    } catch (err) {
      await serverLauncher()
      process.exit()
    }
  }
}
