import { startFirebase } from '@Noble/firebase/app'
import { User } from '@Noble/models/User'
import { Auth } from 'firebase/auth'
import { Firestore, doc, getDoc } from 'firebase/firestore'
import { FirebaseStorage } from 'firebase/storage'
import { Dispatch, SetStateAction, createContext, useEffect, useState } from 'react'

interface AuthContextValues {
  auth?: Auth
  db?: Firestore
  storage?: FirebaseStorage
  showCompleteProfile: boolean
  user?: User
  setUser: Dispatch<SetStateAction<User | undefined>>
  setShowCompleteProfile: Dispatch<SetStateAction<boolean>>
}

export const AuthContext = createContext<AuthContextValues>({} as AuthContextValues)

export default function AuthContextProvider({ children }: OnlyChildren) {
  const [auth, setAuth] = useState<Auth>()
  const [db, setDB] = useState<Firestore>()
  const [storage, setStorage] = useState<FirebaseStorage>()
  const [user, setUser] = useState<User>()
  const [showCompleteProfile, setShowCompleteProfile] = useState(false)

  const values: AuthContextValues = {
    auth,
    db,
    storage,
    showCompleteProfile,
    user,
    setUser,
    setShowCompleteProfile,
  }

  useEffect(() => {
    if (!auth) {
      const a = startFirebase()
      setAuth(a?.auth)
      setDB(a?.firestore)
      setStorage(a?.storage)
      a?.auth?.onAuthStateChanged(u => {
        if (!u) {
          window.location.href = '/auth'
          return
        }
        getDoc(doc(a.firestore!, 'users', u.uid))
          .then(snap => {
            if (snap.exists()) {
              const data = snap.data() as User
              if (data && data.uid === u.uid) setUser(snap.data() as User)
            } else setShowCompleteProfile(true)
          })
          .catch(e => console.log(e))
      })
    }
  }, [auth, db])

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}
