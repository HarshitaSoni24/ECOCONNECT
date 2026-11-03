import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Leaf, User, Users, Building, Sun, Moon } from 'lucide-react'
import './Navbar.css'

const ROLE_LABELS = {
  citizen: 'Citizen',
  ngo: 'NGO',
  authority: 'Authority',
}

const getRoleIcon = (role) => {
  switch (role) {
    case 'citizen':
      return <User size={16} />
    case 'ngo':
      return <Users size={16} />
    case 'authority':
      return <Building size={16} />
    default:
      return null
  }
}

export default function Navbar() {
  const { profile, signOut } = useAuth()
  const role = profile?.role
  const navigate = useNavigate()
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'))
  }

  const RoleIcon = getRoleIcon(role)

  return (
    <header className="navbar">
      <span className="navbar-brand">
        <Leaf size={24} /> EcoConnect
      </span>
      <div className="navbar-right">
        <span className="role-pill">
          {RoleIcon} {ROLE_LABELS[role] ?? role}
        </span>
        <button type="button" className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button type="button" className="navbar-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  )
}
