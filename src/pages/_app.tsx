import I18nContextProvider from '@Noble/context/I18nContext'
import StyleContextProvider from '@Noble/context/StylesContext'
import '@Noble/styles/globals.css'
import '@Noble/styles/animations.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <I18nContextProvider>
      <StyleContextProvider>
        <Component {...pageProps} />
      </StyleContextProvider>
    </I18nContextProvider>
  )
}
