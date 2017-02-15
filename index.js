const readline = require('readline')
const {green, red, underline} = require('colors') // modifies String prototype

const dictionary = {
  "hello": {
    english: "hello",
    spanish: "hola"
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

for (key in dictionary) {
  const word = dictionary[key]
  const source = 'english'
  const target = 'spanish'
  rl.question(`Translate ${underline(word[source])}: `, (answer) => {
    if (verify(key, target, answer)) {
      console.log(green('correct!'))
    } else {
      console.log(red('wrong!'))
    }
    rl.close()
  })
}

function verify (key, target, answer) {
  const word = dictionary[key]
  return answer.toLowerCase() === word[target].toLowerCase()
}
