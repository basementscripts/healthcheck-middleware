const { registerStatusAgent, getRegisteredStatusAgent } = require('../dist')

describe('Healthcheck Fetch Status Agent', () => {
	test('it registers a status agent', () => {
		const agent = 'test'
		registerStatusAgent({
			name: agent
		})

		const found = getRegisteredStatusAgent(agent)
		expect(found).toBeDefined()
	})
})
