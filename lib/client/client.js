const readlineSync = require('readline-sync')
const {getNextCard, submitCard} = require('./transport')

getNextCard((err, card) => {
  const {sideA, sideB} = card
  readlineSync.question(sideA)
  console.log(sideB)
  readlineSync.question('Correct? y/n ')
})
