import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import passport from 'passport'
import passportJwt, { StrategyOptions } from 'passport-jwt'
import passportLocal from 'passport-local'
import { UserInterface } from '../types/User.type'

import { IncomingMessage } from 'http'
import { Types } from 'mongoose'
import User from '../models/user'

const LocalStrategy = passportLocal.Strategy
const JwtStrategy = passportJwt.Strategy
const ExtractJwt = passportJwt.ExtractJwt

export const local = passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser<unknown, IncomingMessage>((_req, user, done) => {
	done(undefined, user)
})
passport.deserializeUser(User.deserializeUser())

const secretOrKey = process.env.secretKey || 'Abc'

export const getToken = function (_id: Types.ObjectId) {
	return jwt.sign(_id.toJSON(), secretOrKey, {})
}

const opts: StrategyOptions = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey,
}

export const jwtPassport = passport.use(
	new JwtStrategy(opts, (jwt_payload, done) => {
		User.findOne(
			{ _id: jwt_payload._id },
			(err: unknown, user: UserInterface) => {
				if (err) {
					return done(err, false)
				} else if (user) {
					return done(null, user)
				} else {
					return done(null, false)
				}
			}
		)
	})
)

export const verifyUser = passport.authenticate('jwt', { session: false })

export const verifyAdmin = (
	req: Request & { user: UserInterface },
	_res: Response,
	next: NextFunction
) => {
	User.findOne({ _id: req.user._id })
		.then(
			(user: UserInterface | null) => {
				if (user === null) {
					const err = new Error(
						'You are not authorized to perform this operation!'
					)
					return next({ ...err, status: 403 })
				}

				if (!user.admin) {
					const err = new Error(
						'You are not authorized to perform this operation!'
					)
					return next({ ...err, status: 403 })
				}

				next()
			},
			(err: unknown) => next(err)
		)
		.catch((err: unknown) => next(err))
}
