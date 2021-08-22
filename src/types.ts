export enum AgentStatus {
	UP = 'Ok',
	DOWN = 'Down'
}

export interface HealthcheckOptions {
	pid?: string
	path?: string
	appName?: string
	region?: string
	authenticate?: any
}

export interface HealthcheckStatus extends HealthcheckOptions {
	upTime?: string
	downTime?: string
	services?: HealthcheckStatusAgent[]
}

export interface HealthcheckStatusAgentOptions {
	name: string
	data?: any
}

export type DateType = Date | string | number

export interface HealthcheckStatusAgent {
	id: string
	name: string
	startTime?: Date
	endTime?: Date
	timestamp?: Date
	status?: string
	upTime?: string
	downTime?: string
	data?: any
	error?: Error
}

export interface IStatusAgent {
	status: HealthcheckStatusAgent
	up: (data?: Record<string, unknown>) => void
	down: (error?: Error) => void
}

export type RegisteredAgent = Map<string, IStatusAgent>

export type MetaType = HealthcheckOptions | unknown
