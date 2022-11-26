import express, { NextFunction, Request, Response } from 'express'
const router = express.Router()

import bodyParser from 'body-parser'
import User from '../models/user'

import { signup } from '../controller/user.controller'
import { verifyUser } from '../middleware/authenticate'

router.use(bodyParser.json())

/* GET users listing. */
/* Only for Admin */
router.get(
	'/',
	verifyUser,
	(_req: Request, res: Response, next: NextFunction) => {
		User.find({})
			.then((users) => {
				res.statusCode = 200
				res.setHeader('Content-Type', 'application/json')
				res.json(users)
			})
			.catch((err) => next(err))
	}
)

/* User panel */
router.post('/signup', async (req: Request, res: Response) => {
	try {
		const token = await signup(req.body)
		res.statusCode = 200
		res.json({ token })
	} catch (error) {
		console.error(error)
		res.statusCode = 500
		res.json(error)
	}
})

// router.post('/login', (req: Request, res: Response, next: NextFunction) => {
// 	passport.authenticate('local', (err, user, info) => {
// 		if (err) return next(err)

// 		if (!user) {
// 			res.statusCode = 401
// 			res.setHeader('Content-Type', 'application/json')
// 			res.json({
// 				success: false,
// 				status: 'Login Unsuccessful!',
// 				err: info,
// 			})
// 		}
// 		req.logIn(user, (err) => {
// 			if (err) {
// 				res.statusCode = 401
// 				res.setHeader('Content-Type', 'application/json')
// 				res.json({
// 					success: false,
// 					status: 'Login Unsuccessful!',
// 					err: 'Could not log in user!',
// 				})
// 			}

// 			const token = authenticate.getToken({ _id: req.user._id })
// 			res.statusCode = 200
// 			res.setHeader('Content-Type', 'application/json')
// 			res.json({
// 				success: true,
// 				status: 'Login Successful!',
// 				token: token,
// 			})
// 		})
// 	})(req, res, next)
// })

// router.get('/logout', (req, res) => {
// 	req.logout()
// 	res.statusCode = 200
// 	res.setHeader('Content-Type', 'application/json')
// 	res.json({ success: true, status: 'Logout Successful!', token: null })
// })

// router.get('/profile', (req, res, next) => {
// 	passport.authenticate('jwt', { session: false }, (err, user, info) => {
// 		if (err) return next(err)

// 		if (!user) {
// 			res.statusCode = 401
// 			res.setHeader('Content-Type', 'application/json')
// 			return res.json({
// 				status: 'JWT invalid!',
// 				success: false,
// 				err: info,
// 			})
// 		} else {
// 			res.statusCode = 200
// 			res.setHeader('Content-Type', 'application/json')
// 			return res.json({ status: 'JWT valid!', success: true, user: user })
// 		}
// 	})(req, res)
// })

export default router
