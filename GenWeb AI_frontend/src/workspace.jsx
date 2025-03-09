import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState,useRef } from "react";
import Background from "./components/Background";
import Bolt from "./icons/Bolt";
import { Button } from "./components/ui/button";
import Prompt from './data/prompt'
import { ChevronRight, Loader2Icon } from "lucide-react"
import { Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import CodeView from "./components/CodeView";
import { AiCodeResponse } from "./atoms";
import { useRecoilState } from "recoil";


export default function Workspace() {

  //to lead the picture of the user in the chat
  const userInfo = JSON.parse(localStorage.getItem('userInfo')); // Parse JSON
  const picture = userInfo?.data?.picture;
 

  const { WorkspaceId } = useParams();  // Extracting the WorkspaceId from the URL
  const [messages, setMessages] = useState([]);  // State to hold messages
  const isFetchingResponse = useRef(false);
  //to extract messages from chatview of the workspace
  const [ChatViewMessages,setChatViewMessages] = useState('');
  // loader while loading message
  const [loading,setLoading] = useState(false);
  //atom for AiCodeResponse
  const [newfiledata,setnewfiledata] = useRecoilState(AiCodeResponse);
  //loader for the codeview
  const [codeloading,setcodeloading] = useState(false);


  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/get/${WorkspaceId}`);
       // console.log('Fetched Messages:', res.data.messeges);  // Check what data is fetched
       setMessages([res.data.messeges[0]]);  // ✅ Store the last message as an array
      } catch (err) {
        console.error('Error fetching messages:', err);
        setMessages('Error loading messages');  // Show error message in UI
      }
    };

    fetchMessages();
  }, [WorkspaceId]);

  useEffect(() => {
    if (messages.length > 0) {
        const lastMessage = messages[messages.length - 1];

        if (lastMessage.role === 'user' && !isFetchingResponse.current) {
            isFetchingResponse.current = true; // ✅ Prevent duplicate calls
            GetAiResponse(lastMessage.content).finally(() => {
                isFetchingResponse.current = false; // ✅ Reset after response
            });
        }
    }
}, [messages]);




// this useref is used to that getairesponse only runs oncce 
const isFetching = useRef(false);

async function GetAiResponse(lastUserMessage) {
 setcodeloading(true);
    if (isFetching.current) return; // Prevent duplicate calls
    isFetching.current = true;


    setMessages(prev => [...prev, { role: 'user', content: lastUserMessage }]);
    setChatViewMessages('');
    setLoading(true);

    //prompt for ai chat
    const PROMPT = lastUserMessage + Prompt.CHAT_PROMPT;
    //prompt for ai code
    const CodePROMPT = lastUserMessage + Prompt.CODE_GEN_PROMPT;

    try {
      //chat ai response
        const response = await axios.post('http://localhost:3000/AiResponse', { PROMPT });
      //code ai response
      const res = await axios.post('http://localhost:3000/AiCodeResponse',{CodePROMPT:CodePROMPT});
      setnewfiledata(res.data.result);
 
     

        setMessages(prev => [...prev, { role: 'ai', content: response.data.result }]);
    } catch (err) {
        console.error("❌ AI Response Error:", err);
    } finally {
        setLoading(false);
        isFetching.current = false;
    }
   setcodeloading(false);
}


//to send chatview message to ai on enter
const handleKeyDown = (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault(); // Prevents new line in the textarea
    GetAiResponse(ChatViewMessages)
  }
};



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
          { messages.map((obj,key)=>(obj.role == 'user' ?  <div key={key} className='bg-chat_color flex flex-wrap items-center gap-x-2 m-4 p-4 rounded-2xl leading-7 font-thin'><img className=" rounded-full h-8 w-8" src={picture} alt="picture" /><ReactMarkdown >{obj.content}</ReactMarkdown></div> :
           <div key={key} className='bg-chat_color m-4 p-4 rounded-2xl leading-7 font-thin'><ReactMarkdown >{obj.content}</ReactMarkdown></div> ))}
          {loading ? <div className="flex ml-4 gap-x-2 bg-chat_color m-4 p-4 rounded-2xl">
          <Loader2 className="animate-spin h-6 w-6 text-purple-500" />
        
          </div> : null}
        </div>
       
        <div className=" h-[650px] w-[980px]">
          <CodeView></CodeView>
       {codeloading ? <div className="p-10 pt-72 pl-[470px] bg-gray-900 opacity-80 relative bottom-[659px] rounded-lg w-full h-full items-center justify-center">
          <Loader2Icon className="animate-spin h-20 w-20 text-white "/>
          <h2 className="text-white relative right-4">Generating files.....</h2>
          </div> : null }
        </div>
        </div>
    <div className="relative">
  
        <textarea onKeyDown={handleKeyDown} value={ChatViewMessages} onChange={(e)=>setChatViewMessages(e.target.value)}  placeholder="How can GenWeb AI help you today" className="custom-scrollbar resize-none min-w-[480px] left-3 min-h-32 max-h-96 p-2 pr-12 pb-5 absolute bottom-2 bg-gray-900 text-white border border-gray-700  rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"> </textarea>
        <Button onClick={()=>GetAiResponse(ChatViewMessages)} className='text-white absolute bottom-24 left-[450px] bg-purple-800 hover:bg-purple-600 hover:text-white h-7 w-7' variant='ghost' size='icon'><ChevronRight></ChevronRight></Button> 
        </div>

        </div>
        </div>
       
   

    </>
  );
}
