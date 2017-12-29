// @flow
import Wreck from 'wreck'

module.exports = {
  command: 'practice <deck>',
  desc: 'Practice flashcards',
  handler: async ({ deck }: { deck: string }) => {
    const { res, payload }= await Wreck.get('http://localhost:8000/next-card', {
      json: true
    })
    console.log(payload)
  }
}
