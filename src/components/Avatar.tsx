import Image from 'next/image'
import styles from '@Noble/styles/modules/index.module.css'
import { useContext } from 'react'
import { I18nContext } from '@Noble/context/I18nContext'

interface AvatarProps {
  onClick?: () => void
  size: number
  src: string
  transform?: number
  border?: boolean
}

export const Avatar = ({
  size,
  onClick = () => {},
  src,
  transform = -5,
  border = true,
}: AvatarProps) => {
  const { strings } = useContext(I18nContext)

  return (
    <div
      onClick={onClick}
      style={{ width: size, height: size, ...(border ? {} : { border: 'none' }) }}
      className={styles.iconContainer}
    >
      {(src && <Image width={size - 2} height={size - 2} alt={strings.avatarAlt} src={src} />) || (
        <i
          style={{
            fontSize: size - 10 > 10 ? size - 10 : 10,
            transform: `translateY(${transform}px)`,
          }}
          className={'bi bi-person-fill'.concat(' ', styles.avatarIcon)}
        />
      )}
    </div>
  )
}
