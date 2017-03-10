const expect = require('expect')
const {it, mock} = require('mocha-mock')
const LearningStrategy = require('./')
const Queue = require('../async-array-queue')

describe('learning-strategy', () => {
  it('cannot get the next card if there is none', async () => {
    const learningStrategy = new LearningStrategy()
    let error
    try {
      await learningStrategy.getNextCard()
    } catch (e) {
      error = e
    }

    expect(error).toBeTruthy()
    expect(error.message).toBe('No card to get.')
  })

  it('can get the next card', async () => {
    const scoredCard = ScoredCardBuilder.create().build()
    const hpq = mock(await Queue.initialize([scoredCard]))
      .shouldReceive('peek')
      .once()
      .andReturn(scoredCard)

    const learningStrategy = new LearningStrategy({hpq})
    expect(await learningStrategy.getNextCard()).toBe(scoredCard.card)
  })

  it('can move the card from the HPQ to the back of the LPQ', async () => {
    const scoredCard = ScoredCardBuilder.create().build()
    const updatedScoredCard = {
      card: scoredCard.card,
      correctCount: scoredCard.correctCount + 1
    }

    const hpq = mock(await Queue.initialize([scoredCard]))
      .shouldReceive('remove')
      .once()
      .andReturn([scoredCard])
    const lpq = mock(await Queue.initialize())
      .shouldReceive('enqueue')
      .once()
      .with(updatedScoredCard)
    const learningStrategy = new LearningStrategy({hpq, lpq})
    learningStrategy.submitCard(scoredCard.card.id, true)
  })

  it('can move the card from the HPQ to the back of the HPQ', async () => {
    const scoredCard = ScoredCardBuilder.create().build()
    const updatedScoredCard = {
      card: scoredCard.card,
      correctCount: scoredCard.correctCount - 1
    }

    const hpq = mock(await Queue.initialize([scoredCard]))
      .shouldReceive('remove')
      .once()
      .andReturn([scoredCard])
      .shouldReceive('enqueue')
      .once()
      .with(updatedScoredCard)

    const learningStrategy = new LearningStrategy({hpq})
    learningStrategy.submitCard(scoredCard.card.id, false)
  })

  it('can move the card from the HPQ to Done', async () => {
    const learnedThreshold = 1
    const scoredCard = ScoredCardBuilder
      .create()
      .withCorrectCount(learnedThreshold)
      .build()
    const updatedScoredCard = {
      card: scoredCard.card,
      correctCount: scoredCard.correctCount + 1
    }

    const hpq = mock(await Queue.initialize([scoredCard]))
      .shouldReceive('remove')
      .once()
      .andReturn([scoredCard])
    const done = mock(await Queue.initialize())
      .shouldReceive('enqueue')
      .once()
      .with(updatedScoredCard)

    const learningStrategy = new LearningStrategy({hpq, done, learnedThreshold})
    learningStrategy.submitCard(scoredCard.card.id, true)
  })

  it('can refill the HPQ when the HPQ is half empty', async () => {
    const learnedThreshold = 1
    const hpqScoredCard = ScoredCardBuilder
      .create()
      .withCorrectCount(learnedThreshold)
      .build()

    const lpqScoredCard = ScoredCardBuilder.create().build()
    const backlogScoredCard = ScoredCardBuilder.create().build()

    const hpq = mock(await Queue.initialize([hpqScoredCard]))
      .shouldReceive('remove')
      .once()
      .andReturn([hpqScoredCard])
      .shouldReceive('getLength')
      .once()
      .andReturn(0)
      .shouldReceive('enqueue')
      .twice()

    const lpq = mock(await Queue.initialize([lpqScoredCard]))
      .shouldReceive('dequeue')
      .once()
      .andReturn(lpqScoredCard)

    const backlog = mock(await Queue.initialize([backlogScoredCard]))
      .shouldReceive('dequeue')
      .once()
      .andReturn(backlogScoredCard)

    const learningStrategy = new LearningStrategy({
      hpq,
      hpqCapacity: 2,
      lpq,
      backlog,
      learnedThreshold
    })

    learningStrategy.submitCard(hpqScoredCard.card.id, true)
  })
})

class ScoredCardBuilder {
  constructor () {
    this.data = 'card data'
    this.id = Math.random()
    this.correctCount = 0
  }

  static create () {
    return new this()
  }

  withData (data) {
    this.data = data
    return this
  }

  withId (id) {
    this.id = id
    return this
  }

  withCorrectCount (correctCount) {
    this.correctCount = correctCount
    return this
  }

  build () {
    const card = {
      data: this.data,
      id: this.id
    }

    return {
      card,
      correctCount: this.correctCount
    }
  }
}
