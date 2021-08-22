import { StatusAgent } from './status-agent'
import {
	HealthcheckOptions,
	HealthcheckStatus,
	HealthcheckStatusAgentOptions,
	IStatusAgent,
	RegisteredAgent
} from './types'

export class Healthcheck {
	/**
	 * Healthcheck Instance
	 * the current healthcheck instance
	 * singleton
	 * @property {Healthcheck} instance
	 */
	private static instance: Healthcheck
	/**
	 * Registered Agents
	 * registerd service status agents for
	 * healthcheck reporting
	 * @property {RegisteredAgent} registeredAgents
	 */
	private registeredAgents: RegisteredAgent = new Map<string, StatusAgent>()
	/**
	 * Process ID
	 * the process ID of the server
	 * @property {string} pid
	 */
	private pid: string
	/**
	 * APP Name
	 * the application name
	 * @property {string} appName
	 */
	private appName: string
	/**
	 * Region
	 * the distribution region
	 * @property {string} region
	 */
	private region: string
	/**
	 * Healthcheck meta
	 * meta info to add to healhcheck
	 * output, merged with main object
	 * @property {any} meta
	 */
	private meta: any

	constructor({
		pid = 'NotConfigured',
		region = 'NotConfigured',
		appName = 'NotDefined',
		...rest
	}: HealthcheckOptions) {
		this.pid = pid
		this.region = region
		this.appName = appName
		this.meta = rest
	}

	get status(): HealthcheckStatus {
		return {
			appName: this.appName,
			timestamp: new Date(),
			server: this.pid,
			region: this.region,
			services: Array.from(this.registeredAgents).map(([, agent]: any) => agent.status),
			...this.meta
		}
	}

	get ping(): string {
		return 'Ok'
	}
	/**
	 * get a registered agent
	 * @param {string} name
	 * @returns {IStatusAgent}
	 */
	getRegisteredAgent(name: string): IStatusAgent {
		return this.registeredAgents.get(name)
	}
	/**
	 * register a status agent
	 * @param {HealthcheckStatusAgentOptions} options
	 * @returns {void}
	 * @throws {Error}
	 */
	registerAgent({ name, data }: HealthcheckStatusAgentOptions): IStatusAgent {
		// if existing agent, throw an
		// error prompting duplicate agent
		if (this.registeredAgents.has(name)) {
			throw new Error(`AgentAlreadyRegistered`)
		}
		// create a new status agent
		const agent = new StatusAgent({ name, data })
		// add the agent to the registered agents
		this.registeredAgents.set(name, agent)
		// finally return the newly created agent
		return agent
	}
	/**
	 * register multiple status agents
	 * @param {HealthcheckStatusAgentOptions[]} agents
	 * @returns {void}
	 * @throws {Error}
	 */
	registerAgents(agents: HealthcheckStatusAgentOptions[]): void | Error {
		agents.forEach((agent: HealthcheckStatusAgentOptions) => this.registerAgent(agent))
	}
	/**
	 * detach an status agent
	 * @param {string} name
	 * @returns {void}
	 * @throws {Error}
	 */
	detachAgent(name: string): void | Error {
		this.registeredAgents.delete(name)
	}
	/**
	 * returns the singleton instance
	 * @param {HealthcheckOptions} options
	 * @returns {Healthcheck}
	 */
	static getInstance(options: HealthcheckOptions = {}) {
		if (!Healthcheck.instance) {
			Healthcheck.instance = new Healthcheck(options)
		}
		return Healthcheck.instance
	}
	/**
	 * destroy healhcheck instance
	 */
	static destroy() {
		Healthcheck.instance = undefined
	}
}
