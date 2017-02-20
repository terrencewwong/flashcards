const BACKLOG_DIR = './.data/backlog'
const HIGH_PRIORITY_WORKING_SET_DIR = './.data/high-priority-working-set'
const LOW_PRIORITY_WORKING_SET_DIR = './.data/low-priority-working-set'
const DONE_DIR = './.data/done'
const decks = require('../../../decks')

module.exports = class StorageConnection {
  constructor (storage) {
    this._storage = storage
    this.backlogs = this._initializeStore(BACKLOG_DIR)
    this.highPriorityWorkingSets = this._initializeStore(HIGH_PRIORITY_WORKING_SET_DIR)
    this.lowPriorityWorkingSets = this._initializeStore(LOW_PRIORITY_WORKING_SET_DIR)
    this.dones = this._initializeStore(DONE_DIR)
  }

  pushIntoBacklog (deck, card) {
    this._pushIntoStore({
      storeName: 'backlogs',
      deck,
      card
    })
  }

  pushIntoHighPriorityWorkingSet (deck, card) {
    this._pushIntoStore({
      storeName: 'highPriorityWorkingSets',
      deck,
      card
    })
  }

  pushIntoLowPriorityWorkingSet (deck, card) {
    this._pushIntoStore({
      storeName: 'lowPriorityWorkingSets',
      deck,
      card
    })
  }

  pushIntoDone(deck, card) {
    this._pushIntoStore({
      storeName: 'done',
      deck,
      card
    })
  }

  popFromBacklog (deck) {
    const backlog = this.backlogs[deck] 
    if (!backlog) {
      throw new Error(`A backlog for ${deck} does not exist.`)
    }
    const id = this._getIdOfLastItemInStore({storeName: 'backlogs', deck})
    return backlog.removeItemSync(id)
  }


  _initializeStore (storeDir) {
    return decks
      .map(deck => {
        const {name} = deck
        const store = this._storage.create({dir: `${storeDir}/${name}`})
        store.initSync()
        return {
          store,
          name
        }
      })
      .reduce((stores, storeObject) => {
        const {name, store} = storeObject
        stores[name] = store
        return stores
      }, {})
  }

  _getIdOfLastItemInStore ({storeName, deck}) {
    const id = this._generateNextIdInStore({storeName, deck})
    if (id === '0') {
      throw new Error(`The ${storeName} for ${deck} is empty.`)
    }

    return (parseInt(id) - 1).toString()
  }

  _generateNextIdInStore ({storeName, deck}) {
    const store = this[storeName][deck]
    if (!store) {
      throw new Error(`A ${storeName} for ${deck} does not exist.`)
    }

    return store.length().toString()
  }

  _pushIntoStore({storeName, deck, card}) {
    const store = this[storeName][deck]
    if (!store) {
      throw new Error(`A ${storeName} for ${deck} does not exist.`)
    }
    const id = this._generateNextIdInStore({storeName, deck})

    store.setItemSync(id, card)
  }
}
