import { atom } from "recoil";


export const PromptState = atom({
key:'PromptState',
default:''
})


//can be used to change the signin button in the navbar to the signout button
export const UserDetails = atom({
    key:'UserDetails',
    default:null
})

//ai generated code
export const AiCodeResponse = atom({
    key:'AiCodeResponse',
    default:''
})

// for the export and deploy button 
export const action = atom({
    key:'action',
    default:''
})