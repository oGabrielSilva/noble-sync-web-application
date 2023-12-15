import { DESIGN_UI_KEY } from '@Noble/resources/constants'
import { dark } from '@Noble/resources/theme/dark'
import { Dispatch, createContext, useCallback, useEffect, useState } from 'react'

interface StyleContextValues {
  colors: Colors
  updateUITheme: (desing: Colors) => void
}

const themes = [dark]

const findThemeByName = (name: string) => {
  const t = themes.find(t => t.name === name)
  return !!t ? t : themes[0]
}

export const StyleContext = createContext<StyleContextValues>({} as StyleContextValues)

export default function StyleContextProvider({ children }: OnlyChildren) {
  const [colors, setColors] = useState<Colors>(themes[0])

  const updateUITheme = useCallback(
    (design: Colors) => {
      if (design.name !== colors.name) {
        setColors(design)
        localStorage.setItem(DESIGN_UI_KEY, design.name)
      }
    },
    [colors]
  )

  const values: StyleContextValues = { colors, updateUITheme }

  useEffect(() => {
    const keys = Object.keys(colors)
    const styles = getComputedStyle(document.body)
    const values = Object.values(colors)
    if (styles.getPropertyValue('--' + keys[0]) !== values[0]) {
      keys.forEach((property, i) => styles.setProperty('--' + property, values[i]))
    }
  }, [colors])

  useEffect(() => {
    const designName = localStorage.getItem(DESIGN_UI_KEY)
    if (!designName) localStorage.setItem(DESIGN_UI_KEY, colors.name)
    else setColors(findThemeByName(designName))
  }, []) //eslint-disable-line

  return <StyleContext.Provider value={values}>{children}</StyleContext.Provider>
}
