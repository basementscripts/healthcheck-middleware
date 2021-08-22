const { Healthcheck, registerStatusAgent } = require('../dist')

describe('Healthcheck Register Status Agent', () => {
	test('it registers a status agent', () => {
		const agent = 'test'
		registerStatusAgent({
			name: agent
		})

		const found = Healthcheck.getInstance().status.services.find((x) => x.name === agent)
		expect(found).toBeDefined()
	})
})
