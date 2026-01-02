import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import Background from "./components/Background";
import Bolt from "./icons/Bolt";
import { Button } from "./components/ui/button";
import Prompt from './data/prompt';
import { ChevronRight, Loader2Icon } from "lucide-react";
import { Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import CodeView from "./components/CodeView";
import { AiCodeResponse } from "./atoms";
import { useRecoilState } from "recoil";
import { action } from "./atoms";
import UserIcon from "./components/UserIcon";

export default function Workspace() {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const picture = userInfo?.data?.picture;

  const { WorkspaceId } = useParams();
  const [messages, setMessages] = useState([]);
  const isFetchingResponse = useRef(false);
  const [ChatViewMessages, setChatViewMessages] = useState('');
  const [loading, setLoading] = useState(false);
  const [newfiledata, setnewfiledata] = useRecoilState(AiCodeResponse);
  const [codeloading, setcodeloading] = useState(false);
  const [Navaction, setNavaction] = useRecoilState(action);
  const isFetching = useRef(false);
  
  // ✅ NEW: Store conversation history for context
  const conversationHistory = useRef([]);
  const codeHistory = useRef([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/get/${WorkspaceId}`
        );
        setMessages([res.data.messeges[0]]);
      } catch (err) {
        console.error('Error fetching messages:', err);
        setMessages('Error loading messages');
      }
    };

    fetchMessages();
  }, [WorkspaceId]);

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];

      if (lastMessage.role === 'user' && !isFetchingResponse.current) {
        isFetchingResponse.current = true;
        GetAiResponse(lastMessage.content).finally(() => {
          isFetchingResponse.current = false;
        });
      }
    }
  }, [messages]);

  async function GetAiResponse(lastUserMessage) {
    setcodeloading(true);
    if (isFetching.current) return;
    isFetching.current = true;

    setMessages(prev => [...prev, { role: 'user', content: lastUserMessage }]);
    setChatViewMessages('');
    setLoading(true);

    // ✅ Build conversation context
    const chatContext = conversationHistory.current
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n\n');

    const codeContext = codeHistory.current
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n\n');

    const PROMPT = `${chatContext ? 'Previous conversation:\n' + chatContext + '\n\n' : ''}Current request: ${lastUserMessage}\n\n${Prompt.CHAT_PROMPT}`;
    
    const CodePROMPT = `${codeContext ? 'Previous code requests:\n' + codeContext + '\n\n' : ''}Current request: ${lastUserMessage}

CRITICAL: You MUST respond with ONLY valid JSON. No markdown, no explanations, no code fences.
Just pure JSON starting with { and ending with }.

Required JSON format:
{
  "projectTitle": "string",
  "explanation": "string",
  "files": {
    "/App.js": {
      "code": "string containing the full code"
    }
  },
  "generatedFiles": ["array", "of", "filenames"]
}

${Prompt.CODE_GEN_PROMPT}`;

    try {
      console.log("📨 Sending chat request...");
      const chatResponse = await axios.post(
        import.meta.env.VITE_API_URL + "/AiResponse",
        { PROMPT }
      );

      console.log("✅ Chat response received");
      const aiChatResponse = chatResponse.data.result;
      
      // ✅ Store in history
      conversationHistory.current.push(
        { role: 'user', content: lastUserMessage },
        { role: 'assistant', content: aiChatResponse }
      );
      
      // Keep only last 10 messages (5 exchanges) to avoid token limits
      if (conversationHistory.current.length > 10) {
        conversationHistory.current = conversationHistory.current.slice(-10);
      }

      setMessages(prev => [...prev, { role: 'ai', content: aiChatResponse }]);

      console.log("⏳ Waiting 3 seconds before code request...");
      await new Promise(resolve => setTimeout(resolve, 3000));

      console.log("📨 Sending code request...");
      const codeResponse = await axios.post(
        import.meta.env.VITE_API_URL + "/AiCodeResponse",
        { CodePROMPT }
      );

      console.log("✅ Code response received");
      const aiCodeResponse = codeResponse.data.result;
      
      // ✅ Store code history (just keep summary, not full code)
      codeHistory.current.push(
        { role: 'user', content: lastUserMessage },
        { role: 'assistant', content: `Generated ${JSON.parse(aiCodeResponse).projectTitle}` }
      );
      
      // Keep only last 6 messages (3 exchanges)
      if (codeHistory.current.length > 6) {
        codeHistory.current = codeHistory.current.slice(-6);
      }
      
      setnewfiledata(aiCodeResponse);

    } catch (err) {
      console.error("❌ AI Response Error:", err);

      let errorMessage = '❌ An error occurred. Please try again.';

      if (err.response?.status === 429) {
        errorMessage = '⚠️ Rate limit reached. Please wait a moment and try again.';
      } else if (err.code === 'ERR_NETWORK') {
        errorMessage = '❌ Cannot connect to server. Please check if the backend is running.';
      } else if (err.response?.data?.error) {
        errorMessage = `❌ ${err.response.data.error}`;
        if (err.response.data.rawResponse) {
          console.log("Raw AI response:", err.response.data.rawResponse);
        }
      }

      setMessages(prev => [...prev, {
        role: 'ai',
        content: errorMessage
      }]);

    } finally {
      setLoading(false);
      isFetching.current = false;
      setcodeloading(false);
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      GetAiResponse(ChatViewMessages);
    }
  };

  return (
    <>
      <div className="relative h-[100vh]">
        <Background />

        <div className="relative z-10">
          <div className="h-[10vh] flex justify-between items-center px-4">
            <h1 className="text-white text-2xl flex items-center">
              <Bolt></Bolt> GenWeb AI
            </h1>
            <ul className="flex gap-x-2 px-2">
              <>
                <li>
                  <Button onClick={() => setNavaction('Export')} className='px-5' variant="ghost">
                    Export
                  </Button>
                </li>
                <li>
                  <Button onClick={() => setNavaction('Deploy')} className='bg-purple-800 px-5 text-white' variant="secondary">
                    Deploy
                  </Button>
                </li>
              </>
            </ul>
          </div>

          <div className="flex gap-x-4">
            <div className="text-white relative z-10 w-[500px] h-[500px] overflow-auto custom-scrollbar">
              {messages.filter((msg, index, self) =>
                index === self.findIndex((m) => m.content === msg.content)
              ).map((obj, key) => (
                obj.role === 'user' ?
                  <div key={key} className='bg-chat_color flex flex-wrap items-center gap-x-2 m-4 p-4 rounded-2xl leading-7 font-thin'>
                    <img
                      className="rounded-full h-8 w-8"
                      src={picture}
                      onError={(e) => { e.target.src = './components/icons8-user-24.png'; }}
                    />
                    <ReactMarkdown>{obj.content}</ReactMarkdown>
                  </div>
                  :
                  <div key={key} className='bg-chat_color m-4 p-4 rounded-2xl leading-7 font-thin'>
                    <ReactMarkdown>{obj.content}</ReactMarkdown>
                  </div>
              ))}
              {loading ? <div className="flex ml-4 gap-x-2 bg-chat_color m-4 p-4 rounded-2xl">
                <Loader2 className="animate-spin h-6 w-6 text-purple-500" />
              </div> : null}
            </div>

            <div className="h-[650px] w-[980px]">
              <CodeView></CodeView>
              {codeloading ? <div className="p-10 pt-72 pl-[470px] bg-gray-900 opacity-80 relative bottom-[659px] rounded-lg w-full h-full items-center justify-center">
                <Loader2Icon className="animate-spin h-20 w-20 text-white " />
                <h2 className="text-white relative right-4">Generating files.....</h2>
              </div> : null}
            </div>
          </div>

          <div className="relative">
            <textarea
              onKeyDown={handleKeyDown}
              value={ChatViewMessages}
              onChange={(e) => setChatViewMessages(e.target.value)}
              placeholder="How can GenWeb AI help you today"
              className="custom-scrollbar resize-none min-w-[480px] left-3 min-h-32 max-h-96 p-2 pr-12 pb-5 absolute bottom-2 bg-gray-900 text-white border border-gray-700 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <Button
              onClick={() => GetAiResponse(ChatViewMessages)}
              className='text-white absolute bottom-24 left-[450px] bg-purple-800 hover:bg-purple-600 hover:text-white h-7 w-7'
              variant='ghost'
              size='icon'
            >
              <ChevronRight></ChevronRight>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}