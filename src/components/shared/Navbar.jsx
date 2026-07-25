import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Navbar.css'

const ROLE_LABELS = {
  citizen: 'Citizen',
  ngo: 'NGO',
  authority: 'Authority',
}

export default function Navbar() {
  const { role, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="navbar">
      <span className="navbar-brand">EcoConnect 🌿</span>
      <div className="navbar-right">
        <span className="role-pill">{ROLE_LABELS[role] ?? role}</span>
        <button type="button" className="navbar-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  )
}
