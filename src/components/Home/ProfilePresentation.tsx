import { useContext } from 'react'
import { Avatar } from '../Avatar'
import { AuthContext } from '@Noble/context/AuthContext'
import styles from '@Noble/styles/modules/synchronies.module.css'

export const ProfilePresentation = () => {
  const { auth, user } = useContext(AuthContext)

  return (
    <div className={styles.profilePresentation}>
      <Avatar border={false} size={52} src={auth?.currentUser?.photoURL || ''} />
      <div>
        <h3 className={styles.t}>
          <span className={`title ${styles.span}`}>{user?.nickname}</span>{' '}
          <i
            style={{
              color:
                user?.gender === 'M'
                  ? 'var(--male)'
                  : user?.gender === 'F'
                  ? 'var(--female)'
                  : 'var(--text)',
            }}
            className={`bi ${
              user?.gender === 'M'
                ? 'bi-gender-male'
                : user?.gender === 'F'
                ? 'bi-gender-female'
                : 'bi-gender-neuter'
            }`}
          />
        </h3>
        <span className={styles.span}>{auth?.currentUser?.email}</span>
      </div>
    </div>
  )
}
