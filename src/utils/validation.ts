import { EMAIL_REGEX } from '@Noble/resources/constants'

export const emailIsValid = (email: string) => EMAIL_REGEX.test(email)
export const passwordIsValid = (password: string) => password.length >= 8
