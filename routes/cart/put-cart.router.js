const express = require('express')

const authenticate = require('../../middleware/authenticate')
const Carts = require('../../models/cart')

const cartRouter = express.Router()
/**
 * @swagger
 * /cart/{id}:
 *   put:
 *     summary: Update a cart
 *     description: Replace the entire cart with new data.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the cart to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cart'
 *     responses:
 *       200:
 *         description: Cart updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 */
cartRouter.route('/:cartId').put(authenticate.verifyUser, (req, res, next) => {
	Carts.findById(req.params.cartId)
		.then(
			(cart) => {
				if (cart != null) {
					if (!cart.author.equals(req.user._id)) {
						var err = new Error('You are not authorized to update this cart!')
						err.status = 403
						return next(err)
					}
					req.body.author = req.user._id
					Carts.findByIdAndUpdate(
						req.params.cartId,
						{
							$set: req.body,
						},
						{ new: true }
					).then(
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
				} else {
					err = new Error('Cart ' + req.params.cartId + ' not found')
					err.status = 404
					return next(err)
				}
			},
			(err) => next(err)
		)
		.catch((err) => next(err))
})

module.exports = cartRouter
