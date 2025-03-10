import { atom } from "recoil";


export const PromptState = atom({
key:'PromptState',
default:''
})

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