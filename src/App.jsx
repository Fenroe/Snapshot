import './style/index.css'
import React from 'react'
import Sidebar from './components/Sidebar'

function App () {
  return (
    <div className="App">
      <h1 className="text-3xl font-bold underline">
        Hello world!
      </h1>
      <Sidebar />
    </div>
  )
}

export default App
