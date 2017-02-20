const serverLauncher = require('../../lib/server-launcher')
const client = require('../../lib/client')

module.exports = function (callback) {
  client.checkHealth((err) => {
    if (err) {
      return serverLauncher.launch(() => callback(err))
    }

    callback()
  })
}
