const expect = require('expect')
const {it, mock} = require('mocha-mock')
const LearningStrategy = require('./')
const Queue = require('../array-queue')

describe('learning-strategy', () => {
  it('cannot get the next card if there is none', () => {
    const learningStrategy = new LearningStrategy()
    expect(learningStrategy.getNextCard).toThrow()
  })

  it('can get the next card', () => {
    const scoredCard = ScoredCardBuilder.create().build()
    const hpq = mock(new Queue([scoredCard]))
      .shouldReceive('peek')
      .once()
      .andReturn(scoredCard)

    const learningStrategy = new LearningStrategy({hpq})
    expect(learningStrategy.getNextCard()).toBe(scoredCard.card)
  })

  it('can move the card from the HPQ to the back of the LPQ', () => {
    const scoredCard = ScoredCardBuilder.create().build()
    const updatedScoredCard = {
      card: scoredCard.card,
      correctCount: scoredCard.correctCount + 1
    }

    const hpq = mock(new Queue([scoredCard]))
      .shouldReceive('remove')
      .once()
      .andReturn(scoredCard)
    const lpq = mock(new Queue())
      .shouldReceive('enqueue')
      .once()
      .with(updatedScoredCard)
    const learningStrategy = new LearningStrategy({hpq, lpq})
    learningStrategy.submitCard(scoredCard.card.id, true)
  })

  it('can move the card from the HPQ to the back of the HPQ', () => {
    const scoredCard = ScoredCardBuilder.create().build()
    const updatedScoredCard = {
      card: scoredCard.card,
      correctCount: scoredCard.correctCount - 1
    }

    const hpq = mock(new Queue([scoredCard]))
      .shouldReceive('remove')
      .once()
      .andReturn(scoredCard)
      .shouldReceive('enqueue')
      .once()
      .with(updatedScoredCard)

    const learningStrategy = new LearningStrategy({hpq})
    learningStrategy.submitCard(scoredCard.card.id, false)
  })

  it('can move the card from the HPQ to Done', () => {
    const learnedThreshold = 1
    const scoredCard = ScoredCardBuilder
      .create()
      .withCorrectCount(learnedThreshold)
      .build()
    const updatedScoredCard = {
      card: scoredCard.card,
      correctCount: scoredCard.correctCount + 1
    }

    const hpq = mock(new Queue([scoredCard]))
      .shouldReceive('remove')
      .once()
      .andReturn(scoredCard)
    const done = mock(new Queue())
      .shouldReceive('enqueue')
      .once()
      .with(updatedScoredCard)

    const learningStrategy = new LearningStrategy({hpq, done, learnedThreshold})
    learningStrategy.submitCard(scoredCard.card.id, true)
  })

  it('can refill the HPQ when the HPQ is half empty', () => {
    const learnedThreshold = 1
    const hpqScoredCard = ScoredCardBuilder
      .create()
      .withCorrectCount(learnedThreshold)
      .build()

    const lpqScoredCard = ScoredCardBuilder.create().build()
    const backlogScoredCard = ScoredCardBuilder.create().build()

    const hpq = mock(new Queue([hpqScoredCard]))
      .shouldReceive('remove')
      .once()
      .andReturn(hpqScoredCard)
      .shouldReceive('getLength')
      .once()
      .andReturn(0)
      .shouldReceive('enqueue')
      .twice()

    const lpq = mock(new Queue([lpqScoredCard]))
      .shouldReceive('dequeue')
      .once()
      .andReturn(lpqScoredCard)

    const backlog = mock(new Queue([backlogScoredCard]))
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
