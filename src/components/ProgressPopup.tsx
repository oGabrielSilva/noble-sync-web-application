import { PPModel } from '@Noble/models/PPModel'
import styles from '@Noble/styles/modules/popup.module.css'

interface ProgressPopupProps {
  payload: PPModel
}

export const ProgressPopup = ({ payload }: ProgressPopupProps) => {
  return payload.isVisible ? (
    <div className={styles.background}>
      <div className={styles.body}>
        <p className={styles.text}>{payload.title}</p>
        <div className={`${styles.progress} progress`} />
      </div>
    </div>
  ) : (
    <></>
  )
}
