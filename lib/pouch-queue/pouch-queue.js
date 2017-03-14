/* @flow */
const PouchDB = require('pouchdb')
PouchDB.plugin(require('pouchdb-upsert'))
PouchDB.plugin(require('pouchdb-adapter-memory'))

type ConstructorOptions = {
  dbName?: string,
  queueName?: string,
  options?: Object
}

class PouchQueue<T> {
  db: PouchDB;
  queueName: string;
  static defaultOptions: Object;

  constructor (args: ConstructorOptions) {
    args = {
      ...PouchQueue.defaultOptions,
      ...args
    }

    const {dbName, queueName, options = {}} = args
    this.db = new PouchDB(dbName, options)
    this.queueName = queueName
  }

  static async initialize (
    contents?: Array<T> = [],
    options?: ConstructorOptions = {}
  ) : Promise<PouchQueue<T>> {
    const queue: PouchQueue<T> = new this(options)
    await queue.enqueueMany(contents)
    return queue
  }

  static defaults (defaultOptions: Object = {}) {
    this.defaultOptions = defaultOptions
  }

  async getLength (): Promise<number> {
    const queue = await this._getQueueFromStorage()
    return queue.length
  }

  async peek (): Promise<?T> {
    const queue = await this._getQueueFromStorage()
    return queue[0]
  }

  async peekAll (): Promise<T[]> {
    return await this._getQueueFromStorage()
  }

  async enqueue (item: T): Promise<any> {
    await this.db.upsert(this.queueName, doc => {
      if (!doc.queue) {
        doc.queue = []
      }

      doc.queue.push(item)
      return doc
    })
  }

  async enqueueMany (items: T[]): Promise<any> {
    await this.db.upsert(this.queueName, doc => {
      if (!doc.queue) {
        doc.queue = []
      }

      doc.queue = doc.queue.concat(items)
      return doc
    })
  }

  async dequeue (): Promise<?T> {
    let dequeued: T
    await this.db.upsert(this.queueName, doc => {
      if (!doc.queue) {
        doc.queue = []
      }

      dequeued = doc.queue.shift()
      return doc
    })

    return dequeued
  }

  async destroy (): Promise<any> {
    return this.db.destroy()
  }

  async remove (callback: (element: T) => boolean): Promise<T[]> {
    let removed: T[] = []
    await this.db.upsert(this.queueName, doc => {
      if (!doc.queue) {
        doc.queue = []
      }

      removed = doc.queue.filter(callback)
      doc.queue = doc.queue.filter(item => !callback(item))
      return doc
    })

    return removed
  }

  async _getQueueFromStorage (): Promise<T[]> {
    try {
      const {queue} = await this.db.get(this.queueName)
      return queue
    } catch (e) {
      return []
    }
  }
}

PouchQueue.defaultOptions = {}

module.exports = PouchQueue
