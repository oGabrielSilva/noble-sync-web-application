import type { FloatingViewConfig } from '@Noble/components/FloatingView'
import { createContext, useCallback, useState } from 'react'

interface HomeContextValues {
  floatingView: FloatingViewConfig
  // eslint-disable-next-line no-unused-vars
  goToFloatingView: (view: JSX.Element, path: string, clickOutToClose?: boolean) => void
  // eslint-disable-next-line no-unused-vars
  updateFloatingView: (config: FloatingViewConfig) => void
}

export const HomeContext = createContext({} as HomeContextValues)

export default function HomeContextProvider({ children }: OnlyChildren) {
  const [floatingView, setFloatingView] = useState<FloatingViewConfig>({
    hidden: true,
    view: <></>,
    path: '',
  })

  const goToFloatingView = useCallback(
    (view: JSX.Element, path: string, clickOutToClose = false) => {
      setFloatingView({ hidden: false, view, path, clickOutToClose })
      window.history.pushState(null, '', `?view=${path}`)
    },
    []
  )

  const updateFloatingView = useCallback(({ hidden = true, clickOutToClose = false, path, view = <>

      </> }: FloatingViewConfig) => {
    setFloatingView({ hidden, view, path, clickOutToClose })
  }, [])

  const values: HomeContextValues = { floatingView, goToFloatingView, updateFloatingView }

  return <HomeContext.Provider value={values}>{children}</HomeContext.Provider>
}
