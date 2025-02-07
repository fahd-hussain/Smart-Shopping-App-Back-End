const express = require('express')

const authenticate = require('../../middleware/authenticate')
const Carts = require('../../models/cart')

const cartRouter = express.Router()
/**
 * @swagger
 * /cart/{id}:
 *   get:
 *     summary: Retrieve a cart by ID
 *     description: Fetch a specific cart from the database using its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the cart to retrieve
 *     responses:
 *       200:
 *         description: Cart retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       404:
 *         description: Cart not found.
 */
cartRouter.route('/:cartId').get(authenticate.verifyUser, (req, res, next) => {
	Carts.findById(req.params.cartId)
		.populate('author')
		.populate('product')
		.then(
			(cart) => {
				res.statusCode = 200
				res.setHeader('Content-Type', 'application/json')
				res.json(cart)
			},
			(err) => next(err)
		)
		.catch((err) => next(err))
})

module.exports = cartRouter
