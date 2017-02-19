const fs = require('fs')
const {join} = require('path')
const decksPath = join(__dirname, 'decks')

const decks = fs
  .readdirSync(decksPath)
  .map(file => {
    const pjson = require(join(decksPath, file, 'package.json'))
    const {name} = pjson
    return {name}
  })

module.exports = decks
