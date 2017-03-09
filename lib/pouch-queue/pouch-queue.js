/* @flow */
const PouchDB = require('pouchdb')
PouchDB.plugin(require('pouchdb-upsert'))
if (process.env.NODE_ENV === 'test') {
  PouchDB.plugin(require('pouchdb-adapter-memory'))
}

class PouchQueue<T> {
  db: PouchDB;
  queueName: string;

  constructor (args: {
    dbName: string,
    queueName: string,
    options: Object
  }) {
    const {dbName, queueName, options = {}} = args
    this.db = new PouchDB(dbName, options)
    this.queueName = queueName
  }

  async getLength (): Promise<number> {
    const queue = await this._getQueueFromStorage()
    return queue.length
  }

  async peek (): Promise<?T> {
    const queue = await this._getQueueFromStorage()
    return queue[0]
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

  async remove (callback: (element: T) => boolean): Promise<?T[]> {
    let removed: T[]
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

  async _getQueueFromStorage (): Promise<any> {
    try {
      const {queue} = await this.db.get(this.queueName)
      return queue
    } catch (e) {
      return []
    }
  }
}

module.exports = PouchQueue
