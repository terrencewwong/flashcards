const expect = require('expect')
const Queue = require('./')

describe('async-array-queue', async () => {
  it('has a length of 0 when there are 0 items', async () => {
    const queue = await Queue.initialize()
    expect(await queue.getLength()).toBe(0)
  })

  it('has a length of 1 when instantiated with 1 item', async () => {
    const queue = await Queue.initialize(['foo'])
    expect(await queue.getLength()).toBe(1)
  })

  it('peek throws an error when the queue is empty', async () => {
    const queue = await Queue.initialize()
    let error
    try {
      await queue.peek()
    } catch (e) {
      error = e
    }
    expect(error).toBeTruthy()
  })

  it('can peek the first item', async () => {
    const item = 'foo'
    const queue = await Queue.initialize([item])
    expect(await queue.peek()).toBe(item)
  })

  it('enqueues the item to the back of the queue', async () => {
    const item = 'foo'
    const queue = await Queue.initialize()
    queue.enqueue(item)
    expect(await queue.peek()).toBe(item)
  })

  it('removes the item', async () => {
    const item = 'foo'
    const queue = await Queue.initialize([item])
    const removed = await queue.remove(queueItem => queueItem === item)
    expect(removed).toEqual([item])
    expect(await queue.getLength()).toBe(0)
  })

  it('returns an empty array when removing a non existing item', async () => {
    const queue = await Queue.initialize()
    const removed = await queue.remove(queueItem => queueItem === 'does not exist')
    expect(removed).toEqual([])
  })

  it('can remove more than one item at a time', async () => {
    const item = 'foo'
    const queue = await Queue.initialize([item, item])
    const removed = await queue.remove(queueItem => queueItem === item)
    expect(removed).toEqual([item, item])
  })

  it('dequeues the longest lived item', async () => {
    const item = 'foo'
    const queue = await Queue.initialize([item])
    expect(await queue.dequeue()).toBe(item)
    expect(await queue.getLength()).toBe(0)
  })
})
