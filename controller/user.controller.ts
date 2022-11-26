import { getToken } from '../middleware/authenticate'
import User from '../models/user'
import { UserInterface } from '../types/User.type'

export const signup = async ({
	password,
	username,
	firstName,
	lastName,
	profilePicture,
	gender,
}: UserInterface & { username: string; password: string }) => {
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
