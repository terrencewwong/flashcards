const rl = require('readline-sync')
const client = require('../../lib/client')
const ensureServer = require('../utils/ensure-server')

function practiceDeck (deck) {
  client.getNextCard(deck, (err, card) => {
    const {sideA, sideB} = card
    if (err) {
      console.log(err)
      return
    }

    rl.question(`${sideA}`)
    console.log(`${sideB}`)
    const answer = rl.question('Did you get it correct (y/n)? ')
    client.submitCard(deck, answer, () => process.exit())
  })
}

module.exports = {
  command: 'practice',
  desc: 'Practice flashcards',
  builder: {
    deck: {
      describe: 'Specify a deck(s) of flashcards to practice',
      choices: ['spanish-vocabulary']
    }
  },
  handler: ({deck}) => ensureServer(() => practiceDeck(deck))
}
