const Queue = require('../queue')

class LearningStrategy {
  constructor (args) {
    args = args || {}
    const {hpq, hpqCapacity, lpq, done, backlog} = args
    this.hpq = hpq || new Queue()
    this.hpqCapacity = hpqCapacity || LearningStrategy.DEFAULT_HPQ_CAPACITY
    this.lpq = lpq || new Queue()
    this.done = done || new Queue()
    this.backlog = backlog || new Queue()
  }

  getNextCard () {
    const card = this.hpq.peek()
    if (!card) {
      throw new Error('No card to get.')
    }

    return card
  }

  submitCard (cardId, correct) {
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

  _cardIsLearned(card) {
    return card.correctCount >= LearningStrategy.LEARNED_THRESHOLD
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

LearningStrategy.LEARNED_THRESHOLD = 30
LearningStrategy.DEFAULT_HPQ_CAPACITY = 8
module.exports = LearningStrategy
