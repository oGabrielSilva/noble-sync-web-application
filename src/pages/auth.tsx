import { I18nContext } from '@Noble/context/I18nContext'
import { FormEventHandler, useCallback, useContext, useEffect, useRef, useState } from 'react'
import styles from '@Noble/styles/modules/auth.module.css'
import Link from 'next/link'
import Image from 'next/image'
import { emailIsValid, passwordIsValid } from '@Noble/utils/validation'
import { shake } from '@Noble/resources/anim/shake'
import { CSS_DANGER_CLASS } from '@Noble/resources/constants'
import {
  Auth,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithRedirect,
} from 'firebase/auth'
import { startFirebase } from '@Noble/firebase/app'
import { ProgressPopup } from '@Noble/components/ProgressPopup'
import { PPModel } from '@Noble/models/PPModel'
import { Popup } from '@Noble/components/Popup'
import { PopupModel } from '@Noble/models/PopupProps'
import Head from 'next/head'

export default function AuthScreen() {
  const { strings } = useContext(I18nContext)
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const togglePassword = useRef<HTMLButtonElement>(null)

  const [auth, setAuth] = useState<Auth>()
  const [progressPayload, setProgressPayload] = useState(new PPModel())
  const [popupPayload, setPopupPayload] = useState(new PopupModel())

  const formData = () => {
    const payload = { email: '', password: '', valid: true }
    if (!emailRef.current || !passwordRef.current) {
      payload.valid = false
      return payload
    }
    const email = emailRef.current.value
    const password = passwordRef.current.value
    if (!emailIsValid(email)) {
      shake(emailRef.current)
      payload.valid = false
      return payload
    }
    if (!passwordIsValid(password)) {
      shake(passwordRef.current)
      payload.valid = false
      return payload
    }
    payload.email = email
    payload.password = password
    return payload
  }

  const dispacthError = useCallback(
    (err: KeyStringValueString) => {
      switch (err.code.toString()) {
        case 'auth/email-already-in-use':
          setPopupPayload(
            new PopupModel(strings.emailAlreadyInUse, true, () =>
              setPopupPayload(new PopupModel('', false))
            )
          )
          break
        case 'auth/invalid-credential':
          setPopupPayload(
            new PopupModel(strings.invalidCredentials, true, () =>
              setPopupPayload(new PopupModel('', false))
            )
          )
          break
        default:
          setPopupPayload(
            new PopupModel(strings.genericError, true, () =>
              setPopupPayload(new PopupModel('', false))
            )
          )
          break
      }
    },
    [strings]
  )

  const signIn = useCallback<FormEventHandler<HTMLFormElement>>(
    e => {
      e.preventDefault()
      setProgressPayload(new PPModel(strings.await, true))
      const payload = formData()
      console.log({ payload })
      if (!payload.valid || !auth) return setProgressPayload(new PPModel('', false))
      const f = async () => {
        try {
          const credentials = await signInWithEmailAndPassword(
            auth,
            payload.email,
            payload.password
          )
          console.log({ credentials })
        } catch (error) {
          setProgressPayload(new PPModel('', false))
          const err = error as KeyStringValueString
          if (err && (err as KeyStringValueString).code !== null) dispacthError(err)
          console.log(err)
        }
      }
      f()
    },
    [auth, dispacthError, strings]
  )

  const signUp = useCallback(() => {
    const f = async () => {
      setProgressPayload(new PPModel(strings.await, true))
      const payload = formData()
      if (!payload.valid || !auth) return setProgressPayload(new PPModel('', false))
      try {
        const credentials = await createUserWithEmailAndPassword(
          auth,
          payload.email,
          payload.password
        )
        console.log(credentials)
      } catch (error) {
        setProgressPayload(new PPModel('', false))
        const err = error as KeyStringValueString
        if (err && (err as KeyStringValueString).code !== null) dispacthError(err)
        console.log(err)
      }
    }
    f()
  }, [auth, strings, dispacthError])

  const googleSignIn = useCallback(() => {
    if (auth) {
      const provider = new GoogleAuthProvider()
      signInWithRedirect(auth, provider)
    }
  }, [auth])

  useEffect(() => {
    if (emailRef.current && passwordRef.current) {
      const func = (input: 'email' | 'password') => {
        if (input === 'email') {
          emailRef.current?.classList.remove(CSS_DANGER_CLASS)
          const valid = emailIsValid(emailRef.current!.value)
          valid ? void 0 : emailRef.current?.classList.add(CSS_DANGER_CLASS)
        } else {
          passwordRef.current?.classList.remove(CSS_DANGER_CLASS)
          const valid = passwordIsValid(passwordRef.current!.value)
          valid ? void 0 : passwordRef.current?.classList.add(CSS_DANGER_CLASS)
        }
      }

      emailRef.current.oninput = () => func('email')
      passwordRef.current.oninput = () => func('password')
    }
  }, [])

  useEffect(() => {
    const func = () => {
      if (passwordRef.current) {
        const i = passwordRef.current.parentElement!.querySelector('i')!
        if (i.classList.contains('bi-eye-fill')) {
          i.classList.remove('bi-eye-fill')
          i.classList.add('bi-eye-slash-fill')
          passwordRef.current.type = 'text'
        } else {
          i.classList.add('bi-eye-fill')
          i.classList.remove('bi-eye-slash-fill')
          passwordRef.current.type = 'password'
        }
      }
    }
    if (togglePassword.current) {
      togglePassword.current.addEventListener('click', func)
    }
    const r = () =>
      togglePassword.current ? togglePassword.current.removeEventListener('click', func) : void 0
    return r
  }, [])

  useEffect(() => {
    if (!auth) {
      const a = startFirebase()?.auth
      a?.onAuthStateChanged(u => (u ? (window.location.pathname = '/') : void 0))
      setAuth(a)
    }
  }, [auth])

  return (
    <>
      <Head>
        <title>{strings.appName.concat(' - ', strings.signInNow)}</title>
      </Head>
      <main className={styles.main}>
        <form className={styles.form} onSubmit={signIn}>
          <h1>{strings.appName}</h1>
          <p className={styles.welcome}>{strings.nobleMessage}</p>
          <h2>{strings.signInNow}</h2>
          <label>
            <span>{strings.email}</span>
            <input
              autoComplete="off"
              ref={emailRef}
              type="email"
              id="email"
              placeholder={strings.emailPlaceholder}
            />
          </label>
          <label>
            <span>{strings.password}</span>
            <input
              autoComplete="off"
              ref={passwordRef}
              type="password"
              id="password"
              className={styles.password}
              placeholder={strings.passwordPlaceholder}
            />
            <small>{strings.passwordSmall}</small>
            <button ref={togglePassword} type="button" className={styles.togglePassword}>
              <i className="bi bi-eye-fill" />
            </button>
          </label>
          <div className={styles.forgot}>
            <Link href="/password">{strings.forgotPassword}</Link>
          </div>
          <div className={styles.buttonContainer}>
            <button className={styles.button} type="submit">
              {strings.enter}
            </button>
            <button onClick={signUp} className={styles.button} type="button">
              {strings.signUp}
            </button>
          </div>
          <div className={styles.googleContainer}>
            <button onClick={googleSignIn} type="button" className={styles.googleButton}>
              <Image width={24} height={24} src="/images/google.png" alt={strings.googleAlt} />
              <span>{strings.signInGoogle}</span>
            </button>
          </div>
        </form>
      </main>
      <ProgressPopup payload={progressPayload} />
      <Popup payload={popupPayload} />
    </>
  )
}

//<a target="_blank" href="https://icons8.com/icon/17949/google-logo">Google Logo</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
