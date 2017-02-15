const path = require('path')
const {readdirSync} = require('fs')
const DIR = path.join(__dirname, 'units')
const files = readdirSync(DIR)
const dictionary = files
  .map(file => require(path.join(DIR, file)))
  .reduce((allWords, words) => allWords.concat(words), [])

console.log(dictionary)
