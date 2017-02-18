const shuffle = require('knuth-shuffle').knuthShuffle
const Card = require('../../../../cards/spanish-vocabulary/card')

class Store {
  constructor () {
    this.storage = initializeStorage()
  }

  getNextCard () {
    const id = this._getNextKey()
    const item = this.storage.getItemSync(id)
    const flashcard = new Card(item).renderRandomVariant()
    flashcard.id = id
    return flashcard
  }

  clear () {
    this.storage.clearSync()
  }

  _getNextKey () {
    if (!this.currentKey) {
      // TODO: fix this shittyness
      this.currentKey = 'spanish-vocabulary:0'
      return this.currentKey
    }

    const [_, index] = this.currentKey.split(':').map(Number.prototype.constructor)
    this.currentKey = `spanish-vocabulary:${index + 1}`
    return this.currentKey
  }
}

function initializeStorage () {
  const storage = require('node-persist')
  storage.initSync()

  // don't save reference to all.json so we don't save it in memory
  shuffle(require('../../../../cards/spanish-vocabulary/all.json'))
    .forEach((word, index) => {
      const key = `spanish-vocabulary:${index}`
      storage.setItemSync(key, word)
    })

  return storage
}

module.exports = new Store()
