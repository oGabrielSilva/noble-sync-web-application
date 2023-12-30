import { HomeContext } from '@Noble/context/HomeContext'
import styles from '@Noble/styles/modules/index.module.css'
import { useContext, useEffect } from 'react'

export interface FloatingViewConfig {
  view?: JSX.Element
  hidden: boolean
  path?: string
  clickOutToClose?: boolean
}

export const FloatingView = () => {
  const { floatingView, updateFloatingView } = useContext(HomeContext)

  useEffect(() => {
    const handlePopState = () => {
      updateFloatingView({ hidden: true })
    }

    window.addEventListener('popstate', handlePopState)

    return () => window.removeEventListener('popstate', handlePopState)
  }, [updateFloatingView])

  return (
    <div
      id="floatingView"
      onClick={e =>
        floatingView.clickOutToClose && (e.target as HTMLDivElement).id === 'floatingView'
          ? window.history.back()
          : void 0
      }
      style={{ top: floatingView.hidden ? '-100vh' : 0 }}
      className={styles.floatingView}
    >
      {!floatingView.hidden && floatingView.view}
    </div>
  )
}
