const rl = require('readline-sync')
const LearningStrategy = require('../../lib/learning-strategy')

async function practiceDeck (deck) {
  const learningStrategy = await LearningStrategy.fromDeckName(deck)
  const card = await learningStrategy.getNextCard()
  if (card) {
    const {id, sideA, sideB} = card
    rl.question(`${sideA}`)
    console.log(`${sideB}`)
    const answer = rl.question('Did you get it correct (y/n)? ')
    learningStrategy.submitCard(id, answer, () => process.exit())
  } else {
    console.log(`Looks like there are no cards to study in ${deck}`)
  }
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
  handler: ({deck}) => practiceDeck(deck)
}
