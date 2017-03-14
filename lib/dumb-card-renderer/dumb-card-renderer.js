/* @flow */
class DumbCardRenderer {
  static render (card: Card) {
    return {
      id: card.id,
      sideA: card.data,
      sideB: ''
    }
  }
}

module.exports = DumbCardRenderer
