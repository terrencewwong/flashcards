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
    return this[variant]
  }

  renderRandomVariant () {
    const index = Math.floor(Math.random() * this.getNumVariants())
    return this.render(this.getVariants()[index])
  }
}
