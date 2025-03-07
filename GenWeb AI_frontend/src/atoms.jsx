import { atom } from "recoil";

export const PromptState = atom({
key:'PromptState',
default:''
})



export const UserDetails = atom({
    key:'UserDetails',
    default:null
})

export const AiCodeResponse = atom({
    key:'AiCodeResponse',
    default:''
})