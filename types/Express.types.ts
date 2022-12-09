import { Request } from 'express'
import { UserInterface } from './User.type'

export type RequestWithUser = Request & { user: UserInterface }
