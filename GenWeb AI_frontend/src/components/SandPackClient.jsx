import { useSandpack } from "@codesandbox/sandpack-react";
import React, { useEffect } from "react";
import { useRef } from "react";
import {
    SandpackProvider,
    SandpackLayout,
    SandpackCodeEditor,
    SandpackPreview,
    SandpackFileExplorer 
  } from "@codesandbox/sandpack-react";
import { useRecoilValue } from "recoil";
import { action } from "@/atoms";


//for the export and deploy section
export default function SandPackClient(){

    // to know the use wants to deploy the code or export it
       const Navaction = useRecoilValue(action)

        const previewRef = useRef();
        const {SandPack} = useSandpack();



        useEffect(()=>{
          GetSandPackClient();
            },[SandPack,Navaction])

        const GetSandPackClient=async ()=>{
            const client = previewRef.current?.getClient();
            if(client){
                const result = await client.getCodeSandboxURL();
                if(Navaction=='Deploy'){
                  window.open('https://'+result?.sandboxId+'.csb.app')
              }else if(Navaction=='Export'){
                window.open(result?.editorUrl);
              }

            }
        }

    return(
        <>
         <SandpackPreview
          ref = {previewRef}
          style={{height:'80vh'}} showNavigator={true}/>

        </>

    );
}