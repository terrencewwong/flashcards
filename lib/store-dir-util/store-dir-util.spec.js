const StoreDirUtil = require('./')
const expect = require('expect')
const mock = require('mock-fs')
const path = require('path')
const fs = require('fs')
const {homedir} = require('os')

describe('store-dir-util', () => {
  afterEach(mock.restore)

  it('returns the local store dir if it exists', () => {
    mock({
      '.flashcards': mock.directory()
    })

    const expectedPath = path.resolve(process.cwd(), '.flashcards') + '/'
    expect(StoreDirUtil.get()).toBe(expectedPath)
  })

  it('returns the home store dir if there is no local dir', () => {
    const expectedPath = path.resolve(homedir(), '.flashcards') + '/'
    expect(StoreDirUtil.get()).toBe(expectedPath)
  })

  it('creates the home store dir if it doesnt exist', () => {
    const expectedPath = path.resolve(homedir(), '.flashcards') + '/'
    expect(StoreDirUtil.get()).toBe(expectedPath)
    expect(fs.existsSync(expectedPath)).toBe(true)
  })
})
