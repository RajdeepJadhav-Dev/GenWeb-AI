import React, { useEffect } from 'react'
import { useState,useRef } from 'react';
import {
    SandpackProvider,
    SandpackLayout,
    SandpackCodeEditor,
    SandpackPreview,
    SandpackFileExplorer 
  } from "@codesandbox/sandpack-react";
import Lookup from '@/data/Lookup';
import { AiCodeResponse, PromptState } from '@/atoms';
import { useRecoilValue } from 'recoil';
import SandPackClient from './SandPackClient';


const CodeView = () => {
 
      const [activeTab,setactiveTab] = useState('code');
      const [files,setfiles] = useState(Lookup?.DEFAULT_FILE);
      let newfiledata = useRecoilValue(AiCodeResponse);
      if(newfiledata){
        newfiledata = JSON.parse(newfiledata)
      }
     
      
    
   const prevfiledata = useRef(null); 

      useEffect(() => {
        if(JSON.stringify(newfiledata) === JSON.stringify(prevfiledata.current)){return;}
      setfiles((files) => ({
        ...files,
        ...newfiledata.files
    }));// Merge correctly
    prevfiledata.current = newfiledata
      }, [newfiledata]);

  return (
    <>
    <div>
        <div className='bg-[#181818] w-full p-2 border'>
        <div className='text-white flex items-center flex-wrap shrink-0 bg-black p-1 w-[140px] gap-3 justify-center rounded-xl'>
            <h2 onClick={()=>setactiveTab('code')} className={`text-sm cursor-pointer ${activeTab=='code' ? 'text-blue-500 bg-blue-500 bg-opacity-25 p-1 px-2 rounded-full' : ''}`}>Code</h2>
            <h2 onClick={()=>setactiveTab('preview')}className={`text-sm cursor-pointer ${activeTab=='preview' ? 'text-blue-500 bg-blue-500 bg-opacity-25 p-1 px-2 rounded-full' : ''}`}>Preview</h2>
        </div>
        </div>
    </div>


    <SandpackProvider files={files}   options={{externalResources:['https://cdn.tailwindcss.com']}} customSetup={{
    dependencies: {
        ...Lookup.DEPENDANCY
    }
}} template="react" theme={'dark'}>
    <SandpackLayout>
   { activeTab=='code' ? <>
    <SandpackFileExplorer style={{height:'80vh'}}/>
      <SandpackCodeEditor style={{height:'80vh'}} />
      </>
        :
      <>
     <SandPackClient></SandPackClient>
      </>
       }
    </SandpackLayout>
  </SandpackProvider >
  </>
  )
}

export default CodeView