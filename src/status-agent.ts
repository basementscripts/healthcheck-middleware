import { AgentStatus, HealthcheckStatusAgent, IStatusAgent } from './types'
import { convertTimesince, stripEmptyOrNull, uuid } from './utils'

export class StatusAgent implements IStatusAgent {
	/**
	 * Service Name
	 * the name of the service to
	 * report in the server healthcheck
	 * @property {string} name
	 */
	private name: string
	/**
	 * Identifier
	 * a unique generated identifier
	 * for the heathcheck agent
	 * @property {string} id
	 */
	private id: string
	/**
	 * Current Status
	 * the current status of the service
	 * reporting to the server healthcheck
	 * @property {AgentStatus} currentStatus
	 */
	private currentStatus: AgentStatus = AgentStatus.DOWN
	/**
	 * Start Time
	 * the time the reporting service is
	 * up and running
	 * @property {Date} startTime
	 */
	private startTime: Date
	/**
	 * End Time
	 * the time the reporting service is
	 * down and not running
	 * @property {Date} endTime
	 */
	private endTime: Date
	private data: Record<string, unknown> = {}
	private error: Error

	constructor({ name, data }: Partial<HealthcheckStatusAgent>) {
		this.name = name
		this.data = data
		this.id = uuid(name)
	}
	/**
	 * Service Up Time
	 * @property {string} upTime
	 */
	get upTime() {
		if (this.startTime) {
			return convertTimesince(this.startTime)
		}
		return ''
	}
	/**
	 * Service Down time
	 * @property {string} downTime
	 */
	get downTime() {
		if (this.endTime) {
			return convertTimesince(this.endTime)
		}
		return ''
	}
	/**
	 * Healthcheck Agent Status
	 * @property {HealthcheckStatusAgent} status
	 */
	get status(): HealthcheckStatusAgent {
		return stripEmptyOrNull({
			id: this.id,
			name: this.name,
			timestamp: new Date(),
			startTime: this.startTime,
			endTime: this.endTime,
			upTime: this.upTime,
			downTime: this.downTime,
			status: this.currentStatus,
			error: this.error,
			data: this.data
		})
	}
	/**
	 * Up
	 * @param {Record<string, unknown>} data
	 */
	public up(data?: Record<string, unknown>): void {
		this.startTime = new Date()
		this.currentStatus = AgentStatus.UP
		if (data) {
			this.data = { ...this.data, ...data }
		}
	}
	/**
	 * Down
	 * @param {Error} error
	 */
	public down(error?: Error): void {
		this.endTime = new Date()
		this.currentStatus = AgentStatus.DOWN
		if (error) {
			this.error = error
		}
	}
}
