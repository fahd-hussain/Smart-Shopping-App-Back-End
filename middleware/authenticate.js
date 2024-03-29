var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var User = require('../models/user')
var JwtStrategy = require('passport-jwt').Strategy
var ExtractJwt = require('passport-jwt').ExtractJwt
var jwt = require('jsonwebtoken') // used to create, sign, and verify tokens

exports.local = passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

const secKey = process.env.secretKey

exports.getToken = function (user) {
	return jwt.sign(user, secKey, {})
}

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = secKey

exports.jwtPassport = passport.use(
	new JwtStrategy(opts, (jwt_payload, done) => {
		console.log('JWT payload: ', jwt_payload)
		User.findOne({ _id: jwt_payload._id }, (err, user) => {
			if (err) {
				return done(err, false)
			} else if (user) {
				return done(null, user)
			} else {
				return done(null, false)
			}
		})
	})
)

exports.verifyUser = passport.authenticate('jwt', { session: false })

exports.verifyAdmin = (req, res, next) => {
	User.findOne({ _id: req.user._id })
		.then(
			(user) => {
				console.log('User: ', req.user)
				if (user.admin) {
					next()
				} else {
					const err = new Error(
						'You are not authorized to perform this operation!'
					)
					err.status = 403
					return next(err)
				}
			},
			(err) => next(err)
		)
		.catch((err) => next(err))
}
