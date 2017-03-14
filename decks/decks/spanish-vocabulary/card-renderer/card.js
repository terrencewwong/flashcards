const ENGLISH = 'english'
const SPANISH = 'spanish'

class Card {
  static getVariants () {
    return this.variants
  }

  static getNumVariants () {
    return this.variants.length
  }

  static render (card) {
    return this.renderRandomVariant(card)
  }

  static renderVariant (card, variant) {
    const english = this.renderEnglish(card)
    const spanish = this.renderSpanish(card)

    switch (variant) {
      case ENGLISH:
        return {
          id: card.id,
          sideA: english,
          sideB: spanish
        }
      case SPANISH:
        return {
          id: card.id,
          sideA: spanish,
          sideB: english
        }
      default:
        throw new Error('Invalid variant.')
    }
  }

  static renderEnglish (card) {
    return `English - ${card.data.english}`
  }

  static renderSpanish (card) {
    return `español - ${card.data.spanish}`
  }

  static renderRandomVariant (card) {
    const index = Math.floor(Math.random() * this.getNumVariants())
    return this.renderVariant(card, this.getVariants()[index])
  }
}
Card.variants = [ENGLISH, SPANISH]

module.exports = Card
