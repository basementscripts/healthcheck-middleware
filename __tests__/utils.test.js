const { uuid, stripEmptyOrNull } = require('../lib/utils')

describe('Healthcheck Utils', () => {
	test('it renders a uuid', () => {
		expect(uuid()).toBeDefined()
	})

	test('it strips empty or null values', () => {
		const test = {
			true: 1,
			object: {},
			array: ['true']
		}
		const output = stripEmptyOrNull(test)

		expect(output.array).toEqual(['true'])
	})
})
