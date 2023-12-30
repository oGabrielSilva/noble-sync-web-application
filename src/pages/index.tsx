import { useContext } from 'react'
import Head from 'next/head'
import { I18nContext } from '@Noble/context/I18nContext'
import AuthContextProvider from '@Noble/context/AuthContext'
import { Home } from '@Noble/components/Home/Home'
import HomeContextProvider from '@Noble/context/HomeContext'

export default function Index() {
  const { strings } = useContext(I18nContext)

  return (
    <>
      <Head>
        <title>{strings.appName}</title>
      </Head>
      <AuthContextProvider>
        <HomeContextProvider>
          <Home />
        </HomeContextProvider>
      </AuthContextProvider>
    </>
  )
}
