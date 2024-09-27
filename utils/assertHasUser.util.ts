import { Request } from 'express'
import { RequestWithUser } from '../types/Express.types'

function assertHasUser(req: Request): asserts req is RequestWithUser {
	if (!('user' in req)) {
		throw new Error('Request object without user found unexpectedly')
	}
}

export default assertHasUser
