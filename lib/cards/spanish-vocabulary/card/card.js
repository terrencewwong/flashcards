const ENGLISH = 'english'
const SPANISH = 'spanish'

module.exports = class Card {
  constructor (cardDefinition) {
    this[ENGLISH] = cardDefinition[ENGLISH]
    this[SPANISH] = cardDefinition[SPANISH]
    this.clarification = cardDefinition.clarification
    this.partOfSpeech = cardDefinition.partOfSpeech
    this.example = cardDefinition.example

    this.variants = [ENGLISH, SPANISH]
  }

  getVariants () {
    return this.variants
  }

  getNumVariants () {
    return this.variants.length
  }

  render (variant) {
    const english = this.renderEnglish()
    const spanish = this.renderSpanish()

    switch (variant) {
      case ENGLISH:
        return {
          sideA: english,
          sideB: spanish  
        }
      case SPANISH:
        return {
          sideA: spanish,
          sideB: english
        }
      default:
        throw new Error('Invalid variant.')
    }
  }

  renderEnglish () {
    return `English - ${this.english}`
  }

  renderSpanish () {
    return `español - ${this.spanish}`
  }

  renderRandomVariant () {
    const index = Math.floor(Math.random() * this.getNumVariants())
    return this.render(this.getVariants()[index])
  }
}
