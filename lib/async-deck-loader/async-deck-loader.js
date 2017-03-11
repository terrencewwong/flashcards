/* @flow */
const path = require('path')
const PouchDB = require('pouchdb')
PouchDB.plugin(require('pouchdb-upsert'))

const LOADED_KEY = 'LOADED_KEY'

class AsyncDeckLoader {
  name: string;
  storage: any; // TODO: make a Persistor interface

  constructor (name: string, Persistor?: any) {
    this.name = name
    this.storage = Persistor ? new Persistor(this.name) : new PouchDB(this.name)
  }

  async isLoaded (): Promise<boolean> {
    try {
      const doc = await this.storage.get(LOADED_KEY)
      return doc.loaded
    } catch (e) {
      // TODO: maybe only return false for certain types of errors?
      return false
    }
  }

  async setLoaded (state: boolean): Promise<void> {
    await this.storage.upsert(LOADED_KEY, doc => {
      doc.loaded = state
      return doc
    })
  }

  load (args: {path?: string} = {}) {
    const dirPath = args.path ? args.path : '../../decks/decks/'
    const deckPath = path.resolve(dirPath, this.name)
    return require(deckPath)
  }
}

module.exports = AsyncDeckLoader
