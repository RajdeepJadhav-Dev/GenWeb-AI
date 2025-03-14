import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RecoilRoot } from 'recoil'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter, Routes,Route} from "react-router-dom";
import Workspace from './workspace.jsx'




createRoot(document.getElementById('root')).render(
 
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID_KEY}>
 <RecoilRoot>
  <StrictMode>
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App/>}/>
      <Route path="/Workspace/:WorkspaceId" element={<Workspace />} />
    </Routes>
    </BrowserRouter>
  </StrictMode>
  </RecoilRoot>
  </GoogleOAuthProvider>
  ,

)
