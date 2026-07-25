import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import CitizenPortal from './pages/CitizenPortal'
import NgoPortal from './pages/NgoPortal'
import AuthorityDashboard from './pages/AuthorityDashboard'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/citizen" element={<CitizenPortal />} />
      <Route path="/ngo" element={<NgoPortal />} />
      <Route path="/authority" element={<AuthorityDashboard />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
