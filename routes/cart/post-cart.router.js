const express = require('express')

const authenticate = require('../../middleware/authenticate')
const Carts = require('../../models/cart')

const cartRouter = express.Router()
/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Create a new cart
 *     description: Add a new cart with items, total price, and author.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cart'
 *     responses:
 *       201:
 *         description: Cart created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 */
cartRouter.route('/').post(authenticate.verifyUser, (req, res, next) => {
	if (req.body != null) {
		req.body.author = req.user._id
		Carts.create(req.body)
			.then(
				(cart) => {
					Carts.findById(cart._id)
						.populate('author')
						.populate('product')
						.then((cart) => {
							res.statusCode = 200
							res.setHeader('Content-Type', 'application/json')
							res.json(cart)
						})
				},
				(err) => next(err)
			)
			.catch((err) => next(err))
	} else {
		const err = new Error('Cart not found in request body')
		err.status = 404
		return next(err)
	}
})

module.exports = cartRouter
