const BACKLOG_DIR = './.data/backlog'
const decks = require('../../../decks')

module.exports = class StorageConnection {
  constructor (storage) {
    this._storage = storage
    this.backlogs = this._initalizeBacklogs()
  }

  insertIntoBacklog (deck, card) {
    const backlog = this.backlogs[deck] 
    if (!backlog) {
      throw new Error(`A backlog for ${deck} does not exist.`)
    }
    const id = this._generateNextBacklogIdForDeck(deck)

    backlog.setItemSync(id, card)
  }

  popFromBacklog (deck) {
    const backlog = this.backlogs[deck] 
    if (!backlog) {
      throw new Error(`A backlog for ${deck} does not exist.`)
    }
    const id = this._getBacklogIdOfLastItem(deck)

    return backlog.removeItemSync(id)
  }


  _initalizeBacklogs () {
    return decks
      .map(deck => {
        const {name} = deck
        const storage = this._storage.create({dir: `${BACKLOG_DIR}/${name}`})
        storage.initSync()
        return {
          storage,
          name
        }
      })
      .reduce((backlogs, storageObject) => {
        const {name, storage} = storageObject
        backlogs[name] = storage
        return backlogs
      }, {})
  }

  _getBacklogIdOfLastItem (deck) {
    const id = this._generateNextBacklogIdForDeck(deck)
    if (id === '0') {
      throw new Error(`The backlog for ${deck} is empty.`)
    }

    return (parseInt(id) - 1).toString()
  }

  _generateNextBacklogIdForDeck (deck) {
    const backlog = this.backlogs[deck]
    if (!backlog) {
      throw new Error(`A backlog for ${deck} does not exist.`)
    }

    return backlog.length().toString()
  }
}
