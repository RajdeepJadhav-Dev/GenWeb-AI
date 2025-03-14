import Bolt from '@/icons/Bolt'
import React, { useEffect,useState } from 'react'
import { Button } from './ui/button'
import { UserDetails } from '@/atoms'
import { useRecoilState, useRecoilValue } from 'recoil'
import axios from 'axios'



const Nav = () => {

  // to check wethere i have to give signin option or signout option in the navbar
const [signout,setsignout] = useState(true);
//using the userDetails stored in the atom after singin to change the signin to signout.
const [userdetails,setuserdetails] = useRecoilState(UserDetails);
//to change the singout to singin
const [backtosignin,setbacktosignin] = useState(false)

const userInfo = JSON.parse(localStorage.getItem('userInfo'));
const picture = userInfo?.data?.picture;

  useEffect(()=>{
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const picture = userInfo?.data?.picture; 
    if(userInfo){
      setsignout(true);
    }
    else{
      setsignout(false);
    }

  },[userdetails])

  async function Signout(){
    localStorage.removeItem("userInfo");
    const res = await axios.post('http://localhost:3000/signout',{email:userInfo?.data?.email});
    setbacktosignin(true);
  }


  return (
    <div className="h-[10vh] flex justify-between items-center px-4">
    <h1 className="text-white text-2xl flex items-center"><Bolt></Bolt> GenWeb AI</h1>
    <ul className="flex gap-x-2 px-2">
    {
  signout ? 
    <>
      <li>
        <Button onClick={Signout} className="mr-3 bg-purple-800 text-white" variant="secondary">
          Sign Out
        </Button>
      </li>
      <li>
        <button className="h-10 w-10">
          <img className="rounded-full" src={picture} alt="User" />
        </button>
      </li>
    </>
  :  <>
  <li>
    <Button variant="ghost">Sign in</Button>
  </li>
  <li>
    <Button className="bg-purple-800 text-white" variant="secondary">
      Get Started
    </Button>
  </li>
</>// Optional: Add a fallback if needed
}
    </ul>

  </div>

  )
}

export default Nav