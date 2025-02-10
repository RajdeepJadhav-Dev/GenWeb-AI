import { useState } from 'react'

import './App.css'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Background from './components/Background'



function App() {
  

  return (
    <>
 <div className="relative h-[100vh]">
      {/* Background Component */}
      <Background />

      {/* Main Content */}
      <div className="relative z-10">
        <Nav />
        <Hero />
      </div>
    </div>
    </>
  )
}

export default App
