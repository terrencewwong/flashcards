/* @flow */
const path = require('path')
const storeDir = require('../store-dir-util').get()
const PouchDB = require('pouchdb')
PouchDB.plugin(require('pouchdb-upsert'))
const DB = require('../level-db-wrapper')

const LOADED_KEY = 'LOADED_KEY'

class AsyncDeckLoader {
  name: string;
  dbLocation: string;
  storage: any; // TODO: make a Persistor interface

  constructor (name: string, Persistor?: any) {
    this.name = name
    this.dbLocation = path.join(storeDir, this.name)
    this.storage = Persistor ? new Persistor(this.name) : new DB(this.dbLocation)
  }

  async isLoaded (): Promise<boolean> {
    try {
      return await this.storage.get(LOADED_KEY)
    } catch (e) {
      // TODO: maybe only return false for certain types of errors?
      return false
    }
  }

  async setLoaded (state: boolean): Promise<void> {
    return this.storage.put(LOADED_KEY, state)
  }

  load (args: {path?: string} = {}) {
    const dirPath = args.path
      ? args.path
      : path.join(__dirname, '../../decks/decks/')
    const deckPath = path.resolve(dirPath, this.name)
    return require(deckPath)
  }

  getCardRenderer (args: {path?: string} = {}) {
    const dirPath = args.path
      ? args.path
      : path.join(__dirname, '../../decks/decks/')
    const deckPath = path.resolve(dirPath, this.name, 'card-renderer')
    try {
      return require(deckPath)
    } catch (e) {
      return undefined
    }
  }

  getStorage () {
    return this.storage
  }
}

module.exports = AsyncDeckLoader
