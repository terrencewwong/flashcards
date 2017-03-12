/* @flow */
class ArrayQueue<T> {
  _queue: Array<T>;

  constructor (queue?: Array<T>) {
    this._queue = queue || []
  }

  getLength (): number {
    return this._queue.length
  }

  peek () : T {
    if (!this.getLength()) {
      throw new Error('Queue is empty!')
    }
    return this._queue[0]
  }

  enqueue (item: T): void {
    this._queue.push(item)
  }

  dequeue (): T {
    if (!this.getLength()) {
      throw new Error('Queue is empty!')
    }

    return this._queue.shift()
  }

  remove (callback: (element: T) => boolean): T[] {
    const items = this._queue.filter(callback)
    this._queue = this._queue.filter((item) => !callback(item))
    return items
  }
}

module.exports = ArrayQueue
