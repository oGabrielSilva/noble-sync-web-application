import { useContext } from 'react'
import { Avatar } from '../Avatar'
import { AuthContext } from '@Noble/context/AuthContext'
import { I18nContext } from '@Noble/context/I18nContext'
import styles from '@Noble/styles/modules/synchronies.module.css'
import Link from 'next/link'
import { HomeContext } from '@Noble/context/HomeContext'
import { EditProfile } from './EditProfile'

const FloatingViewProfile = ({ back }: { back: string }) => (
  <div className={styles.floatingViewProfileContainer}>
    <button className={styles.floatingViewProfileBack} onClick={() => window.history.back()}>
      <i className="bi bi-chevron-left" />
      <span>{back}</span>
    </button>
    <EditProfile onSave={() => window.history.back()} />
  </div>
)

export const TopActionBar = () => {
  const { goToFloatingView } = useContext(HomeContext)
  const { strings } = useContext(I18nContext)
  const { auth, user } = useContext(AuthContext)

  return (
    <>
      <div className={styles.topBar}>
        <div>
          <Link href="/">
            <h1>{user?.nickname || strings.appName}</h1>
          </Link>
        </div>
        <button
          onClick={() =>
            goToFloatingView(<FloatingViewProfile back={strings.back} />, 'profile', true)
          }
        >
          <Avatar
            border={false}
            size={42}
            src={(auth && auth.currentUser && auth.currentUser.photoURL) || ''}
          />
        </button>
      </div>
      <div className={styles.requestsNav}>
        <h3>{strings.synchronies}</h3>
        <button>
          <strong>{strings.requests}</strong>
        </button>
      </div>
    </>
  )
}
