import { Router } from 'express'
import { Healthcheck } from './healthcheck'
import { HealthcheckOptions } from './types'

const DEFAULT_PATH = '/health'

const intermediateAuthentication = async (header: any) => Promise.reject('Unauthorized')

export const handleResponse = (res: any, data: any) => res.status(200).send(JSON.stringify(data))

export const healthcheck = ({
	path = DEFAULT_PATH,
	authenticate = intermediateAuthentication,
	...options
}: HealthcheckOptions): Router => {
	const mgr = Healthcheck.getInstance(options)

	const router = Router()

	router.get(path, (req: any, res: any) => handleResponse(res, mgr.ping))
	router.post(path, async (req: any, res: any) => {
		try {
			await authenticate(req.headers)
			return handleResponse(res, mgr.status)
		} catch (e) {
			return res.status(403).send('Unauthorized')
		}
	})

	return router
}
