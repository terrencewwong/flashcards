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
    const store = this.backlogs[deck]
    if (!store) {
      throw new Error(`A backlog for ${deck} does not exist.`)
    }
    const id = this._generateNextIdForBacklog(deck)
    store.setItemSync(id, card)
  }

  popFromBacklog (deck) {
    const backlog = this.backlogs[deck]
    if (!backlog) {
      throw new Error(`A backlog for ${deck} does not exist.`)
    }
    const id = this._getIdOfLastItemInBacklog(deck)
    return backlog.removeItemSync(id)
  }

  peekFromHighPriorityWorkingSet (deck) {
    return this._peekFromWorkingSet({
      workingSet: 'highPriorityWorkingSets',
      deck
    })
  }

  peekFromLowPriorityWorkingSet (deck) {
    return this._peekFromWorkingSet({
      workingSet: 'lowPriorityWorkingSets',
      deck
    })
  }

  enqueueIntoHighPriorityWorkingSet (deck, card) {
    return this._enqueueIntoWorkingSet({
      workingSet: 'highPriorityWorkingSets',
      deck,
      card
    })
  }

  enqueueIntoLowPriorityWorkingSet (deck, card) {
    return this._enqueueIntoWorkingSet({
      workingSet: 'lowPriorityWorkingSets',
      deck,
      card
    })
  }

  dequeueFromHighPriorityWorkingSet (deck) {
    return this._dequeueFromWorkingSet({
      workingSet: 'highPriorityWorkingSets',
      deck
    })
  }

  dequeueFromLowPriorityWorkingSet (deck) {
    return this._dequeueFromWorkingSet({
      workingSet: 'lowPriorityWorkingSets',
      deck
    })
  }

  getLengthOfHighPriorityWorkingSet (deck) {
    return this._getLengthOfWorkingSet({
      workingSet: 'highPriorityWorkingSets',
      deck
    })
  }

  getLengthOfLowPriorityWorkingSet (deck) {
    return this._getLengthOfWorkingSet({
      workingSet: 'lowPriorityWorkingSets',
      deck
    })
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

  _getIdOfLastItemInBacklog (deck) {
    const id = this._generateNextIdForBacklog(deck)
    if (id === '0') {
      throw new Error(`The backlog for ${deck} is empty.`)
    }

    return (parseInt(id) - 1).toString()
  }

  _generateNextIdForBacklog (deck) {
    const store = this.backlogs[deck]
    if (!store) {
      throw new Error(`A backlog for ${deck} does not exist.`)
    }

    return store.length().toString()
  }

  _peekFromWorkingSet ({workingSet, deck}) {
    const store = this[workingSet][deck]
    if (!store) {
      throw new Error(`A ${workingSet} for ${deck} does not exist.`)
    }

    let queue = store.getItemSync('queue')
    if (!queue) {
      queue = []
      store.setItemSync('queue', queue)
    }
    return queue[0]
  }

  _enqueueIntoWorkingSet ({workingSet, deck, card}) {
    const store = this[workingSet][deck]
    if (!store) {
      throw new Error(`A ${workingSet} for ${deck} does not exist.`)
    }

    let queue = store.getItemSync('queue')
    if (!queue) {
      queue = []
      store.setItemSync('queue', queue)
    }
    queue.push(card)
    store.setItemSync('queue', queue)
  }

  _dequeueFromWorkingSet ({workingSet, deck}) {
    const store = this[workingSet][deck]
    if (!store) {
      throw new Error(`A ${workingSet} for ${deck} does not exist.`)
    }

    let queue = store.getItemSync('queue')
    const item = queue.shift()
    store.setItemSync('queue', queue)
    return item
  }

  _getLengthOfWorkingSet ({workingSet, deck}) {
    const store = this[workingSet][deck]
    if (!store) {
      throw new Error(`A ${workingSet} for ${deck} does not exist.`)
    }

    let queue = store.getItemSync('queue')
    if (!queue) {
      queue = []
      store.setItemSync('queue', queue)
    }
    return queue.length
  }
}
