import bodyParser from 'body-parser'
import express, { NextFunction, Request, Response } from 'express'
import { login, signup } from '../controller/user.controller'
import { verifyAdmin, verifyUser } from '../middleware/authenticate'
import User from '../models/user'
import { UserInterface } from '../types/User.type'

const router = express.Router()

router.use(bodyParser.json())

/* GET users listing. */
/* Only for Admin */
router.get(
	'/',
	verifyUser,
	verifyAdmin,
	(_req: Request, res: Response, next: NextFunction) => {
		User.find({})
			.then((users: UserInterface[]) => {
				res.statusCode = 200
				res.setHeader('Content-Type', 'application/json')
				res.json(users)
			})
			.catch(next)
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

router.post('/login', async (req: Request, res: Response) => {
	try {
		const resp = await login(req.body)
		res.statusCode = 200
		res.json(resp)
	} catch (error) {
		console.error(error)
		res.statusCode = 500
		res.json(error)
	}
})

// router.get('/logout', (req, res) => {
// 	req.logout()
// 	res.statusCode = 200
// 	res.setHeader('Content-Type', 'application/json')
// 	res.json({ success: true, status: 'Logout Successful!', token: null })
// })

router.get('/profile', verifyUser, (req, res) => {
	const resp = req.user
	res.statusCode = 200
	res.json(resp)
})

export default router
