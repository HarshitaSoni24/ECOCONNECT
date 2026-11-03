import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import { Leaf, Mail, Lock, ChevronRight, User, Users } from 'lucide-react'
import { toast } from 'sonner'
import './login.css'

export default function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('citizen') // Portal toggle (display only)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Please enter both email and password.')
      return
    }

    try {
      const userRole = await signIn(email, password)
      toast.success('Welcome back!')
      navigate(`/${userRole}`)
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div className="auth-page-container">
      {/* Ambient background blob */}
      <div className="ambient-blob blob-1"></div>

      <motion.div 
        className="auth-card-clean"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="auth-brand-header">
          <Link to="/" className="brand-link-logo">
            <Leaf size={24} className="brand-icon" />
            <span>EcoConnect</span>
          </Link>
          <h2>Welcome Back</h2>
          <p>Access your citizen or NGO workspace to continue driving environmental impact.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form-clean">
          {/* MOCK ROLE TOGGLE FOR EASY TESTING */}
          <div className="form-group-clean">
            <label>Select Portal Workspace</label>
            <div className="auth-role-toggle-grid">
              <button
                type="button"
                className={`role-toggle-btn-clean ${role === 'citizen' ? 'active' : ''}`}
                onClick={() => setRole('citizen')}
              >
                <User size={16} />
                <span>Citizen</span>
              </button>
              <button
                type="button"
                className={`role-toggle-btn-clean ${role === 'ngo' ? 'active' : ''}`}
                onClick={() => setRole('ngo')}
              >
                <Users size={16} />
                <span>NGO Mobilizer</span>
              </button>
            </div>
          </div>

          <div className="form-group-clean">
            <label htmlFor="email">Email Address</label>
            <div className="input-with-icon-wrapper">
              <Mail size={16} className="input-icon-clean" />
              <input 
                id="email"
                type="email" 
                placeholder="you@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group-clean">
            <label htmlFor="password">Password</label>
            <div className="input-with-icon-wrapper">
              <Lock size={16} className="input-icon-clean" />
              <input 
                id="password"
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="forgot-password-link">
            <a href="#forgot">Forgot password?</a>
          </div>

          <button type="submit" className="btn-primary btn-auth-submit">
            Sign In <ChevronRight size={16} />
          </button>
        </form>

        <div className="auth-card-footer">
          <p>Don't have an account? <Link to="/register">Create an account</Link></p>
          <div className="footer-links-mini">
            <Link to="/">Back to Homepage</Link>
            <span className="dot-divider">•</span>
            <Link to="/authority-login">Official Access</Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
