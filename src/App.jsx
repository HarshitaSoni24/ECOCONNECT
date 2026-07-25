import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import CitizenPortal from './pages/CitizenPortal'
import NgoPortal from './pages/NgoPortal'
import AuthorityDashboard from './pages/AuthorityDashboard'
import Navbar from './components/shared/Navbar'
import { useAuth } from './context/AuthContext'

function App() {
  const { role } = useAuth()

  return (
    <>
      {role && <Navbar />}
      <main className="app-main">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/citizen" element={<CitizenPortal />} />
          <Route path="/ngo" element={<NgoPortal />} />
          <Route path="/authority" element={<AuthorityDashboard />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
    </>
  )
}

export default App
