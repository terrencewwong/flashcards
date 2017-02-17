const Card = require('./')

module.exports = class CardBuilder {
  constructor () {
    this.english = "hello"
    this.spanish = "hola"
    this.clarification = "a greeting"
    this.partOfSpeech = "interjection"
    this.example = "¡Hola! ¿Cómo estás?"
  }

  static create () {
    return new this()
  }

  withEnglish (english) {
    this.english = english
  }

  withSpanish (spanish) {
    this.spanish = spanish
  }

  withClarification (clarification) {
    this.clarification = clarification
  }

  withPartOfSpeech (partOfSpeech) {
    this.partOfSpeech = partOfSpeech
  }

  withExample (example) {
    this.example = example
  }

  build () {
		return new Card({
			english: this.english,
			spanish: this.spanish,
			clarification: this.clarification,
			partOfSpeech: this.partOfSpeech,
			example: this.example
		})
  }
}
