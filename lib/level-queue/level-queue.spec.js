const LevelQueue = require('./')
const expect = require('expect')
const DB = require('../level-db-wrapper')

describe('level-queue', () => {
  beforeEach(() => {
    this.queue = new LevelQueue({
      db: new DB('mydb', {adapter: 'memory'}),
      queueName: 'queueName'
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
    await this.queue.destroy()
  })

  it('can dequeue an item', async () => {
    const item = 'item'
    await this.queue.enqueue(item)
    const dequeued = await this.queue.dequeue(item)
    expect(dequeued).toBe(item)
    await this.queue.destroy()
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

  it('can remove an item', async () => {
    const item = 'item'
    await this.queue.enqueue(item)
    const removed = await this.queue.remove(value => value === item)
    expect(removed).toEqual([item])
  })
})

describe('static level-queue methods', () => {
  it('has an asynchrous initializer', async () => {
    const item = 'item'
    const queue = await LevelQueue.initialize([item], {
      db: new DB('mydb', {adapter: 'memory'}),
      queueName: 'queueName'
    })
    const peeked = await queue.peek()
    expect(peeked).toBe(item)

    // clean up
    await queue.destroy()
  })
})
