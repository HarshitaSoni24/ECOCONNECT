import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ROLES = [
  { role: 'citizen', label: 'Citizen', path: '/citizen' },
  { role: 'ngo', label: 'NGO', path: '/ngo' },
  { role: 'authority', label: 'Authority', path: '/authority' },
]

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = (role, path) => {
    login(role)
    navigate(path)
  }

  return (
    <section>
      <h1>EcoConnect Login</h1>
      <p>Select a role to continue (no real authentication yet).</p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        {ROLES.map(({ role, label, path }) => (
          <button key={role} type="button" onClick={() => handleLogin(role, path)}>
            {label}
          </button>
        ))}
      </div>
    </section>
  )
}
