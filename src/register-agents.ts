import { Healthcheck } from './healthcheck'
import { HealthcheckStatusAgentOptions } from './types'

export const registerStatusAgents = (agents: HealthcheckStatusAgentOptions[]): void | Error => {
	const instance = Healthcheck.getInstance()
	instance.registerAgents(agents)
}
