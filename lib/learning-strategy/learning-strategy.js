/* @flow */
const ArrayQueue = require('../array-queue')

const DEFAULT_LEARNED_THRESHOLD: number = 30
const DEFAULT_HPQ_CAPACITY: number = 8

type CardId = number
type Card = {
  id: CardId,
  correctCount: number
}

class LearningStrategy {
  hpq: Queue<Card>;
  hpqCapacity: number;
  lpq: Queue<Card>;
  done: Queue<Card>;
  backlog: Queue<Card>;
  learnedThreshold: number;

  constructor (args: {
    hpq?: Queue<Card>,
    hpqCapacity?: number,
    lpq?: Queue<Card>,
    done?: Queue<Card>,
    backlog?: Queue<Card>,
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

  getNextCard () {
    const card = this.hpq.peek()
    if (!card) {
      throw new Error('No card to get.')
    }

    return card
  }

  submitCard (cardId: CardId, correct: boolean) {
    const card = this.hpq.remove(card => card.id === cardId)
    const increment = correct ? 1 : -1
    card.correctCount = card.correctCount + increment

    if (this._cardIsLearned(card)) {
      this.done.enqueue(card)
    } else if (correct) {
      this.lpq.enqueue(card)
    } else {
      this.hpq.enqueue(card)
    }

    this._refillHPQ()
  }

  _cardIsLearned (card: any) {
    return card.correctCount >= this.learnedThreshold
  }

  _refillHPQ () {
    const capacity = this.hpqCapacity
    const emptySpots = capacity - this.hpq.getLength()
    if (emptySpots < capacity / 2) {
      return
    }

    // Fill by alternating between backlog and lpq
    const queues = [this.backlog, this.lpq]
    for (let i = 0; i < emptySpots; i++) {
      const card = queues[i % 2].dequeue() || this.backlog.dequeue()
      card && this.hpq.enqueue(card)
    }
  }
}

module.exports = LearningStrategy
