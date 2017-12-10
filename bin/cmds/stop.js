// @flow
import Wreck from 'wreck'

import serverLauncher from '../../lib/server-launcher'

module.exports = {
  command: 'stop',
  desc: 'Stop the flashcard server',
  handler: async () => {
    process.stdout.write('stopping server...')
    // TODO: make the url configurable
    try {
      await Wreck.post('http://localhost:8000/_stop')
    } catch (err) {
      // TODO: how to handle error?
    }
    console.log('done')
  }
}
