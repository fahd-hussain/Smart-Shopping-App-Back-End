import passport from 'passport'
import { getToken } from '../middleware/authenticate'
import User from '../models/user'
import { CredentialInterface, UserInterface } from '../types/User.type'
import isUser from '../utils/isUser.util'

export const signup = async ({
	password,
	username,
	firstName,
	lastName,
	profilePicture,
	gender,
}: UserInterface & CredentialInterface) => {
	const user = await new Promise<UserInterface>((resolve, reject) => {
		User.register(
			new User({ username, firstName, lastName, profilePicture, gender }),
			password,
			(error, user) => {
				if (error) reject(error)
				resolve(user)
			}
		)
	})

	return getToken(user._id)
}

export const login = async (body: CredentialInterface) => {
	const user = await new Promise<UserInterface>((resolve, reject) => {
		passport.authenticate(
			'local',
			(error: unknown, user: UserInterface, info) => {
				console.log(typeof info)
				if (error) reject(error)
				if (info) resolve(info)
				resolve(user)
			}
		)({ body })
	})

	if (isUser(user)) {
		return { token: getToken(user._id) }
	}

	return user
}
