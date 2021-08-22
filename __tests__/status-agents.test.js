const { StatusAgent } = require('../lib')

const delay = (offset = 1) => {
	return new Promise((resolve) => {
		setTimeout(resolve, offset * 1000)
	})
}

describe('Status Agent', () => {
	test('it creates a new status agent', () => {
		const agent = new StatusAgent({ name: 'test' })
		expect(agent.status.name).toBe('test')
	})

	test('it displays total service up time', () => {
		const agent = new StatusAgent({ name: 'test' })
		agent.up()

		expect(agent.upTime).toBeDefined()
	})

	test('it adds data to up status', () => {
		const agent = new StatusAgent({ name: 'test' })
		const criteria = { success: 'yay it works' }
		agent.up(criteria)

		expect(agent.status.data).toEqual(criteria)
	})

	test('it displays total service down time', async () => {
		const agent = new StatusAgent({ name: 'test' })
		await delay(0.1)
		agent.down()

		expect(agent.downTime).toBeDefined()
	})

	test('it reports error to agent status', async () => {
		const agent = new StatusAgent({ name: 'test' })
		await delay(0.1)
		const error = 'boo it broke'
		agent.down(error)

		expect(agent.error).toBe(error)
	})
})
