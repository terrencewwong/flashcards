/* @flow */
declare function describe(name:string, callback:Function):void;
declare function it(name:string, callback:Function):void;
declare function beforeEach(callback:Function):void;
declare function afterEach(callback:Function):void;

const DB = require('./')
const expect = require('expect')

describe('level-db-wrapper', function () {
  beforeEach(function () {
    const location = './mydb'
    const options = {adapter: 'memory'}
    this.db = new DB(location, options)
  })

  afterEach(function () {
    return this.db.destroy()
  })

  it('throws an error when getting no existing thing', async function () {
    let error
    try {
      await this.db.get('does not exist')
    } catch (e) {
      error = e
    }

    expect(error).toBeTruthy()
  })

  it('can put', async function () {
    const key = 'key'
    const value = 'value'
    await this.db.put(key, value)
    const got = await this.db.get(key)

    expect(got).toBe(value)
  })
})
