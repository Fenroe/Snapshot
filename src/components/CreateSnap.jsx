import React, { useState, useContext, useRef } from 'react'
import { AiOutlinePicture } from 'react-icons/ai'
import { MdOutlineClose } from 'react-icons/md'
import TextareaAutosize from 'react-textarea-autosize'
import { ProfilePicture } from './ProfilePicture'
import { UserContext } from '../contexts/UserContext'
import { db, postSnap, uploadSnapPicture, getURL, deleteSnap } from '../firebase'
import { addDoc, collection } from 'firebase/firestore'

export const CreateSnap = () => {
  const [uploadedImage, setUploadedImage] = useState({
    preview: '',
    file: null
  })

  const [error, setError] = useState('')

  const textareaRef = useRef(null)

  const { user, localWrittenSnaps, setLocalWrittenSnaps, loading, setLoading, setWriteError } = useContext(UserContext)

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
    if (loading) return
    setLoading(true)
    if (uploadedImage.file === null) return handleErrors('Upload an image to share')
    if (textareaRef.current.value.length > 150) return
    const docRef = await addDoc(collection(db, 'snaps'), {})
    try {
      const file = uploadedImage.file
      const snapText = textareaRef.current.value
      setLocalWrittenSnaps([{
        id: docRef.id,
        image: uploadedImage.preview,
        likedBy: [],
        posted: new Date(),
        profilePicture: user.profilePicture,
        text: snapText,
        userId: user.userId,
        username: user.username
      }, ...localWrittenSnaps])
      setUploadedImage({
        preview: '',
        file: null
      })
      const imageRef = await uploadSnapPicture(file)
      const imageURL = await getURL(imageRef)
      await postSnap(docRef, user.username, user.profilePicture, imageURL, snapText)
      setLoading(false)
    } catch (error) {
      deleteSnap(docRef.id)
      setLocalWrittenSnaps(localWrittenSnaps.filter((snap) => snap.id !== docRef.id ? snap : null))
      setLoading(false)
      setWriteError(true)
    }
  }

  return (
    <div className="story-box">
      <div className="sb-profile-picture-wrapper">
        <a href="" className="">
          <ProfilePicture url={user.profilePicture} size="small" />
        </a>
      </div>
      <div className="w-full">
        {uploadedImage.file === null
          ? (
          <div className="w-full h-28 flex items-center justify-center">
            <label tabIndex="0" htmlFor="post-image-input" className="border-2 bg-red-500 rounded-full p-3 text-white font-bold hover:cursor-pointer transition-transform hover:scale-125 hover:brightness-125 focus:scale-125 focus:brightness-125"><AiOutlinePicture className="text-2xl"/></label>
            <input className="hidden" type="file" name="image-upload" id="post-image-input" accept="image/*" onChange={(e) => handleImageUpload(e)}/>
          </div>
            )
          : (
            <div className="sb-content-wrapper>">
              <TextareaAutosize onChange={validateText} ref={textareaRef} className="sb-text-area" placeholder="Text goes here" />
              <div className="relative text-3xl rounded">
                <button className="absolute top-3 left-3 rounded-full hover:cursor-pointer text-white bg-black" onClick={() => setUploadedImage({ preview: '', file: null })}>
                  <MdOutlineClose />
                </button>
                <img src={uploadedImage.preview} className="sb-image" />
              </div>
            </div>
            )}
            <div className="w-full flex justify-end">
              <button className="min-h-[36px] border-2 bg-red-500 rounded-full px-4 text-white text-lg font-bold transition-transform hover:scale-125 hover:brightness-125" onClick={(e) => handleSubmit(e)}>
                Snap
              </button>
            </div>
            <div className="w-full text-red-500 text-center">
              {error}
            </div>
      </div>
    </div>
  )
}
