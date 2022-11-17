const mongoose = require('mongoose')
const Schema = mongoose.Schema

const listSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		listItems: [
			{
				itemName: {
					type: String,
					required: true,
				},
				quantity: {
					type: Number,
					default: 1,
				},
			},
		],
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
	},
	{
		timestamps: true,
	}
)

const Lists = mongoose.model('List', listSchema)

module.exports = Lists
