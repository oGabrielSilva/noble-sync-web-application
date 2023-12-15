import { I18nContext } from '@Noble/context/I18nContext'
import { PopupModel } from '@Noble/models/PopupProps'
import styles from '@Noble/styles/modules/popup.module.css'
import { useContext } from 'react'

interface PopupProps {
  payload: PopupModel
}

export const Popup = ({ payload }: PopupProps) => {
  const { strings } = useContext(I18nContext)

  return payload.isVisible ? (
    <div className={styles.background}>
      <div className={styles.popupBody}>
        <p className={styles.text}>{payload.title}</p>
        <button type="button" onClick={payload.onConfirm}>
          {strings.ok}
        </button>
      </div>
    </div>
  ) : (
    <></>
  )
}
