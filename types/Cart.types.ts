import { Types } from 'mongoose'

export interface CartItemInterface {
	name: string
	barcode: string
	price: number
	quantity: number
}

export interface CartInterface {
	_id: Types.ObjectId
	items: Types.Array<CartItemInterface>
	totalPrice: number
	author: Types.ObjectId
	paid: boolean
}
