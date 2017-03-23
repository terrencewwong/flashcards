/* @flow */
type ConstructorOptions = {
  db: Object,
  queueName: string
}

class LevelQueue<T> {
  db: Object;
  queueName: string;

  constructor (args: ConstructorOptions) {
    const {db, queueName} = args

    if (!db || !queueName) {
      throw new Error('Must supply a db and a queueName!')
    }

    this.db = db
    this.queueName = queueName
  }

  static async initialize (
    contents?: Array<T> = [],
    options: ConstructorOptions
  ) : Promise<LevelQueue<T>> {
    const queue: LevelQueue<T> = new this(options)
    await queue.enqueueMany(contents)
    return queue
  }

  async getLength (): Promise<number> {
    const queue = await this._retrieveQueueFromStorage()
    return queue.length
  }

  async peek (): Promise<?T> {
    const queue = await this._retrieveQueueFromStorage()
    return queue[0]
  }

  async peekAll (): Promise<T[]> {
    return this._retrieveQueueFromStorage()
  }

  async enqueue (item: T): Promise<any> {
    const queue = await this._retrieveQueueFromStorage()
    queue.push(item)
    return this.db.put(this.queueName, queue)
  }

  async enqueueMany (items: T[]): Promise<any> {
    const queue = await this._retrieveQueueFromStorage()
    return this.db.put(this.queueName, queue.concat(items))
  }

  async dequeue (): Promise<?T> {
    const queue = await this._retrieveQueueFromStorage()
    const dequeued = queue.shift()
    await this.db.put(this.queueName, queue)
    return dequeued
  }

  async remove (callback: (element: T) => boolean): Promise<T[]> {
    let removed: T[] = []
    const queue = await this._retrieveQueueFromStorage()
    removed = queue.filter(callback)
    const remaining = queue.filter(item => !callback(item))
    await this.db.put(this.queueName, remaining)
    return removed
  }

  async destroy (): Promise<any> {
    return this.db.destroy()
  }

  async _retrieveQueueFromStorage (): Promise<T[]> {
    try {
      return await this.db.get(this.queueName)
    } catch (e) {
      return []
    }
  }
}

module.exports = LevelQueue
