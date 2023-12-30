import config from '@Noble/firebase/firebase.json'
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

export const startFirebase = () => {
  if (!document) return null
  const app = initializeApp(config)
  const auth = getAuth(app)
  const firestore = getFirestore(app)
  const storage = getStorage(app)
  return { auth, app, firestore, storage }
}
