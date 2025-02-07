const express = require('express')

const authenticate = require('../../middleware/authenticate')
const Carts = require('../../models/cart')

const cartRouter = express.Router()
/**
 * @swagger
 * /cart/{id}:
 *   delete:
 *     summary: Delete a cart
 *     description: Remove a cart from the database by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the cart to delete.
 *     responses:
 *       200:
 *         description: Cart deleted successfully.
 */
cartRouter
	.route('/:cartId')
	.delete(authenticate.verifyUser, (req, res, next) => {
		Carts.findById(req.params.cartId)
			.then(
				(cart) => {
					if (cart != null) {
						if (!cart.author.equals(req.user._id)) {
							var err = new Error('You are not authorized to delete this cart!')
							err.status = 403
							return next(err)
						}
						Carts.findByIdAndRemove(req.params.cartId)
							.then(
								(resp) => {
									res.statusCode = 200
									res.setHeader('Content-Type', 'application/json')
									res.json(resp)
								},
								(err) => next(err)
							)
							.catch((err) => next(err))
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
