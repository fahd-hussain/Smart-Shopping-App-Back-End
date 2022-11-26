import { UserInterface } from '../types/User.type'

const isUser = (obj: UserInterface | unknown): obj is UserInterface => {
	return (obj as UserInterface)._id !== undefined
}

export default isUser
