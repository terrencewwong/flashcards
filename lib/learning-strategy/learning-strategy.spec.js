const expect = require('expect')
const {it, mock} = require('mocha-mock')
const LearningStrategy = require('./')

// hacked mock queue object lol
const MockQueue = {
  peek: () => {},
  enqueue: () => {},
  dequeue: () => {},
  remove: () => {},
  getLength: () => {}
}

describe('learning-strategy', () => {
  describe('unit', () => {
    it('can get the next card', async () => {
      const scoredCard = ScoredCardBuilder.create().build()
      const hpq = mock(MockQueue)
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

      const hpq = mock(MockQueue)
        .shouldReceive('remove')
        .once()
        .andReturn([scoredCard])
      const lpq = mock(MockQueue)
        .shouldReceive('enqueue')
        .once()
        .with(updatedScoredCard)
      const learningStrategy = new LearningStrategy({hpq, lpq})
      await learningStrategy.submitCard(scoredCard.card.id, true)
    })

    it('can move the card from the HPQ to the back of the HPQ', async () => {
      const scoredCard = ScoredCardBuilder.create().build()
      const updatedScoredCard = {
        card: scoredCard.card,
        correctCount: scoredCard.correctCount - 1
      }

      const hpq = mock(MockQueue)
        .shouldReceive('remove')
        .once()
        .andReturn([scoredCard])
        .shouldReceive('enqueue')
        .once()
        .with(updatedScoredCard)

      const learningStrategy = new LearningStrategy({hpq})
      await learningStrategy.submitCard(scoredCard.card.id, false)
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

      const hpq = mock(MockQueue)
        .shouldReceive('remove')
        .once()
        .andReturn([scoredCard])
      const done = mock(MockQueue)
        .shouldReceive('enqueue')
        .once()
        .with(updatedScoredCard)

      const learningStrategy = new LearningStrategy({hpq, done, learnedThreshold})
      await learningStrategy.submitCard(scoredCard.card.id, true)
    })

    it('can refill the HPQ when the HPQ is half empty', async () => {
      const learnedThreshold = 1
      const hpqScoredCard = ScoredCardBuilder
        .create()
        .withCorrectCount(learnedThreshold)
        .build()

      const lpqScoredCard = ScoredCardBuilder.create().build()
      const backlogScoredCard = ScoredCardBuilder.create().build()

      const hpq = mock(MockQueue)
        .shouldReceive('remove')
        .once()
        .andReturn([hpqScoredCard])
        .shouldReceive('getLength')
        .once()
        .andReturn(0)
        .shouldReceive('enqueue')
        .twice()

      const lpq = mock(MockQueue)
        .shouldReceive('dequeue')
        .once()
        .andReturn(lpqScoredCard)

      const backlog = mock(MockQueue)
        .shouldReceive('dequeue')
        .once()
        .andReturn(backlogScoredCard)

      const done = mock(MockQueue)
        .shouldReceive('enqueue')
        .once()

      const learningStrategy = new LearningStrategy({
        hpq,
        hpqCapacity: 2,
        lpq,
        backlog,
        done,
        learnedThreshold
      })

      await learningStrategy.submitCard(hpqScoredCard.card.id, true)
    })
  })

  describe('service', () => {
    it('can instantiate a learning-strategy from an already loaded deck', async () => {
      const deckName = 'spanish'

      const mockDeckLoader = mock({
        isLoaded: () => {}
      })
        .shouldReceive('isLoaded')
        .once()
        .andReturn(true)

      // hackedy mock because mocha-mock doesn't support mocking classes right meow
      const MockQueueClass = mock({initialize: () => {}})
        .shouldReceive('initialize')
        .with([], {
          dbName: deckName,
          queueName: 'hpq'
        })
        .shouldReceive('initialize')
        .with([], {
          dbName: deckName,
          queueName: 'lpq'
        })
        .shouldReceive('initialize')
        .with([], {
          dbName: deckName,
          queueName: 'backlog'
        })
        .shouldReceive('initialize')
        .with([], {
          dbName: deckName,
          queueName: 'done'
        })

      const learningStrategy = await LearningStrategy.fromDeckName(deckName, {
        Queue: MockQueueClass,
        deckLoader: mockDeckLoader
      })

      expect(learningStrategy).toBeTruthy()
    })

    it('can instantiate a learning-strategy from a not already loaded deck', async () => {
      const deckName = 'spanish'
      const deck = [
        'hpq card',
        'backlog card'
      ]
      const hpqContents = [{
        card: deck[0],
        correctCount: 0
      }]

      const backlogContents = [{
        card: deck[1],
        correctCount: 0
      }]

      const mockDeckLoader = mock({
        isLoaded: () => {},
        load: () => {},
        setLoaded: () => {}
      })
        .shouldReceive('isLoaded')
        .once()
        .andReturn(Promise.resolve(false))
        .shouldReceive('load')
        .once()
        .andReturn(deck)
        .shouldReceive('setLoaded')
        .once()
        .with(true)

      // hackedy mock because mocha-mock doesn't support mocking classes right meow :(
      const MockQueueClass = mock({initialize: () => {}})
        .shouldReceive('initialize')
        .with(hpqContents, {
          dbName: deckName,
          queueName: 'hpq'
        })
        .shouldReceive('initialize')
        .with([], {
          dbName: deckName,
          queueName: 'lpq'
        })
        .shouldReceive('initialize')
        .with(backlogContents, {
          dbName: deckName,
          queueName: 'backlog'
        })
        .shouldReceive('initialize')
        .with([], {
          dbName: deckName,
          queueName: 'done'
        })

      const learningStrategy = await LearningStrategy.fromDeckName(deckName, {
        Queue: MockQueueClass,
        deckLoader: mockDeckLoader,
        hpqCapacity: 1
      })

      expect(learningStrategy).toBeTruthy()
    })
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
