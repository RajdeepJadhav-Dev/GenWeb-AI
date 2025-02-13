import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Background from "./components/Background";
import Bolt from "./icons/Bolt";
import { Button } from "./components/ui/button";
import Prompt from './data/prompt'

export default function Workspace() {
  const { WorkspaceId } = useParams();  // Extracting the WorkspaceId from the URL
  const [messages, setMessages] = useState([]);  // State to hold messages

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/get/${WorkspaceId}`);
       // console.log('Fetched Messages:', res.data.messeges);  // Check what data is fetched
        setMessages(res.data.messeges);  // Set the fetched messages to state
      } catch (err) {
        console.error('Error fetching messages:', err);
        setMessages('Error loading messages');  // Show error message in UI
      }
    };

    fetchMessages();
  }, [WorkspaceId]);

  useEffect(()=>{
    if(messages?.length>0){
      const role = messages[messages?.length-1].role;
      if(role=='user'){
      GetAiResponse();
      }
    }
  },[messages])



  async function GetAiResponse(){
    const PROMPT = JSON.stringify(messages)+Prompt.CHAT_PROMPT;
   const response = await axios.post('http://localhost:3000/AiResponse',{
    PROMPT:PROMPT
   });
   console.log(response.data.result)
  }

  return (
    <>
  <div className="relative h-[100vh]">
      {/* Background Component */}
      <Background />

      <div className="relative z-10">
       <div className="h-[10vh] flex justify-between items-center px-4">
          <h1 className="text-white text-2xl flex items-center"><Bolt></Bolt> GenWeb AI</h1>
          <ul className="flex gap-x-2 px-2">
        <><li><Button className='px-5' variant="ghost">Export</Button></li>
            <li><Button className='bg-purple-800 px-5 text-white' variant="secondary">Deploy</Button></li></>
          </ul>
        </div>

    <div className="flex gap-x-4"> 
        <div className="text-white relative z-10  w-[500px] h-[500px] overflow-auto custom-scrollbar">
          {messages.map((obj,key)=><div className='bg-chat_color m-4 p-4 rounded-2xl  ' key={key}>{obj.content}</div>)}
        </div>
        <div className="text-white text-xl border-white border-2 h-[650px] w-[980px]">
            code view
        </div>
        </div>

        <textarea placeholder="How can GenWeb AI help you today" className="custom-scrollbar resize-none min-w-[480px] left-3 min-h-32 max-h-96 p-2 pr-9 pb-5 absolute bottom-2 bg-gray-900 text-white border border-gray-700  rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500">
          
        </textarea>

        </div>
        </div>
       

    </>
  );
}
