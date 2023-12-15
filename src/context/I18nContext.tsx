import { LANG_UI_KEY } from '@Noble/resources/constants'
import { ptBR } from '@Noble/resources/i18n/pt-br'
import { createContext, useCallback, useEffect, useState } from 'react'

interface I18nContextValues {
  strings: I18N
  updateUILanguage: (lang: I18N) => void
}

export const I18nContext = createContext<I18nContextValues>({} as I18nContextValues)

const langs = [ptBR]

const findLangByKey = (key: string) => {
  const l = langs.find(lang => lang.properties.key === key)
  return !!l ? l : langs[0]
}

export default function I18nContextProvider({ children }: OnlyChildren) {
  const [strings, setStrings] = useState(langs[0])

  const updateUILanguage = useCallback(
    (lang: I18N) => {
      if (lang.properties.key !== strings.properties.key) {
        localStorage.setItem(LANG_UI_KEY, lang.properties.key)
        setStrings(lang)
      }
    },
    [strings]
  )

  const values: I18nContextValues = { strings, updateUILanguage }

  useEffect(() => {
    const lang = localStorage.getItem(LANG_UI_KEY)
    if (!lang) localStorage.setItem(LANG_UI_KEY, strings.properties.key)
    else setStrings(findLangByKey(lang))
  }, []) //eslint-disable-line

  return <I18nContext.Provider value={values}>{children}</I18nContext.Provider>
}
