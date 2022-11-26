import mongoose, { Model } from 'mongoose'
import { CartInterface } from '../types/Cart.types'
const Schema = mongoose.Schema
const Types = mongoose.Types

const cartSchema = new Schema<CartInterface, Model<CartInterface>>(
	{
		items: [
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
					type: Number,
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
			type: Number,
			required: true,
			min: 0,
		},
		author: {
			type: Types.ObjectId,
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

export default mongoose.model('Cart', cartSchema)
