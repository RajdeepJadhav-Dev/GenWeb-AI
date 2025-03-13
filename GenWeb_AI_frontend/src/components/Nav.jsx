import Bolt from '@/icons/Bolt'
import React, { useEffect,useState } from 'react'
import { Button } from './ui/button'
import { UserDetails } from '@/atoms'
import { useRecoilState, useRecoilValue,useResetRecoilState } from 'recoil'
import axios from 'axios'
import { Signindialog } from './Signindialog'



const Nav = () => {

  // to check wethere i have to give signin option or signout option in the navbar
const [signout,setsignout] = useState(true);
//using the userDetails stored in the atom after singin to change the signin to signout.
const [userdetails,setuserdetails] = useRecoilState(UserDetails);
const resetUserDetails = useResetRecoilState(UserDetails);
const [openDialog,SetopenDialog] = useState(false);



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
    const res = await axios.post('https://gen-web-ai-ten.vercel.app/signout',{email:userInfo?.data?.email});
    resetUserDetails();
  }


  return (
    <div className="h-[10vh] flex justify-between items-center px-4">
    <h1 className="text-white text-2xl flex items-center"><Bolt></Bolt> GenWeb AI</h1>
    <ul className="flex gap-x-2 px-2">
    {
 signout ? 

 <>
  <li>
   <Button onClick={Signout} className="bg-purple-800  m-2 text-white" variant="secondary">
     signout
   </Button>
 </li>
 <li>
   <button><img className='rounded-full h-10 w-10 m-2 pb-1' src={picture} alt="" /></button>
 </li>

</> :
    <>
  <li>
    <Button onClick={()=>SetopenDialog(true)} variant="ghost">Sign in</Button>
  </li>
  <li>
    <Button onClick={()=>SetopenDialog(true)} className="bg-purple-800 text-white" variant="secondary">
      Get Started
    </Button>
  </li>
</>
}
    </ul>
<Signindialog  openDialog={openDialog} closeDialog={(v)=>SetopenDialog(false)}></Signindialog>
  </div>

  )
}

export default Nav