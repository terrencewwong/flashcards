const storageAdapter = require('../../lib/storage-adapter')
const path = require('path')

function installDeck (deck) {
  const connection = storageAdapter.connect()
  const data = require(`../../decks/decks/${deck}/data.json`)
  process.stdout.write(`installing ${deck}`)
  data.forEach(card => {
    process.stdout.write('.')
    connection.pushIntoBacklog(deck, card)
  })
  console.log('done')
}

module.exports = {
  command: 'install <package-name>',
  desc: 'Install a deck of flashcards',
  handler: ({packageName}) => installDeck(packageName)
}
