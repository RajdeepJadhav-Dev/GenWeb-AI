import Bolt from '@/icons/Bolt'
import React from 'react'
import { Button } from './ui/button'

const Nav = () => {
  return (
    <div className="h-[10vh] flex justify-between items-center px-4">
    <h1 className="text-white text-2xl flex items-center"><Bolt></Bolt> GenWeb AI</h1>
    <ul className="flex gap-x-2 px-2">
      <li><Button variant="ghost">Sign in</Button></li>
      <li><Button className='bg-purple-800 text-white' variant="secondary">Get Started</Button></li>
    </ul>
  </div>

  )
}

export default Nav