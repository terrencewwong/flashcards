/* @flow */
const levelup = require('levelup')
const promisify = require('q-level')

type ConstructorOptions = {
  adapter?: string
}

type DBConfig = {
  valueEncoding: string,
  db: Object
}

class LevelDBWrapper {
  location: string;
  adapter: ?string;
  dbConfig: DBConfig;
  db: Object;

  constructor (location: string, options?: ConstructorOptions = {}) {
    if (!location) {
      throw new Error('Argument `location: string` is required!')
    }

    this.location = location
    this.adapter = options.adapter

    this.dbConfig = {
      valueEncoding: 'json',
      db: this.adapter === 'memory'
        ? require('memdown')
        : require('leveldown')
    }

    this.db = promisify(levelup(this.location, this.dbConfig))
  }

  async get (key: string): Promise<any> {
    return this.db.get(key)
  }

  async put (key: string, value: any): Promise<?Error> {
    return this.db.put(key, value)
  }

  async destroy (): Promise<any> {
    if (this.adapter === 'memory') {
      return this.dbConfig.db.clearGlobalStore(true)
    }

    return new Promise((resolve, reject) => {
      this.dbConfig.db.destroy(this.location, err => {
        if (err) reject(err)
        resolve()
      })
    })
  }
}

module.exports = LevelDBWrapper
