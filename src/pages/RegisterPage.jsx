import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import { Leaf, User, Users, Mail, Lock, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import './login.css'

export default function RegisterPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('citizen') // 'citizen' or 'ngo'

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!fullName || !email || !password) {
      toast.error('Please fill in all the required fields.')
      return
    }

    try {
      const userRole = await signUp(email, password, fullName, role)
      toast.success('Account created! Welcome to EcoConnect!')
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
          <h2>Create Account</h2>
          <p>Join Hyderabad's community-driven environmental action network.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form-clean">
          {/* ROLE TOGGLE ROW */}
          <div className="form-group-clean">
            <label>I want to join as a:</label>
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
            <label htmlFor="fullName">Full Name</label>
            <div className="input-with-icon-wrapper">
              <User size={16} className="input-icon-clean" />
              <input 
                id="fullName"
                type="text" 
                placeholder="John Doe" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
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
                placeholder="Min. 8 characters" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary btn-auth-submit">
            Create Account <ChevronRight size={16} />
          </button>
        </form>

        <div className="auth-card-footer">
          <p>Already have an account? <Link to="/login">Sign In</Link></p>
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
