import React from 'react'
import { useGoogleLogin } from '@react-oauth/google'
import axios from 'axios'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from './ui/button'
import { useRecoilState } from 'recoil'
import { UserDetails } from '@/atoms'
  

export const Signindialog = ({openDialog,closeDialog}) => {

  const [user,setuser] = useRecoilState(UserDetails);

  
const googleLogin = useGoogleLogin({
  onSuccess: async (tokenResponse) => {
    console.log(tokenResponse);
    const userInfo = await axios.get(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      { headers: { Authorization: 'Bearer '+tokenResponse?.access_token } },
    );

    console.log(userInfo);
    setuser(userInfo);
    closeDialog(false);
  },
  onError: errorResponse => console.log(errorResponse),
});






  return (
    <Dialog open={openDialog} onOpenChange={closeDialog}>
 
  <DialogContent className='bg-black text-white '>
    <DialogHeader className='flex justify-center items-center'>
      <DialogTitle>Continue with GenWeb AI</DialogTitle>
      <DialogDescription>
       To use GenWeb AI you must log into an existing account or create one
       <div className='flex justify-center items-center m-2 pt-2'>
       <Button onClick={googleLogin} variant='secondary'>SIGN IN WITH GOOGLE</Button>

       </div>
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>

  )
}
