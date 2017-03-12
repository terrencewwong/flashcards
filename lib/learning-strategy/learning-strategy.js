/* @flow */
const AsyncArrayQueue = require('../async-array-queue')

const DEFAULT_LEARNED_THRESHOLD: number = 30
const DEFAULT_HPQ_CAPACITY: number = 8

type ScoredCard = {
  card: Card,
  correctCount: number
}

class LearningStrategy {
  hpq: AsyncQueue<ScoredCard>;
  hpqCapacity: number;
  lpq: AsyncQueue<ScoredCard>;
  done: AsyncQueue<ScoredCard>;
  backlog: AsyncQueue<ScoredCard>;
  learnedThreshold: number;

  constructor (args: {
    hpq?: AsyncQueue<ScoredCard>,
    hpqCapacity?: number,
    lpq?: AsyncQueue<ScoredCard>,
    done?: AsyncQueue<ScoredCard>,
    backlog?: AsyncQueue<ScoredCard>,
    learnedThreshold?: number
  }) {
    args = args || {}
    const {hpq, hpqCapacity, lpq, done, backlog, learnedThreshold} = args
    this.hpq = hpq || new AsyncArrayQueue()
    this.hpqCapacity = hpqCapacity || DEFAULT_HPQ_CAPACITY
    this.lpq = lpq || new AsyncArrayQueue()
    this.done = done || new AsyncArrayQueue()
    this.backlog = backlog || new AsyncArrayQueue()
    this.learnedThreshold = learnedThreshold || DEFAULT_LEARNED_THRESHOLD
  }

  async getNextCard (): Promise<Card> {
    try {
      const {card} = await this.hpq.peek()
      return card
    } catch (e) {
      throw new Error('No card to get.')
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
