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
      const renderedCard = 'a rendered card'
      const hpq = mock(MockQueue)
        .shouldReceive('peek')
        .once()
        .andReturn(scoredCard)
      const CardRenderer = mock({render: () => {}})
        .shouldReceive('render')
        .once()
        .with(scoredCard.card)
        .andReturn(renderedCard)

      const learningStrategy = new LearningStrategy({hpq, CardRenderer})
      expect(await learningStrategy.getNextCard()).toBe(renderedCard)
    })

    it('can move the card from the HPQ to the back of the LPQ', async () => {
      const scoredCard = ScoredCardBuilder.create().build()
      const updatedScoredCard = {
        card: scoredCard.card,
        correctCount: scoredCard.correctCount + 1
      }
      const topScoredCardInLpq = ScoredCardBuilder.create().build()

      const hpq = mock(MockQueue)
        .shouldReceive('remove')
        .once()
        .andReturn([scoredCard])
        .shouldReceive('enqueue')
        .once()
        .with(topScoredCardInLpq)
      const lpq = mock(MockQueue)
        .shouldReceive('enqueue')
        .once()
        .with(updatedScoredCard)
        .shouldReceive('dequeue')
        .once()
        .andReturn(topScoredCardInLpq)

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
      const topScoredCardInBacklog = ScoredCardBuilder.create().build()

      const hpq = mock(MockQueue)
        .shouldReceive('remove')
        .once()
        .andReturn([scoredCard])
        .shouldReceive('enqueue')
        .once()
        .with(topScoredCardInBacklog)
      const done = mock(MockQueue)
        .shouldReceive('enqueue')
        .once()
        .with(updatedScoredCard)
      const backlog = mock(MockQueue)
        .shouldReceive('dequeue')
        .once()
        .andReturn(topScoredCardInBacklog)

      const learningStrategy = new LearningStrategy({hpq, done, backlog, learnedThreshold})
      await learningStrategy.submitCard(scoredCard.card.id, true)
    })
  })

  describe('service', () => {
    it('can instantiate a learning-strategy from an already loaded deck', async () => {
      const deckName = 'spanish'

      const mockDeckLoader = mock({
        isLoaded: () => {},
        getCardRenderer: () => {}
      })
        .shouldReceive('getCardRenderer')
        .once()
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
        'lpq card',
        'backlog card'
      ]
      const hpqContents = [{
        card: {
          id: 0,
          data: deck[0]
        },
        correctCount: 0
      }]

      const lpqContents = [{
        card: {
          id: 1,
          data: deck[1]
        },
        correctCount: 0
      }]

      const backlogContents = [{
        card: {
          id: 2,
          data: deck[2]
        },
        correctCount: 0
      }]

      const mockDeckLoader = mock({
        isLoaded: () => {},
        load: () => {},
        setLoaded: () => {},
        getCardRenderer: () => {}
      })
        .shouldReceive('getCardRenderer')
        .once()
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
        .with(lpqContents, {
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
        hpqCapacity: 1,
        lpqCapacity: 1,
        shuffleCards: false
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
