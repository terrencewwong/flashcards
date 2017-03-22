/* @flow */
const PouchQueue = require('../pouch-queue')
const AsyncDeckLoader = require('../async-deck-loader')
const DefaultCardRenderer = require('../dumb-card-renderer')
const shuffle = require('knuth-shuffle').knuthShuffle

const DEFAULT_LEARNED_THRESHOLD: number = 30
const DEFAULT_HPQ_CAPACITY: number = 8
const DEFAULT_LPQ_CAPACITY: number = 24

type ScoredCard = {
  card: Card,
  correctCount: number
}

class LearningStrategy {
  hpq: PouchQueue<ScoredCard>;
  hpqCapacity: number;
  lpq: PouchQueue<ScoredCard>;
  done: PouchQueue<ScoredCard>;
  backlog: PouchQueue<ScoredCard>;
  learnedThreshold: number;
  CardRenderer: any;

  constructor (args: {
    hpq: PouchQueue<ScoredCard>,
    hpqCapacity?: number,
    lpq: PouchQueue<ScoredCard>,
    done: PouchQueue<ScoredCard>,
    backlog: PouchQueue<ScoredCard>,
    learnedThreshold?: number,
    CardRenderer?: any
  }) {
    args = args || {}
    const {hpq, hpqCapacity, lpq, done, backlog, learnedThreshold, CardRenderer} = args
    this.hpq = hpq
    this.hpqCapacity = hpqCapacity || DEFAULT_HPQ_CAPACITY
    this.lpq = lpq
    this.done = done
    this.backlog = backlog
    this.learnedThreshold = learnedThreshold || DEFAULT_LEARNED_THRESHOLD
    this.CardRenderer = CardRenderer || DefaultCardRenderer
  }

  static async fromDeckName (
    deckName: string,
    options: {
      Queue?: typeof PouchQueue,
      deckLoader?: DeckLoader,
      hpqCapacity?: number,
      lpqCapacity?: number,
      shuffleCards?: boolean
    } = {}
  ): Promise<LearningStrategy> {
    const Queue = options.Queue || PouchQueue
    const deckLoader = options.deckLoader || new AsyncDeckLoader(deckName)
    const hpqCapacity = options.hpqCapacity || DEFAULT_HPQ_CAPACITY
    const lpqCapacity = options.lpqCapacity || DEFAULT_LPQ_CAPACITY
    const CardRenderer = deckLoader.getCardRenderer() || DefaultCardRenderer
    const shuffleCards = typeof options.shuffleCards === 'undefined'
      ? true
      : options.shuffleCards

    let hpqContents = []
    let lpqContents = []
    let backlogContents = []
    let doneContents = []

    const isLoaded = await deckLoader.isLoaded()
    if (!isLoaded) {
      const deck = deckLoader.load()
      if (shuffleCards) {
        shuffle(deck)
      }
      const scoredCards = deck.map((data, index) => {
        return {
          card: {
            id: index,
            data
          },
          correctCount: 0
        }
      })

      hpqContents = scoredCards.slice(0, hpqCapacity)
      lpqContents = scoredCards.slice(hpqCapacity, hpqCapacity + lpqCapacity)
      backlogContents = scoredCards.slice(hpqCapacity + lpqCapacity)

      await deckLoader.setLoaded(true)
    }

    const hpq = await Queue.initialize(hpqContents, {
      dbName: deckName,
      queueName: 'hpq'
    })

    const lpq = await Queue.initialize(lpqContents, {
      dbName: deckName,
      queueName: 'lpq'
    })

    const backlog = await Queue.initialize(backlogContents, {
      dbName: deckName,
      queueName: 'backlog'
    })

    const done = await Queue.initialize(doneContents, {
      dbName: deckName,
      queueName: 'done'
    })

    return new this({
      hpq,
      hpqCapacity,
      lpq,
      backlog,
      done,
      learnedThreshold: DEFAULT_LEARNED_THRESHOLD,
      CardRenderer
    })
  }

  async getNextCard (): Promise<?Card> {
    const scoredCard = await this.hpq.peek()
    if (scoredCard) {
      return this.CardRenderer.render(scoredCard.card)
    }
  }

  async submitCard (id: CardId, correct: boolean) {
    const removed = await this.hpq.remove(({card}) => card.id === id)
    if (!removed.length) {
      throw new Error(`Card with id ${id} does not exist!`)
    }

    const {card, correctCount} = removed[0]
    const increment = correct ? 1 : -1
    const updatedScoredCard: ScoredCard = {
      card,
      correctCount: correctCount + increment
    }

    if (this._cardIsLearned(updatedScoredCard)) {
      await this.done.enqueue(updatedScoredCard)
      const nextScoredCard = await this.backlog.dequeue()
      nextScoredCard && await this.hpq.enqueue(nextScoredCard)
    } else if (correct) {
      await this.lpq.enqueue(updatedScoredCard)
      const nextScoredCard = await this.lpq.dequeue()
      nextScoredCard && await this.hpq.enqueue(nextScoredCard)
    } else {
      await this.hpq.enqueue(updatedScoredCard)
    }
  }

  _cardIsLearned (scoredCard: ScoredCard) {
    return scoredCard.correctCount >= this.learnedThreshold
  }
}

module.exports = LearningStrategy
