class Queue {
  constructor (queue) {
    this._queue = queue || []
  }

  getLength () {
    return this._queue.length
  }

  peek () {
    if (!this.getLength()) {
      throw new Error('Queue is empty.')
    }
    return this._queue[0]
  }

  enqueue (item) {
    this._queue.push(item)
  }

  dequeue () {
    if (!this.getLength()) {
      return undefined
    }

    return this._queue.shift()
  }

  remove (callback) {
    const items = this._queue.filter(callback)
    if (!items.length) {
      throw new Error('Nothing to remove.')
    } else if (items.length > 1) {
      throw new Error('Cannot remove more than one item at a time')
    }

    this._queue = this._queue.filter((item) => !callback(item))
    return items[0]
  }
}

module.exports = Queue
