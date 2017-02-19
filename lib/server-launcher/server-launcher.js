const forever = require('forever-monitor')
const path = require('path')

const DONE_INITIALIZING = 'done'

const serverPath = path.join(__dirname, '../server/index.js')

module.exports = {
  launch: function (callback) {
    process.stdout.write('initializing flashcard server...')

    const child = new (forever.Monitor)(serverPath)
    child.on('stdout', (data) => {
      const message = data.toString().trim()
      if (message === DONE_INITIALIZING) {
        callback()
      }
    })

    child.start()
  },

  notifyLauncherDoneInitializing: function () {
    console.log(DONE_INITIALIZING)
  }
}
