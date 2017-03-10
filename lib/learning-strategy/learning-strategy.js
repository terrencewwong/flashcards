/* @flow */
const ArrayQueue = require('../array-queue')

const DEFAULT_LEARNED_THRESHOLD: number = 30
const DEFAULT_HPQ_CAPACITY: number = 8

type ScoredCard = {
  card: Card,
  correctCount: number
}

class LearningStrategy {
  hpq: Queue<ScoredCard>;
  hpqCapacity: number;
  lpq: Queue<ScoredCard>;
  done: Queue<ScoredCard>;
  backlog: Queue<ScoredCard>;
  learnedThreshold: number;

  constructor (args: {
    hpq?: Queue<ScoredCard>,
    hpqCapacity?: number,
    lpq?: Queue<ScoredCard>,
    done?: Queue<ScoredCard>,
    backlog?: Queue<ScoredCard>,
    learnedThreshold?: number
  }) {
    args = args || {}
    const {hpq, hpqCapacity, lpq, done, backlog, learnedThreshold} = args
    this.hpq = hpq || new ArrayQueue()
    this.hpqCapacity = hpqCapacity || DEFAULT_HPQ_CAPACITY
    this.lpq = lpq || new ArrayQueue()
    this.done = done || new ArrayQueue()
    this.backlog = backlog || new ArrayQueue()
    this.learnedThreshold = learnedThreshold || DEFAULT_LEARNED_THRESHOLD
  }

  async getNextCard (): Promise<Card> {
    const scoredCard = await this.hpq.peek()
    if (!scoredCard) {
      throw new Error('No card to get.')
    }

    return scoredCard.card
  }

  async submitCard (id: CardId, correct: boolean) {
    const removed = this.hpq.remove(({card}) => card.id === id)
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
      this.done.enqueue(updatedScoredCard)
    } else if (correct) {
      this.lpq.enqueue(updatedScoredCard)
    } else {
      this.hpq.enqueue(updatedScoredCard)
    }

    this._refillHPQ()
  }

  _cardIsLearned (scoredCard: ScoredCard) {
    return scoredCard.correctCount >= this.learnedThreshold
  }

  async _refillHPQ () {
    const capacity = this.hpqCapacity
    const emptySpots = capacity - this.hpq.getLength()
    if (emptySpots < capacity / 2) {
      return
    }

    // Fill by alternating between backlog and lpq
    const queues = [this.backlog, this.lpq]
    for (let i = 0; i < emptySpots; i++) {
      const scoredCard = queues[i % 2].dequeue() || this.backlog.dequeue()
      scoredCard && this.hpq.enqueue(scoredCard)
    }
  }

  static find (deckName: string) {
  }
}

module.exports = LearningStrategy
