const { Healthcheck, registerStatusAgents } = require('../lib')

describe('Healthcheck Register Status Agents', () => {
	test('it can register multiple status agent', () => {
		const agents = [
			{
				name: 'test1'
			},
			{
				name: 'test2'
			}
		]
		registerStatusAgents(agents)

		expect(Healthcheck.getInstance().status.services.length).toBe(2)
	})
})
