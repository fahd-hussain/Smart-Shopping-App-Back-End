const mongoose = require('mongoose')
const Currency = mongoose.Types.Currency
const Schema = mongoose.Schema

const storeSchema = new Schema(
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
		shelf: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Shelf',
		},
	},
	{
		timestamps: true,
	}
)

const Stores = mongoose.model('Store', storeSchema)

module.exports = Stores
