const request = require('supertest')
const { healthcheck, Healthcheck } = require('../lib')

describe('Healthcheck Middleware', () => {
	test('it connects the middlware', () => {
		healthcheck({
			pid: 'test',
			appName: 'test',
			region: 'test'
		})

		const { status } = Healthcheck.getInstance()

		expect(status.appName).toEqual('test')
	})

	test('it calls the middleware', async () => {
		const wares = healthcheck({
			pid: 'test',
			appName: 'test',
			region: 'test'
		})

		const res = await request(wares).get('/health').send({})

		expect(res.body).toEqual('Ok')

		const post = await (await request(wares).post('/health')).send({})

		expect(res.body).toBeDefined()
	})
})
