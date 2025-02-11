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
import { stringify } from 'postcss'
 

//initiallizing the response you get after send the google account details to the backend/databse for saving
let response;

//react google auth
export const Signindialog = ({openDialog,closeDialog}) => {

//not sure if i need this userdetails atom but still keeping it for caution
const [user,setuser] = useRecoilState(UserDetails);


const googleLogin = useGoogleLogin({
  onSuccess: async (tokenResponse) => {
    console.log(tokenResponse);
    const userInfo = await axios.get(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      { headers: { Authorization: 'Bearer '+tokenResponse?.access_token } },
    );

    console.log(userInfo);

    //not sure if this setting of user details to the atom is neccesory but still keeping it for caution
    setuser(userInfo);

    //setting the userInfo to the localstorage so that the signindialog dosent appear again on refresh
    localStorage.setItem('userInfo',userInfo)
    closeDialog(false);
     response = await axios.post('http://localhost:3000/login',{
      userInfo:userInfo.data
    })

    console.log(response.data.msg)
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
