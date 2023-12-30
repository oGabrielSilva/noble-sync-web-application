import { AuthContext } from '@Noble/context/AuthContext'
import { FormEventHandler, useContext, useEffect, useRef, useState } from 'react'

import styles from '@Noble/styles/modules/index.module.css'
import { I18nContext } from '@Noble/context/I18nContext'
import { imageToDataURL } from '@Noble/utils/image'
import { Avatar } from '../Avatar'
import { MIN_AGE } from '@Noble/resources/constants'
import { bioIsValid, nameIsValid, nicknameIsValid } from '@Noble/utils/validation'
import { shake } from '@Noble/resources/anim/shake'
import { doc, setDoc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadString } from 'firebase/storage'
import { updateProfile } from 'firebase/auth'
import { User } from '@Noble/models/User'

interface ProfileProps {
  insideContainer?: boolean
  onSave: () => void
}

const year = new Date().getFullYear()
const ages = Array.from(Array(35)).map((_, i) => year - MIN_AGE - i)

export const EditProfile = ({ onSave }: ProfileProps) => {
  const { auth, db, storage, user, setUser } = useContext(AuthContext)
  const { strings } = useContext(I18nContext)

  const [firstSystemChangeAvatar, setFirstSystemChangeAvatar] = useState(false)
  const [avatar, setAvatar] = useState('')
  const [gender, setGender] = useState<Gender>('M')
  const [birthYear, setBirthYear] = useState(ages[0])
  const [bio, setBio] = useState('')

  const inputFileRef = useRef<HTMLInputElement>(null)
  const inputNameRef = useRef<HTMLInputElement>(null)
  const inputNicknameRef = useRef<HTMLInputElement>(null)
  const inputBioRef = useRef<HTMLTextAreaElement>(null)

  const pickImage = () => (inputFileRef.current ? inputFileRef.current.click() : void 0)
  const onPickImage: FormEventHandler<HTMLInputElement> = e => {
    const image = e.currentTarget.files ? e.currentTarget.files[0] : null
    if (!image || !image.type.includes('image')) return
    const f = async () => {
      const data = await imageToDataURL(image)
      setAvatar(data)
    }
    f()
  }
  const getFormIsValid = () => {
    const value = { isValid: false, avatar, name: '', nickname: '', birthYear, bio, gender }
    if (!inputNameRef.current || !inputNicknameRef.current || !inputBioRef.current) return value
    value.name = inputNameRef.current.value
    if (!nameIsValid(value.name)) {
      shake(inputNameRef.current)
      return value
    }
    value.nickname = inputNicknameRef.current.value
    if (!nicknameIsValid(value.nickname)) {
      shake(inputNicknameRef.current)
      return value
    }
    if (!bioIsValid(value.bio)) {
      shake(inputBioRef.current)
      return value
    }
    value.isValid = true
    return value
  }
  const onSubmit: FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault()
    const { avatar, bio, birthYear, gender, isValid, name, nickname } = getFormIsValid()
    const f = async () => {
      try {
        if (!isValid || !auth || !auth.currentUser) return
        const u = new User(auth.currentUser.uid, nickname, gender, birthYear, bio)
        await setDoc(doc(db!, `/users/${auth.currentUser.uid}`), {
          ...u,
          updatedAt: Date.now(),
        })
        const avatarRef =
          avatar && avatar.startsWith('data:')
            ? ref(storage!, `/avatar/${auth.currentUser.uid}`)
            : null
        if (avatarRef) {
          await uploadString(avatarRef, avatar, 'data_url')
          const url = await getDownloadURL(avatarRef)
          await updateProfile(auth.currentUser, {
            photoURL: url,
          })
        }
        //  else {
        //   deleteObject(ref(storage!, `/avatar/${auth.currentUser.uid}`))
        //     .then(s => console.log(s))
        //     .catch(e => console.log(e))
        //   await updateProfile(auth.currentUser, { photoURL: '' })
        // }
        await updateProfile(auth.currentUser, { displayName: name })
        setUser(u)
        onSave()
      } catch (error) {
        console.log(error)
      }
    }
    f()
  }

  useEffect(() => {
    if (auth && !firstSystemChangeAvatar)
      auth.onAuthStateChanged(u => {
        setFirstSystemChangeAvatar(true)
        setAvatar((u && u.photoURL) || '')
      })
  }, [auth, firstSystemChangeAvatar])

  useEffect(
    () =>
      user &&
      (() => {
        setGender(user.gender)
        setBio(user.bio)
      })(),
    [user]
  )

  return (
    auth && (
      <form onSubmit={onSubmit}>
        <div className={styles.avatarContainer}>
          <input
            onInput={onPickImage}
            ref={inputFileRef}
            type="file"
            className={styles.inputPickImage}
            accept=".png, .jpg, .jpeg, .JPEG, .JPG"
          />
          <Avatar size={80} src={avatar} onClick={pickImage} />
          <button
            onClick={() => setAvatar('')}
            className={styles.removeCurrentAvatar}
            type="button"
          >
            {strings.remove}
          </button>
        </div>
        <label>
          <span>{strings.name}</span>
          <input
            ref={inputNameRef}
            defaultValue={(auth && auth.currentUser && auth.currentUser.displayName) || ''}
            autoComplete="off"
            type="text"
            id="name"
            placeholder={strings.namePlaceholder}
          />
          <small>{strings.nameSmall}</small>
        </label>
        <label>
          <span>{strings.nickname}</span>
          <input
            ref={inputNicknameRef}
            autoComplete="off"
            defaultValue={(user && user.nickname) || ''}
            type="text"
            id="nickname"
            placeholder={strings.nicknamePlaceholder}
          />
          <small>{strings.nicknameSmall}</small>
        </label>
        <label>
          <span>{strings.yearLabel}</span>
          <select
            defaultValue={user && user.birthYear}
            onChange={e => setBirthYear(Number(e.currentTarget.value))}
          >
            {ages.map(age => (
              <option value={age} key={age}>
                {age}
              </option>
            ))}
          </select>
          <small>{strings.yearSmall}</small>
        </label>
        <label>
          <span>{strings.bio}</span>
          <textarea
            defaultValue={user && user.bio}
            ref={inputBioRef}
            className={!bioIsValid(bio) ? 'danger' : ''}
            onInput={e => setBio(e.currentTarget.value)}
            placeholder={strings.bioPlaceholder}
          />
          <small className={bioIsValid(bio) ? '' : 'danger'}>{(200 - bio.length).toString()}</small>
        </label>
        <div className={styles.gendersContainer}>
          <button
            type="button"
            onClick={() => setGender('M')}
            className={gender === 'M' ? styles.genderSelected : ''}
          >
            {strings.male}
          </button>
          <button
            type="button"
            onClick={() => setGender('F')}
            className={gender === 'F' ? styles.genderSelected : ''}
          >
            {strings.female}
          </button>
          <button
            type="button"
            onClick={() => setGender('O')}
            className={gender === 'O' ? styles.genderSelected : ''}
          >
            {strings.other}
          </button>
        </div>
        <button type="submit" className={styles.saveButton}>
          {strings.save}
        </button>
      </form>
    )
  )
}
