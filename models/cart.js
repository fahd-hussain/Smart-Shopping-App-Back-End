const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Currency = mongoose.Types.Currency

const cartSchema = new Schema(
	{
		cartItems: [
			{
				name: {
					type: String,
					required: true,
				},
				barcode: {
					type: String,
					required: true,
				},
				price: {
					type: Currency,
					required: true,
					min: 0,
				},
				quantity: {
					type: Number,
					default: 1,
				},
			},
		],
		totalPrice: {
			type: Currency,
			required: true,
			min: 0,
		},
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		paid: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
)

const Carts = mongoose.model('Cart', cartSchema)

module.exports = Carts
