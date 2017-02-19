const storage = require('node-persist')
const StorageConnection = require('./storage-connection')

module.exports = {
  connect: function () {
    return new StorageConnection(storage)
  }
}
