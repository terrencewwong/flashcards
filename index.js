const rl = require('readline-sync')
const dictionary = require('./cards/spanish-vocabulary/all.json')
const Card = require('./cards/spanish-vocabulary/card')

dictionary.forEach((cardDefinition) => {
  const card = new Card(cardDefinition)
  const [sideA, sideB] = card.renderRandomVariant()

  rl.question(`${sideA}`)
  console.log(`${sideB}`)
  // const response = rl.question('Did you get it correct (y/n)? ')
})
