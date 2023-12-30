import styles from '@Noble/styles/modules/synchronies.module.css'
import { ProfilePresentation } from './ProfilePresentation'
import { FormEventHandler, useContext, useRef, useState } from 'react'
import { I18nContext } from '@Noble/context/I18nContext'
import { imageToDataURL } from '@Noble/utils/image'
import Img from 'next/image'

export const NewSync = () => {
  const { strings } = useContext(I18nContext)

  const [message, setMessage] = useState('')
  const [image, setImage] = useState('')
  const [imageWH, setImageWH] = useState({ w: 0, h: 0 })

  const fileRef = useRef<HTMLInputElement>(null)

  const pickImage: FormEventHandler<HTMLInputElement> = e => {
    const file = (e.currentTarget.files && e.currentTarget.files[0]) || null
    if (!file) return
    const fr = new FileReader()

    fr.onload = () => {
      const img = new Image()
      img.onload = () => {
        const originalWidth = img.naturalWidth
        const originalHeight = img.naturalHeight
        const ratio = originalWidth / originalHeight

        let w: number, h: number

        if (originalWidth > originalHeight) {
          w = originalWidth > 620 ? 620 : originalWidth
          h = w / ratio
        } else {
          h = originalHeight > 620 ? 620 : originalHeight
          w = h * ratio
        }

        imageToDataURL(file, w, h, false)
          .then(dt => setImage(dt))
          .catch(console.log)
        setImageWH({ h, w })
      }

      img.src = fr.result as string
    }

    fr.readAsDataURL(file)
  }

  return (
    <div className={styles.nSync}>
      <ProfilePresentation />
      <div
        onClick={() => fileRef.current && fileRef.current.click()}
        className={styles.attachImage}
      >
        <input
          onInput={pickImage}
          ref={fileRef}
          accept=".png, .jpg, .jpeg, .JPEG, .JPG"
          type="file"
          style={{ display: 'none' }}
        />
        {(image && <Img width={imageWH.w} height={imageWH.h} src={image} alt="image" />) || (
          <span>{strings.attachImage}</span>
        )}
      </div>
      <div className={styles.txt}>
        <textarea
          className={200 - message.length >= 0 ? '' : 'danger'}
          value={message}
          onInput={e => setMessage(e.currentTarget.value)}
          placeholder={strings.syncPlaceholder}
        />
        <small className={200 - message.length >= 0 ? '' : 'danger'}>{200 - message.length}</small>
      </div>
    </div>
  )
}
