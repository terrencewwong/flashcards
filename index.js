const rl = require('readline-sync')
const {green, red, underline} = require('colors') // modifies String prototype
const dictionary = require('./cards/spanish-vocabulary/all.json')

dictionary.forEach((word, index) => {
  const source = word.english
  const target = word.spanish

  const answer = rl.question(`Translate ${underline(source)}: `)

  if (verify(target, answer)) {
    console.log(green('correct!'))
  } else {
    console.log(red('wrong!'), target)
  }
})

function verify (expected, answer) {
  return answer.toLowerCase() === expected.toLowerCase()
}
