import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Home } from './Home'
import { Likes } from './Likes'
import { Profile } from './Profile'
import { Albums } from './Albums'
import { Album } from './Album'
import { Sidebar } from '../components/Sidebar'
import { ProfileSetup } from '../components/ProfileSetup'
import { LoadingModal } from '../components/LoadingModal'
import { WriteErrorModal } from '../components/WriteErrorModal'
import { useAuthUser } from '@react-query-firebase/auth'
import { useFirestoreDocument } from '@react-query-firebase/firestore'
import { auth, getUserDocRef } from '../firebase'
import { UserContext } from '../contexts/UserContext'

export const Main = () => {
  const [userQueryKey, setUserQueryKey] = useState(Date.now())

  const user = useAuthUser('user', auth)

  const userQuery = useFirestoreDocument(`userData${user.data.uid}${userQueryKey}`, getUserDocRef(user.data?.uid))

  return (
    <UserContext.Provider value={{ userData: userQuery.data?.data(), updateKey: () => setUserQueryKey(Date.now()) }}>
      {userQuery.data && userQuery.data.data().setup === false && <ProfileSetup updateKey={() => setUserQueryKey(Date.now())}/>}
      {userQuery.isLoading && <LoadingModal />}
      {userQuery.isError && <WriteErrorModal />}
      <Sidebar />
      <main className="main">
        <Routes>
          <Route exact path="/" element={<Home />}/>
          <Route exact path="/likes" element={<Likes />} />
          <Route exact path="/profile/:id" element={<Profile />} />
          <Route exact path="/albums/" element={<Albums />} />
          <Route exact path="/album/:id" element={<Album />} />
          <Route path="*" element={<Navigate replace to="/" />}/>
        </Routes>
      </main>
    </UserContext.Provider>
  )
}
