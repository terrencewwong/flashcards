// @flow
module.exports = {
  command: 'practice <deck>',
  desc: 'Practice flashcards',
  handler: ({ deck }: { deck: string }) => console.log(deck)
}
