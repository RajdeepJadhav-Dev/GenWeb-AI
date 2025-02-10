import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RecoilRoot } from 'recoil'
import { GoogleOAuthProvider } from '@react-oauth/google';




createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID_KEY}>
 <RecoilRoot>
  <StrictMode>
    <App />
  </StrictMode>
  </RecoilRoot>
  </GoogleOAuthProvider>,

)
