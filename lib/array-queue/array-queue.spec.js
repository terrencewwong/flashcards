const expect = require('expect')
const Queue = require('./')

describe('array-queue', () => {
  it('has a length of 0 when there are 0 items', () => {
    const queue = new Queue()
    expect(queue.getLength()).toBe(0)
  })

  it('has a length of 1 when instantiated with 1 item', () => {
    const queue = new Queue(['foo'])
    expect(queue.getLength()).toBe(1)
  })

  it('peek returns undefined when the queue is empty', () => {
    const queue = new Queue()
    expect(queue.peek()).toBe(undefined)
  })

  it('can peek the first item', () => {
    const item = 'foo'
    const queue = new Queue([item])
    expect(queue.peek()).toBe(item)
  })

  it('enqueues the item to the back of the queue', () => {
    const item = 'foo'
    const queue = new Queue()
    queue.enqueue(item)
    expect(queue.peek()).toBe(item)
  })

  it('removes the item', () => {
    const item = 'foo'
    const queue = new Queue([item])
    const removed = queue.remove(queueItem => queueItem === item)
    expect(removed).toEqual([item])
    expect(queue.getLength()).toBe(0)
  })

  it('returns an empty array when removing a non existing item', () => {
    const queue = new Queue()
    const removed = queue.remove(queueItem => queueItem === 'does not exist')
    expect(removed).toEqual([])
  })

  it('can remove more than one item at a time', () => {
    const item = 'foo'
    const queue = new Queue([item, item])
    const removed = queue.remove(queueItem => queueItem === item)
    expect(removed).toEqual([item, item])
  })

  it('dequeues the longest lived item', () => {
    const item = 'foo'
    const queue = new Queue([item])
    expect(queue.dequeue()).toBe(item)
    expect(queue.getLength()).toBe(0)
  })
})
