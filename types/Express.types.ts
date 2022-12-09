import { Request } from 'express'
import { UserInterface } from './User.type'

export type RequestWithUser = Request & { user: UserInterface }

export interface HealthCheckInterface {
	uptime: number
	message: unknown
	timestamp: number
}
