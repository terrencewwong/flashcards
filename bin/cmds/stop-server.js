const execSync = require('child_process').execSync
const client = require('../../lib/client')

function stopServer () {
  client.getServerPid((err, pid) => {
    if (pid) {
      execSync(`kill -9 ${pid}`)
      console.log('stopped flashcard server')
    } else {
      console.log('flashcard server is not running.')
    }
  })
}

module.exports = {
  command: 'stop-server',
  desc: 'Kill the flashcard server',
  handler: stopServer
}
