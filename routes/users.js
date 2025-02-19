var express = require('express')
var router = express.Router()

const bodyParser = require('body-parser')
var User = require('../models/user')

var passport = require('passport')
var authenticate = require('../middleware/authenticate')

router.use(bodyParser.json())

/* GET users listing. */
/* Only for Admin */
router.get(
	'/',
	authenticate.verifyUser,
	authenticate.verifyAdmin,
	(_req, res, next) => {
		User.find({})
			.then(
				(users) => {
					res.statusCode = 200
					res.setHeader('Content-Type', 'application/json')
					res.json(users)
				},
				(err) => next(err)
			)
			.catch((err) => next(err))
	}
)
/* User panel */
router.post('/signup', (req, res) => {
	User.register(
		new User({ username: req.body.username }),
		req.body.password,
		(err, user) => {
			if (err) {
				res.statusCode = 500
				res.setHeader('Content-Type', 'application/json')
				res.json({ err: err })
			} else {
				if (req.body.firstname) user.firstname = req.body.firstname
				if (req.body.lastname) user.lastname = req.body.lastname
				if (req.body.gender) user.gender = req.body.gender
				user.save((err) => {
					if (err) {
						res.statusCode = 500
						res.setHeader('Content-Type', 'application/json')
						res.json({ err: err })
						return
					}
					passport.authenticate('local')(req, res, () => {
						const token = authenticate.getToken({
							_id: req.user._id,
						})
						res.statusCode = 200
						res.setHeader('Content-Type', 'application/json')
						res.json({
							success: true,
							status: 'Registration Successful!',
							token,
						})
					})
				})
			}
		}
	)
})

router.post('/login', (req, res, next) => {
	passport.authenticate('local', (err, user, info) => {
		if (err) return next(err)

		if (!user) {
			res.statusCode = 401
			res.setHeader('Content-Type', 'application/json')
			res.json({
				success: false,
				status: 'Login Unsuccessful!',
				err: info,
			})
		}
		req.logIn(user, (err) => {
			if (err) {
				res.statusCode = 401
				res.setHeader('Content-Type', 'application/json')
				res.json({
					success: false,
					status: 'Login Unsuccessful!',
					err: 'Could not log in user!',
				})
			}

			const token = authenticate.getToken({ _id: req.user._id })
			res.statusCode = 200
			res.setHeader('Content-Type', 'application/json')
			res.json({
				success: true,
				status: 'Login Successful!',
				token: token,
			})
		})
	})(req, res, next)
})

router.get('/logout', (req, res) => {
	req.logout()
	res.statusCode = 200
	res.setHeader('Content-Type', 'application/json')
	res.json({ success: true, status: 'Logout Successful!', token: null })
})

router.get('/profile', (req, res, next) => {
	passport.authenticate('jwt', { session: false }, (err, user, info) => {
		if (err) return next(err)

		if (!user) {
			res.statusCode = 401
			res.setHeader('Content-Type', 'application/json')
			return res.json({
				status: 'JWT invalid!',
				success: false,
				err: info,
			})
		} else {
			res.statusCode = 200
			res.setHeader('Content-Type', 'application/json')
			return res.json({ status: 'JWT valid!', success: true, user: user })
		}
	})(req, res)
})

module.exports = router
