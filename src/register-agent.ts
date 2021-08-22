import { Healthcheck } from './healthcheck'
import { HealthcheckStatusAgentOptions, IStatusAgent } from './types'

export const registerStatusAgent = (options: HealthcheckStatusAgentOptions): IStatusAgent => {
	const instance = Healthcheck.getInstance()
	return instance.registerAgent(options)
}
