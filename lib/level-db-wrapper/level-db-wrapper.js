/* @flow */
const levelup = require('levelup')
const leveldown = require('leveldown')
const memdown = require('memdown')
const promisify = require('q-level')

type ConstructorOptions = {
  adapter?: string
}

type DBConfig = {
  valueEncoding: string,
  db?: Object
}

class LevelDBWrapper {
  location: string;
  adapter: ?string;
  db: Object;

  constructor (location: string, options?: ConstructorOptions = {}) {
    if (!location) {
      throw new Error('Argument `location: string` is required!')
    }

    this.location = location
    this.adapter = options.adapter

    const dbConfig: DBConfig = {valueEncoding: 'json'}
    if (this.adapter === 'memory') {
      dbConfig.db = memdown
    }

    this.db = promisify(levelup(this.location, dbConfig))
  }

  async get (key: string): Promise<any> {
    return this.db.get(key)
  }

  async put (key: string, value: any): Promise<?Error> {
    return this.db.put(key, value)
  }

  async destroy (): Promise<any> {
    if (this.adapter === 'memory') {
      return memdown.clearGlobalStore(true)
    }

    return new Promise((resolve, reject) => {
      leveldown.destroy(this.location, err => {
        if (err) reject(err)
        resolve()
      })
    })
  }
}

module.exports = LevelDBWrapper
