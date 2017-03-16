/* @flow */
const path = require('path')
const fs = require('fs')
const {homedir} = require('os')
const STORE_DIR_NAME = '.flashcards'

class StoreDirUtil {
  static path: Object;
  static fs: Object;

  static get (): string {
    // Trailing / is required so PouchDB writes inside of the directory
    const localStoreDir = path.resolve(process.cwd(), STORE_DIR_NAME) + '/'
    const homeStoreDir = path.resolve(homedir(), STORE_DIR_NAME) + '/'

    if (fs.existsSync(localStoreDir)) {
      return localStoreDir
    }

    if (!fs.existsSync(homeStoreDir)) {
      fs.mkdirSync(homeStoreDir)
    }

    return homeStoreDir
  }
}

module.exports = StoreDirUtil
