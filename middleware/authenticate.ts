import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken' // used to create, sign, and verify tokens
import { Types } from 'mongoose'
import { StrategyOptions } from 'passport-jwt'
import User from '../models/user'
import { UserInterface } from '../types/User.type'
require('dotenv').config()

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

export const local = passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
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
	new JwtStrategy(
		opts,
		// eslint-disable-next-line no-unused-vars
		(_id: string, done: (error: unknown, user?: UserInterface) => void) =>
			User.findOne({ _id }, (err: unknown, user: UserInterface) => {
				if (err) {
					return done(err)
				} else if (user) {
					return done(null, user)
				} else {
					return done(null)
				}
			})
	)
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
