import config from '@Noble/firebase/firebase.json'
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

export const startFirebase = () => {
  if (!document) return null
  const app = initializeApp(config)
  const auth = getAuth(app)
  return { auth, app }
}
