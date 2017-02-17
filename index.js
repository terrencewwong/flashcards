const rl = require('readline-sync')
const {green, red, underline} = require('colors') // modifies String prototype
const dictionary = require('./cards/spanish-vocabulary/all.json')
const Card = require('./cards/spanish-vocabulary/card')

dictionary.forEach((cardDefinition) => {
  const card = new Card(cardDefinition)
  const [sideA, sideB] = card.renderRandomVariant()

  rl.question(`${sideA}`)
  console.log(`${sideB}`)
  const response = rl.question('Did you get it correct (y/n)? ')
})
