import express, { Response } from 'express'
import { HealthCheckInterface } from '../types/Express.types'
const router = express.Router()

/* HEALTH Check */
router.all('/', async (_req, res: Response) => {
	const healthCheck: HealthCheckInterface = {
		uptime: process.uptime(),
		message: 'I am up, and running',
		timestamp: Date.now(),
	}
	try {
		res.send(healthCheck)
	} catch (error) {
		healthCheck.message = error
		res.status(503).send()
	}
})

export default router
