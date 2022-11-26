import { PassportLocalDocument, Types } from 'mongoose'

export interface UserInterface extends PassportLocalDocument {
	_id: Types.ObjectId
	firstName: string
	lastName: string
	gender: string
	profilePicture?: string
	admin?: boolean
}
