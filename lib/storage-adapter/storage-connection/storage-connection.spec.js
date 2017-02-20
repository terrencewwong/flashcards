const StorageConnection = require('./')
const expect = require('expect')
const sinon = require('sinon')
const decks = require('../../../decks')

const SPANISH_VOCAB = 'spanish-vocabulary'

class StorageMock {
  constructor () {
    this.initSyncSpy = sinon.spy()
    this.setItemSyncSpy = sinon.spy()
    this.lengthStub = sinon.stub().returns(0)
    this.createStub = sinon.stub()
  }

  static create () {
    return new this()
  }

  withItemCount (count) {
    this.lengthStub = this.lengthStub.returns(count)
    return this
  }

  build () {
    const spies = {
      initSync: this.initSyncSpy,
      setItemSync: this.setItemSyncSpy,
      length: this.lengthStub
    }

    // mimics the node-pesist api
    return {
      create: this.createStub.returns(spies),
      spies
    }
  }
}

describe('storage-connection', () => {
  it('constructor - initializes the backlogs with the decks', () => {
    const storageMock = StorageMock.create().build()
    const connection = new StorageConnection(storageMock)
    const numStorages = decks.length * 4
    expect(storageMock.spies.initSync.callCount).toBe(numStorages)
  })

  it('pushIntoBacklog - calls setItemSync', () => {
    const storageMock = StorageMock.create().build()
    const connection = new StorageConnection(storageMock)
    connection.pushIntoBacklog(SPANISH_VOCAB, 'some card')
    expect(storageMock.spies.setItemSync.called)
  })

  it('popFromBacklog - throws an error when the backlog is empty', () => {
    const storageMock = StorageMock.create().build()
    const connection = new StorageConnection(storageMock)
    expect(connection.popFromBacklog.bind(SPANISH_VOCAB)).toThrow()
  })

  it('popFromBacklog - calls removeItemSync when there is an item in the backlog', () => {
    const storageMock = StorageMock.create().withItemCount(1).build()
    const connection = new StorageConnection(storageMock)
  })
})
