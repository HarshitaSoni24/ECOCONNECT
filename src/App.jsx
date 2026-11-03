import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AuthorityLoginPage from './pages/AuthorityLoginPage'
import CitizenPortal from './pages/CitizenPortal'
import NgoPortal from './pages/NgoPortal'
import AuthorityDashboard from './pages/AuthorityDashboard'
import Navbar from './components/shared/Navbar'
import ProtectedRoute from './components/shared/ProtectedRoute'
import { useAuth } from './context/AuthContext'

function App() {
  const { profile } = useAuth()

  return (
    <>
      {profile && <Navbar />}
      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/authority-login" element={<AuthorityLoginPage />} />
          <Route path="/citizen" element={
          <ProtectedRoute role="citizen"><CitizenPortal /></ProtectedRoute>} />
          <Route path="/ngo" element={
          <ProtectedRoute role="ngo"><NgoPortal /></ProtectedRoute>} />
          <Route path="/authority" element={
          <ProtectedRoute role="authority"><AuthorityDashboard /></ProtectedRoute> } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  )
}

export default App
