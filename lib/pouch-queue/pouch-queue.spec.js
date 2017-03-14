const PouchQueue = require('./')
const expect = require('expect')

const OPTIONS = {
  dbName: 'dbName',
  queueName: 'queueName',
  options: {adapter: 'memory'}
}

describe('pouch-queue', () => {
  beforeEach(() => {
    this.queue = new PouchQueue(OPTIONS)
  })

  afterEach(() => {
    return this.queue.destroy()
  })

  it('peek returns undefined for empty queue', async () => {
    const peeked = await this.queue.peek()
    expect(peeked).toBe(undefined)
  })

  it('can enqueue an item', async () => {
    const item = 'item'
    await this.queue.enqueue(item)
    const peeked = await this.queue.peek()
    expect(peeked).toBe(item)
  })

  it('can enqueue many items', async () => {
    const items = [1, 2]
    await this.queue.enqueueMany(items)
    const firstDequeued = await this.queue.dequeue()
    const secondDequeued = await this.queue.dequeue()
    expect(firstDequeued).toBe(items[0])
    expect(secondDequeued).toBe(items[1])
  })

  it('gets the length of an empty queue', async () => {
    const length = await this.queue.getLength()
    expect(length).toBe(0)
  })

  it('gets the length of a non empty queue', async () => {
    const item = 'item'
    await this.queue.enqueue(item)
    const length = await this.queue.getLength()
    expect(length).toBe(1)
  })

  it('can dequeue an item', async () => {
    const item = 'item'
    await this.queue.enqueue(item)
    const dequeued = await this.queue.dequeue(item)
    expect(dequeued).toBe(item)
  })

  it('can remove an item', async () => {
    const item = 'item'
    await this.queue.enqueue(item)
    const removed = await this.queue.remove(value => value === item)
    expect(removed).toEqual([item])
  })
})

describe('static pouch-queue methods', () => {
  it('has an asynchrous initializer', async () => {
    const item = 'item'
    const queue = await PouchQueue.initialize([item], OPTIONS)
    const peeked = await queue.peek()
    expect(peeked).toBe(item)

    // clean up
    await queue.destroy()
  })

  it('can set default queue options', () => {
    const defaultOptions = {
      dbName: 'custom dbName',
      queueName: 'custom queueName',
      options: {
        adapter: 'memory'
      }
    }

    PouchQueue.defaults(defaultOptions)
    const queue = new PouchQueue()
    expect(queue.queueName).toBe(defaultOptions.queueName)
  })
})
