import { EMAIL_REGEX } from '@Noble/resources/constants'

export const emailIsValid = (email: string) => EMAIL_REGEX.test(email)
export const passwordIsValid = (password: string) => password.length >= 8
export const nameIsValid = (name: string) => name.length >= 2
export const nicknameIsValid = nameIsValid
export const bioIsValid = (bio: string) => bio.length <= 200
