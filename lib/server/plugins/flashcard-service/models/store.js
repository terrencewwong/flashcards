const shuffle = require('knuth-shuffle').knuthShuffle
const storageAdapter = require('../../../../storage-adapter')
const Card = require('../../../../../decks/decks/spanish-vocabulary/card')

class Store {
  constructor () {
    this.connection = storageAdapter.connect()
  }

  getNextCard (deck) {
    const item = this.connection.popFromBacklog(deck)
    const flashcard = new Card(item).renderRandomVariant()
    return flashcard
  }

  clear () {
    this.storage.clearSync()
  }
}

module.exports = new Store()
