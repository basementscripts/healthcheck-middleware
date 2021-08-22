const { Healthcheck } = require('../lib')

const instanceConfig = {
	pid: 'test',
	region: 'test',
	appName: 'test'
}

const testObj = {
	server: 'test',
	region: 'test',
	appName: 'test'
}

describe('Healthcheck', () => {
	beforeAll(() => {
		return Healthcheck.getInstance(instanceConfig)
	})

	afterAll(() => {
		return Healthcheck.destroy()
	})

	test('it creates an instance', () => {
		const healthcheck = Healthcheck.getInstance(instanceConfig)
		expect(healthcheck.status.server).toEqual(testObj.server)
	})

	test('it can ping', () => {
		const healthcheck = Healthcheck.getInstance(instanceConfig)
		expect(healthcheck.ping).toEqual('Ok')
	})

	test('it registers a status agent', () => {
		const healthcheck = Healthcheck.getInstance()
		const agent = 'test'
		healthcheck.registerAgent({
			name: agent
		})

		const found = healthcheck.status.services.find((x) => x.name === agent)
		expect(found).toBeDefined()
	})

	test('it fails trying to register an existing agent', () => {
		const healthcheck = Healthcheck.getInstance()
		expect(() =>
			healthcheck.registerAgent({
				name: 'test'
			})
		).toThrow('AgentAlreadyRegistered')
	})

	test('it can get a registered status agent', () => {
		const healthcheck = Healthcheck.getInstance()
		const agentName = 'test'
		const agent = healthcheck.getRegisteredAgent(agentName)
		expect(agent).toBeDefined()
	})

	test('it deletes a registered agent', () => {
		const healthcheck = Healthcheck.getInstance()
		healthcheck.detachAgent('test')
		expect(healthcheck.status.services.length).toBe(0)
	})
})
