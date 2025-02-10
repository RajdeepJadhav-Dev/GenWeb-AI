import { Button } from "./ui/button";
import { ChevronRight } from "lucide-react"
import lookup from '../data/Lookup'
import Link from "@/icons/Link";
import { useState } from "react";
import { useRecoilState, useRecoilValue} from "recoil";
import { PromptState, UserDetails } from "@/atoms";
import { Signindialog } from './Signindialog'


export default function Hero(){

    const [UserInput,SetUserInput] = useState();
    const [PromptInput,SetPromptInput] = useRecoilState(PromptState);
    const userdetails = useRecoilValue(UserDetails);
    const [openDialog,SetopenDialog] = useState(false);


    function Prompt(input){
        if(!userdetails?.data?.name){
            SetopenDialog(true);
            return;
        }
        SetPromptInput(input)
    }

    return(
        <>
     <Signindialog  openDialog={openDialog} closeDialog={(v)=>SetopenDialog(false)}></Signindialog>
    <div className="h-[90vh] flex items-center justify-center pb-[10vh]">
        <ul className="flex  flex-col justify-center items-center ">
        <li><h1 className="text-5xl text-white font-bold m-4 pl-5 ">What do you want to build?</h1></li>
        <li><h2 className="text-gray-400 font-bold ">Prompt, run, edit, and deploy full-stack web apps.</h2></li>
        <li className="m-4 relative  "><textarea onChange={(e)=>SetUserInput(e.target.value)} placeholder='how can i help you today' className="custom-scrollbar resize-none min-w-96 min-h-32 max-h-96 p-2 pr-9 pb-5  bg-gray-900 text-white border border-gray-700  rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500" name="" id=""></textarea>
        {UserInput ? <Button onClick={()=>Prompt(UserInput)} className='text-white absolute right-2 top-2 bg-purple-800 hover:bg-purple-600 hover:text-white h-7 w-7' variant='ghost' size='icon'><ChevronRight /></Button> : null}
        <Link></Link>
        </li>
        <li className="flex flex-wrap max-w-2xl items-center justify-center">
            {lookup.SUGGSTIONS.map((suggestions,index)=>{
                
               return <h3 onClick={()=>Prompt(suggestions)} className="p-1 m-1 hover:text-white cursor-pointer px-2 border rounded-full text-gray-400 text-sm border-black" key={index}>{suggestions}</h3>
                
            })}
        </li>
        </ul>
    </div>
    
        </>
    );
}