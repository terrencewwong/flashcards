/* @flow */
const ArrayQueue = require('../array-queue')

class AsyncArrayQueue<T> {
  _queue: ArrayQueue<T>;

  constructor (queue?: Array<T>) {
    this._queue = new ArrayQueue(queue)
  }

  static async initialize (queue?: Array<T>) {
    return new this(queue)
  }

  async getLength (): Promise<number> {
    return this._queue.getLength()
  }

  async peek () : Promise<T> {
    return this._queue.peek()
  }

  async enqueue (item: T): Promise<void> {
    return this._queue.enqueue(item)
  }

  async dequeue (): Promise<T> {
    return this._queue.dequeue()
  }

  async remove (callback: (element: T) => boolean): Promise<T[]> {
    return this._queue.remove(callback)
  }

}

module.exports = AsyncArrayQueue
