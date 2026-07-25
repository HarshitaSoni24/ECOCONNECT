import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './login.css'

const ROLES = [
  { role: 'citizen', label: 'Citizen', path: '/citizen', icon: '🧍' },
  { role: 'ngo', label: 'NGO', path: '/ngo', icon: '🤝' },
  { role: 'authority', label: 'Authority', path: '/authority', icon: '🏛️' },
]

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = (role, path) => {
    login(role)
    navigate(path)
  }

  return (
    <section className="login-page">
      <div className="login-card">
        <h1>EcoConnect 🌿</h1>
        <p className="login-tagline">Report. Resolve. Restore.</p>
        <p className="login-hint">Select a role to continue (no real authentication yet).</p>
        <div className="login-roles">
          {ROLES.map(({ role, label, path, icon }) => (
            <button key={role} type="button" onClick={() => handleLogin(role, path)}>
              <span className="login-role-icon">{icon}</span>
              {label}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
