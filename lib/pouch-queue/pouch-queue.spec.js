const PouchQueue = require('./')
const expect = require('expect')

describe('pouch-queue', () => {
  beforeEach(() => {
    this.queue = new PouchQueue({
      dbName: 'dbName',
      queueName: 'queueName',
      options: {adapter: 'memory'}
    })
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
