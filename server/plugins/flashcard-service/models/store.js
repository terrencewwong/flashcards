const shuffle = require('knuth-shuffle').knuthShuffle

class Store {
  constructor () {
    this.storage = initializeStorage()
    this.pointer = 0
  }

  getNextCard () {
    const item = this.storage.getItemSync(this.pointer.toString())
    this.pointer = this.pointer + 1
    return item
  }

  clear () {
    this.storage.clearSync()
  }
}

function initializeStorage () {
  const storage = require('node-persist')
  storage.initSync()

  // don't save reference to all.json so we don't save it in memory
  shuffle(require('../../../../cards/spanish-vocabulary/all.json'))
    .forEach((word, index) => {
      storage.setItemSync(index.toString(), word)
    })

  return storage
}

module.exports = new Store()
