import { model, PassportLocalSchema, Schema } from 'mongoose'
import passportLocalMongoose from 'passport-local-mongoose'
import { UserInterface } from '../types/User.type'

const UserSchema: PassportLocalSchema = new Schema({
	firstName: {
		type: String,
		default: '',
	},
	lastName: {
		type: String,
		default: '',
	},
	gender: {
		type: String,
		default: '',
	},
	profilePicture: {
		type: String,
		default: '',
	},
	admin: {
		type: Boolean,
		default: false,
	},
})

UserSchema.plugin(passportLocalMongoose)

export default model<UserInterface>('User', UserSchema)
