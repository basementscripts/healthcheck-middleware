import { Healthcheck } from './healthcheck'
import { IStatusAgent } from './types'

export const getRegisteredStatusAgent = (name: string): IStatusAgent => {
	const instance = Healthcheck.getInstance()
	return instance.getRegisteredAgent(name)
}
