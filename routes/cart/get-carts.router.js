const express = require('express')

const authenticate = require('../../middleware/authenticate')
const Carts = require('../../models/cart')

const cartRouter = express.Router()
/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Retrieve all carts
 *     description: Fetch all carts from the database.
 *     responses:
 *       200:
 *         description: A list of carts.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cart'
 */
cartRouter.route('/').get(authenticate.verifyUser, (req, res, next) => {
	if (req.user != null)
		Carts.find({ author: req.user._id })
			.populate('author')
			.populate('cartItems.product')
			.then(
				(carts) => {
					res.statusCode = 200
					res.setHeader('Content-Type', 'application/json')
					res.json(carts)
				},
				(err) => next(err)
			)
			.catch((err) => next(err))
	else {
		const err = new Error('Unauthorized')
		err.status = 403
		return next(err)
	}
})

module.exports = cartRouter
