/* @flow */
const PouchQueue = require('../pouch-queue')
const AsyncDeckLoader = require('../async-deck-loader')

const DEFAULT_LEARNED_THRESHOLD: number = 30
const DEFAULT_HPQ_CAPACITY: number = 8

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

  constructor (args: {
    hpq: PouchQueue<ScoredCard>,
    hpqCapacity?: number,
    lpq: PouchQueue<ScoredCard>,
    done: PouchQueue<ScoredCard>,
    backlog: PouchQueue<ScoredCard>,
    learnedThreshold?: number
  }) {
    args = args || {}
    const {hpq, hpqCapacity, lpq, done, backlog, learnedThreshold} = args
    this.hpq = hpq
    this.hpqCapacity = hpqCapacity || DEFAULT_HPQ_CAPACITY
    this.lpq = lpq
    this.done = done
    this.backlog = backlog
    this.learnedThreshold = learnedThreshold || DEFAULT_LEARNED_THRESHOLD
  }

  static async fromDeckName (
    deckName: string,
    options: {
      Queue?: typeof PouchQueue,
      deckLoader?: DeckLoader,
      hpqCapacity?: number
    }
  ): Promise<LearningStrategy> {
    const Queue = options.Queue || PouchQueue
    const deckLoader = options.deckLoader || new AsyncDeckLoader(deckName)
    const hpqCapacity = options.hpqCapacity || DEFAULT_HPQ_CAPACITY

    let hpqContents = []
    let lpqContents = []
    let backlogContents = []
    let doneContents = []

    const isLoaded = await deckLoader.isLoaded()
    if (!isLoaded) {
      const deck = deckLoader.load()
      const scoredCards = deck.map(card => {
        return {
          card,
          correctCount: 0
        }
      })

      hpqContents = scoredCards.slice(0, hpqCapacity)
      backlogContents = scoredCards.slice(hpqCapacity)

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
      learnedThreshold: DEFAULT_LEARNED_THRESHOLD
    })
  }

  async getNextCard (): Promise<?Card> {
    const scoredCard = await this.hpq.peek()
    return scoredCard && scoredCard.card
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
    } else if (correct) {
      await this.lpq.enqueue(updatedScoredCard)
    } else {
      await this.hpq.enqueue(updatedScoredCard)
    }

    await this._refillHPQ()
  }

  _cardIsLearned (scoredCard: ScoredCard) {
    return scoredCard.correctCount >= this.learnedThreshold
  }

  async _refillHPQ () {
    const capacity = this.hpqCapacity
    const emptySpots = capacity - await this.hpq.getLength()
    if (emptySpots < capacity / 2) {
      return
    }

    // Fill by alternating between backlog and lpq
    const queues = [this.backlog, this.lpq]
    for (let i = 0; i < emptySpots; i++) {
      const scoredCard = await queues[i % 2].dequeue() || await this.backlog.dequeue()
      await (scoredCard && this.hpq.enqueue(scoredCard))
    }
  }
}

module.exports = LearningStrategy
