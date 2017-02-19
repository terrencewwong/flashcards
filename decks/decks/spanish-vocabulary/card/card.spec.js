const expect = require('expect')
const CardBuilder = require('./card.data')

describe('card', () => {
  it('it should render the english variant properly', () => {
		const card = CardBuilder.create().build()
		expect(card.render('english')).toEqual([card.renderEnglish(), card.renderSpanish()])
	})

	it('it can render a random variant', () => {
		const card = CardBuilder.create().build()
		const possibleRenders = card.getVariants().map(variant => card.render(variant))
		expect(possibleRenders).toInclude(card.renderRandomVariant())
	})
})
