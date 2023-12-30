import { I18nContext } from '@Noble/context/I18nContext'
import styles from '@Noble/styles/modules/popup.complete.profile.module.css'
import { useContext } from 'react'
import { EditProfile } from './EditProfile'
import { AuthContext } from '@Noble/context/AuthContext'

export const PopupCompleteProfile = () => {
  const { strings } = useContext(I18nContext)
  const { showCompleteProfile, setShowCompleteProfile } = useContext(AuthContext)

  return (
    <div style={showCompleteProfile ? {} : { display: 'none' }} className={styles.bg}>
      <div className={styles.main}>
        <h1>{strings.oopss}</h1>
        <p style={{ marginBottom: '1rem' }}>{strings.completeProfile}</p>
        <EditProfile onSave={() => setShowCompleteProfile(false)} insideContainer />
      </div>
    </div>
  )
}
