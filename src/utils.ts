import { v4 } from 'uuid'

export type AlphaNumeric = string | number

export const uuid = (...buf: AlphaNumeric[]): string => {
	const buffer = [...buf, Date.now()]
	return v4({ buffer } as any)
}

export const convertTimesince = (start: Date, end: Date = new Date()) => {
	return String(end.getTime() - start.getTime())
}

export const stripEmptyOrNull = (data: any) => {
	return Object.keys(data).reduce((output: any, attr: string) => {
		const value: any = data[attr]
		if (value) {
			if (Array.isArray(value) && value.length > 0) {
				output[attr] = value
			} else if (typeof value === 'object') {
				output[attr] = value instanceof Date ? value : stripEmptyOrNull(value)
			} else {
				output[attr] = value
			}
		}
		return output
	}, {})
}
