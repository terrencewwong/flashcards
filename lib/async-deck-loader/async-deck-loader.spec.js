const AsyncDeckLoader = require('./')
const expect = require('expect')

const Persistor = require('pouchdb')
Persistor.plugin(require('pouchdb-upsert'))
Persistor.plugin(require('pouchdb-adapter-memory'))
const InMemoryPersistor = Persistor.defaults({adapter: 'memory'})

describe('async-deck-loader', () => {
  describe('unit', () => {
    beforeEach(() => {
      this.deckLoader = new AsyncDeckLoader('deckName', InMemoryPersistor)
    })

    it('isLoaded returns false when deck is not loaded', async () => {
      expect(await this.deckLoader.isLoaded()).toBe(false)
    })

    it('can set loaded to true', async () => {
      await this.deckLoader.setLoaded(true)
      expect(await this.deckLoader.isLoaded()).toBe(true)
    })

    it('can set loaded to false', async () => {
      await this.deckLoader.setLoaded(true)
      await this.deckLoader.setLoaded(false)
      expect(await this.deckLoader.isLoaded()).toBe(false)
    })
  })

  describe('integration', () => {
    it('has a load function', async () => {
      // the name of the deck is 'fixtures'
      // so we load from the fixtures directory
      const deckLoader = new AsyncDeckLoader('fixtures', InMemoryPersistor)
      const deck = require('./fixtures')
      const loadedDeck = await deckLoader.load({
        path: __dirname
      })

      expect(loadedDeck).toEqual(deck)
    })
  })
})
