const ensureServer = require('../utils/ensure-server')

module.exports = {
  command: 'start-server',
  desc: 'Start the flashcard server',
  handler: () => {
    ensureServer((err) => {
      // err implies the server was not already running
      if (err) {
        console.log('flashcard server started.')
      } else {
        console.log('flashcard server is already running.')
      }
    })
  }
}
