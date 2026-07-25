import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './styles/theme.css'
import './styles/shared.css'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ComplaintsProvider } from './context/ComplaintsContext.jsx'
import { DrivesProvider } from './context/DrivesContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ComplaintsProvider>
          <DrivesProvider>
            <App />
          </DrivesProvider>
        </ComplaintsProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
