import styles from '@Noble/styles/modules/synchronies.module.css'
import { TopActionBar } from './TopActionBar'
import { useContext } from 'react'
import { I18nContext } from '@Noble/context/I18nContext'
import { HomeContext } from '@Noble/context/HomeContext'
import { NewSync } from './NewSync'

export const Synchronies = () => {
  const { strings } = useContext(I18nContext)
  const { goToFloatingView } = useContext(HomeContext)

  return (
    <div className={styles.synchronies}>
      <TopActionBar />
      <div className={styles.synchroniesContainer}>
        <div
          onClick={() => goToFloatingView(<NewSync />, 'synchronies')}
          className={styles.zeroSynchronies}
        >
          <h2>{strings.oopss}</h2>
          <span>{strings.zeroSync}</span>
          <small className={styles.small}>{strings.searchNewSync}</small>
        </div>
      </div>
    </div>
  )
}
