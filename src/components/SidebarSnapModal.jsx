import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { MdOutlineClose } from 'react-icons/md'
import React, { useEffect, useState, useContext, useRef } from 'react'
import { AiOutlinePicture } from 'react-icons/ai'
import TextareaAutosize from 'react-textarea-autosize'
import { ProfilePicture } from './ProfilePicture'
import { UserContext } from '../contexts/UserContext'
import { uploadSnapPicture, getURL, snapCollection } from '../firebase'
import { useFirestoreCollectionMutation } from '@react-query-firebase/firestore'

export const SidebarSnapModal = ({ closeModal }) => {
  const [uploadedImage, setUploadedImage] = useState({
    preview: '',
    file: null
  })

  const [error, setError] = useState('')

  const textareaRef = useRef(null)

  const snapCollectionMutation = useFirestoreCollectionMutation(snapCollection)

  const { userData } = useContext(UserContext)

  const handleImageUpload = (evt) => {
    setError('')
    const reader = new FileReader()
    reader.onload = () => {
      if (reader.readyState !== 2) return
      setUploadedImage({
        preview: reader.result,
        file: evt.target.files[0]
      })
    }
    reader.readAsDataURL(evt.target.files[0])
  }

  const handleErrors = (message) => setError(message)

  const validateText = () => {
    if (textareaRef.current.value.length > 150) return handleErrors('Your description has to be 150 characters or shorter')
    return handleErrors('')
  }

  const handleSubmit = async (evt) => {
    evt.preventDefault()
    if (uploadedImage.file === null) return handleErrors('Upload an image to share')
    if (textareaRef.current.value.length > 150) return
    try {
      const file = uploadedImage.file
      const snapText = textareaRef.current.value
      const imageRef = await uploadSnapPicture(file)
      const imageURL = await getURL(imageRef)
      snapCollectionMutation.mutate({
        userId: userData.userId,
        username: userData.username,
        profilePicture: userData.profilePicture,
        posted: new Date(),
        image: imageURL,
        text: snapText,
        likedBy: []
      })
      setUploadedImage({
        preview: '',
        file: null
      })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    const unsetOverflow = () => {
      document.body.style.overflow = 'unset'
    }

    return () => unsetOverflow()
  }, [])

  useEffect(() => {
    const closeOnEscape = (evt) => {
      if (evt.key === 'Escape') {
        closeModal()
      }
    }
    document.addEventListener('keydown', (evt) => closeOnEscape(evt))

    return () => document.removeEventListener('keydown', (evt) => closeOnEscape(evt))
  }, [])

  return ReactDOM.createPortal(
    <>
      <div className="bg-neutral-900 bg-opacity-50 fixed inset-0 z-40"/>
      <div className="flex flex-col bg-neutral-100 fixed left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-50 p-3 w-[480px] h-auto rounded-lg overflow-auto dark:bg-neutral-900 dark:text-neutral-100">
        <div className="flex gap-12 text-2xl mb-3">
          <button onClick={closeModal}><MdOutlineClose /></button>
          <h1 className="font-bold text-lg">Compose your snap</h1>
        </div>
        <div className="story-box">
      <div className="sb-profile-picture-wrapper">
        <div>
          <ProfilePicture url={userData.profilePicture} size="small" />
        </div>
      </div>
      <div className="w-full">
        {uploadedImage.file === null
          ? (
          <div className="w-full h-28 flex items-center justify-center">
            <label htmlFor="modal-post-image-input" className="border-2 bg-red-500 rounded-full p-3 text-neutral-100 font-bold hover:cursor-pointer"><AiOutlinePicture className="text-2xl"/></label>
            <input className="hidden" type="file" name="image-upload" id="modal-post-image-input" accept="image/*" onChange={(e) => handleImageUpload(e)}/>
          </div>
            )
          : (
            <div className="sb-content-wrapper>">
              <TextareaAutosize onChange={validateText} ref={textareaRef} className="sb-text-area" placeholder="Text goes here" />
              <div className="relative text-3xl rounded">
                <button className="absolute top-3 left-3 rounded-full hover:cursor-pointer text-neutral-100 bg-neutral-900" onClick={() => setUploadedImage({ preview: '', file: null })}>
                  <MdOutlineClose />
                </button>
                <img src={uploadedImage.preview} className="rounded-xl" />
              </div>
            </div>
            )}
            <div className="w-full flex justify-end">
              <button disabled={snapCollectionMutation.isLoading} className="min-h-[36px] border-2 bg-red-500 rounded-full px-4 text-neutral-100 text-lg font-bold" onClick={(e) => handleSubmit(e)}>
                Snap
              </button>
            </div>
            <div className="w-full text-red-500 text-center">
              {error}
            </div>
          </div>
        </div>
      </div>
    </>, document.getElementById('modal')
  )
}

SidebarSnapModal.propTypes = {
  closeModal: PropTypes.func
}
