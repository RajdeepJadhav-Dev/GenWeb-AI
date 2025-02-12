import { Button } from "./ui/button";
import { ChevronRight } from "lucide-react"
import lookup from '../data/Lookup'
import Link from "@/icons/Link";
import { useState } from "react";
import { useRecoilState, useRecoilValue} from "recoil";
import { PromptState, UserDetails } from "@/atoms";
import { Signindialog } from './Signindialog'
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Hero(){

    const navigate = useNavigate();

    //the prompt extracted from the text-area...have to use the state variable so that the enter button conditionally appears onchage in the text of text area
    const [UserInput,SetUserInput] = useState('');

    //the prompt user will give for the generation of the code which will be stored in the atom
    const [PromptInput,SetPromptInput] = useRecoilState(PromptState);

    //not sure if i need this right now but will keep it just to be cautious
    const userdetails = useRecoilValue(UserDetails);

    //to open the signin in with google dialog
    const [openDialog,SetopenDialog] = useState(false);

   

    async function Prompt(input){

    //used json parse because localstorage stores everuthing as a string 
       const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        //extracted the unique identifier google gave to the user
       const userSub = userInfo?.data?.sub
     
        if(!userInfo){
            SetopenDialog(true);
            return;
        }
        
         axios.post('http://localhost:3000/prompt',{
            messeges:[{content:input,
                role:'user'}],
            userSub:userSub
        })  .then((response) => {
            navigate('/Workspace/'+response.data.workspaceId); 
            SetPromptInput(input); 
        })
        .catch((error) => {
            console.error("Error in axios request:", error);
        });
        
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