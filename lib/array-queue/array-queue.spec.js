const expect = require('expect')
const Queue = require('./')

describe('queue', () => {
  it('has a length of 0 when there are 0 items', () => {
    const queue = new Queue()
    expect(queue.getLength()).toBe(0)
  })

  it('has a length of 1 when instantiated with 1 item', () => {
    const queue = new Queue(['foo'])
    expect(queue.getLength()).toBe(1)
  })

  it('cannot peek when the queue is empty', () => {
    const queue = new Queue()
    expect(queue.peek).toThrow()
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

  it('has a remove method', () => {
    const queue = new Queue()
    expect(queue.remove).toBeTruthy()
  })

  it('removes the item', () => {
    const item = 'foo'
    const queue = new Queue([item])
    const removed = queue.remove(queueItem => queueItem === item)
    expect(removed).toBe(item)
    expect(queue.getLength()).toBe(0)
  })

  it('cannot remove no item', () => {
    const queue = new Queue()
    const remove = () => queue.remove(queueItem => queueItem === 'foo')
    expect(remove).toThrow()
  })

  it('only removes one item at a time', () => {
    const item = 'foo'
    const queue = new Queue([item, item])
    const remove = () => queue.remove(queueItem => queueItem === item)
    expect(remove).toThrow()
  })

  it('has a dequeue method', () => {
    const queue = new Queue()
    expect(queue.dequeue).toBeTruthy()
  })

  it('dequeues the longest lived item', () => {
    const item = 'foo'
    const queue = new Queue([item])
    expect(queue.dequeue()).toBe(item)
    expect(queue.getLength()).toBe(0)
  })
})
