import styles from '@Noble/styles/modules/index.module.css'
import { PopupCompleteProfile } from '@Noble/components/Home/PopupCompleteProfile'
import { Synchronies } from './Synchronies'
import { FloatingView } from '../FloatingView'

export const Home = () => {
  return (
    <>
      <main className={styles.main}>
        <Synchronies />
        <div className={styles.fragments}></div>
      </main>
      <PopupCompleteProfile />
      <FloatingView />
    </>
  )
}
