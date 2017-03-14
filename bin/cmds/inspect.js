const LearningStrategy = require('../../lib/learning-strategy')
const BACKLOG_MAX_ITEMS_SHOWN = 10

async function inspect (deck) {
  const learningStrategy = await LearningStrategy.fromDeckName(deck)

  console.log('High Priority Queue')
  const hpqContents = await learningStrategy.hpq.peekAll()
  hpqContents.forEach(({card, correctCount}, index) => {
    const rendered = learningStrategy.CardRenderer.renderVariant(card, 'english')
    console.log(`  ${index + 1}.\tscore: ${correctCount}\t${rendered.sideA}`)
  })

  console.log()

  console.log('Low Priority Queue')
  const lpqContents = await learningStrategy.lpq.peekAll()
  lpqContents.forEach(({card, correctCount}, index) => {
    const rendered = learningStrategy.CardRenderer.renderVariant(card, 'english')
    console.log(`  ${index + 1}.\tscore: ${correctCount}\t${rendered.sideA}`)
  })

  console.log()

  console.log('Backlog')
  const backlogContents = await learningStrategy.backlog.peekAll()
  backlogContents.slice(0, BACKLOG_MAX_ITEMS_SHOWN).forEach(({card, correctCount}, index) => {
    const rendered = learningStrategy.CardRenderer.renderVariant(card, 'english')
    console.log(`  ${index + 1}.\tscore: ${correctCount}\t${rendered.sideA}`)
  })
  if (backlogContents.length > BACKLOG_MAX_ITEMS_SHOWN) {
    console.log('...')
  }

  console.log()

  console.log('Done')
  const doneContents = await learningStrategy.done.peekAll()
  if (!doneContents.length) {
    console.log('empty')
  } else {
    doneContents.forEach(({card, correctCount}, index) => {
      const rendered = learningStrategy.CardRenderer.renderVariant(card, 'english')
      console.log(`  ${index + 1}.\tscore: ${correctCount}\t${rendered.sideA}`)
    })
  }
}

module.exports = {
  command: 'inspect',
  desc: 'Inspect the cards you\'re learning',
  builder: {
    deck: {
      describe: 'Specify a deck of flashcards to inspect',
      choices: ['spanish-vocabulary']
    }
  },
  handler: ({deck}) => inspect(deck)
}
