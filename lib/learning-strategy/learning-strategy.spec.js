const expect = require('expect')
const {it, mock} = require('mocha-mock')
const LearningStrategy = require('./')
const Queue = require('../queue')

const LEARNED_THRESHOLD = LearningStrategy.LEARNED_THRESHOLD

describe('learning-strategy', () => {
  it('cannot get the next card if there is none', () => {
    const learningStrategy = new LearningStrategy()
    expect(learningStrategy.getNextCard).toThrow()
  })

  it('can get the next card', () => {
    const card = CardBuilder.create().build()
    const hpq = mock(new Queue([card]))
      .shouldReceive('peek')
      .once()
      .andReturn(card)

    const learningStrategy = new LearningStrategy({hpq})
    expect(learningStrategy.getNextCard()).toBe(card)
  })

  it('can move the card from the HPQ to the back of the LPQ', () => {
    const card = CardBuilder.create().build()
    const hpq = mock(new Queue([card]))
      .shouldReceive('remove')
      .once()
      .andReturn(card)
    const lpq = mock(new Queue())
      .shouldReceive('enqueue')
      .once()
      .with(card)

    const learningStrategy = new LearningStrategy({hpq, lpq})
    learningStrategy.submitCard(card.id, true)
  })

  it('can move the card from the HPQ to the back of the HPQ', () => {
    const card = CardBuilder.create().build()
    const hpq = mock(new Queue([card]))
      .shouldReceive('remove')
      .once()
      .andReturn(card)
      .shouldReceive('enqueue')
      .once()
      .with(card)

    const learningStrategy = new LearningStrategy({hpq})
    learningStrategy.submitCard(card.id, false)
  })

  it('can move the card from the HPQ to Done', () => {
    const card = CardBuilder
      .create()
      .atLearnedThreshold()
      .build()
    const hpq = mock(new Queue([card]))
      .shouldReceive('remove')
      .once()
      .andReturn(card)
    const done = mock(new Queue())
      .shouldReceive('enqueue')
      .once()
      .with(card)

    const learningStrategy = new LearningStrategy({hpq, done})
    learningStrategy.submitCard(card.id, true)
  })

  it('can refill the HPQ when the HPQ is half empty', () => {
    const hpqCard = CardBuilder
      .create()
      .atLearnedThreshold()
      .build()

    const lpqCard = CardBuilder.create().build()
    const backlogCard = CardBuilder.create().build()

    const hpq = mock(new Queue([hpqCard]))
      .shouldReceive('remove')
      .once()
      .andReturn(hpqCard)
      .shouldReceive('getLength')
      .once()
      .andReturn(0)
      .shouldReceive('enqueue')
      .twice()

    const lpq = mock(new Queue([lpqCard]))
      .shouldReceive('dequeue')
      .once()
      .andReturn(lpqCard)

    const backlog = mock(new Queue([backlogCard]))
      .shouldReceive('dequeue')
      .once()
      .andReturn(backlogCard)

    const learningStrategy = new LearningStrategy({
      hpq,
      hpqCapacity: 2,
      lpq,
      backlog
    })

    learningStrategy.submitCard(hpqCard.id, true)
  })
})

class Card {
  constructor (args) {
    args = args || {}
    const {data, id, correctCount} = args
    this.data = data
    this.id = id
    this.correctCount = correctCount
  }

  equals (card) {
    return this.id === card.id
  }
}

class CardBuilder {
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

  atLearnedThreshold () {
    return this.withCorrectCount(LearningStrategy.LEARNED_THRESHOLD)
  }

  build () {
    return new Card ({
      data: this.data,
      id: this.id,
      correctCount: this.correctCount
    })
  }
}
