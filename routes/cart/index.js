const express = require('express')
const bodyParser = require('body-parser')

const router = express.Router()
/**
 * @swagger
 * components:
 *   schemas:
 *     Cart:
 *       type: object
 *       required:
 *         - cartItems
 *         - totalPrice
 *       properties:
 *         id:
 *           type: string
 *           description: Unique ID of the product
 *         cartItems:
 *           type: array
 *           description: List of items in the cart
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the product
 *               barcode:
 *                 type: string
 *                 description: Barcode of the product
 *               price:
 *                 type: number
 *                 format: float
 *                 description: Price of the product
 *               quantity:
 *                 type: integer
 *                 description: Quantity of the product
 *         totalPrice:
 *           type: number
 *           format: float
 *           description: Total price of all items in the cart
 *         author:
 *           type: string
 *           description: The ID of the user who created the cart
 *         paid:
 *           type: boolean
 *           description: Whether the cart has been paid for
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the cart was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the cart was last updated
 *       example:
 *         id: "63f1b2c4e4b0f5a1c8e4d123"
 *         cartItems:
 *           - name: "Product 1"
 *             barcode: "123456789"
 *             price: 19.99
 *             quantity: 2
 *           - name: "Product 2"
 *             barcode: "987654321"
 *             price: 29.99
 *             quantity: 1
 *         totalPrice: 69.97
 *         author: "63f1b2c4e4b0f5a1c8e4d456"
 *         paid: false
 *         createdAt: "2025-02-07T10:00:00.000Z"
 *         updatedAt: "2025-02-07T12:00:00.000Z"
 */
router.use(bodyParser.json())

const deleteCartRouter = require('./delete-card.router')
const getCartByIdRouter = require('./get-cart-by-id')
const getCartsRouter = require('./get-carts.router')
const postCartRouter = require('./post-cart.router')
const putCartRouter = require('./put-cart.router')

router.use(deleteCartRouter)
router.use(getCartByIdRouter)
router.use(getCartsRouter)
router.use(postCartRouter)
router.use(putCartRouter)

module.exports = router
