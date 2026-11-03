import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import { Leaf, Mail, Lock, Key, ShieldCheck, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import './login.css'

export default function AuthorityLoginPage() {
  const { signIn, signOut } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [accessCode, setAccessCode] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password || !accessCode) {
      toast.error('Please fill in all the required credentials.')
      return
    }
    if (accessCode !== import.meta.env.VITE_AUTHORITY_CODE) {
      toast.error('Invalid official access code.')
      return
    }

    try {
      const role = await signIn(email, password)
      if (role !== 'authority') {
        toast.error('This account does not have authority access.')
        await signOut()
        return
      }
      toast.success('Authorized officer credentials verified. Access granted.')
      navigate('/authority')
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div className="auth-page-container">
      {/* Ambient background blob */}
      <div className="ambient-blob blob-2" style={{ top: '10%', right: '10%' }}></div>

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
          <div className="official-access-tag">
            <ShieldCheck size={14} /> Official Access Only
          </div>
          <h2>Authority Access</h2>
          <p>Sign in using your certified credentials and municipal security key code.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form-clean">
          <div className="form-group-clean">
            <label htmlFor="email">Official Email</label>
            <div className="input-with-icon-wrapper">
              <Mail size={16} className="input-icon-clean" />
              <input 
                id="email"
                type="email" 
                placeholder="officer@hyderabad.gov.in" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group-clean">
            <label htmlFor="password">Security Password</label>
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

          <div className="form-group-clean">
            <label htmlFor="accessCode">Official Access Code</label>
            <div className="input-with-icon-wrapper">
              <Key size={16} className="input-icon-clean" />
              <input 
                id="accessCode"
                type="password" 
                placeholder="MUNICIPAL-KEY-XXXX" 
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary btn-auth-submit authority">
            Verify Credentials <ChevronRight size={16} />
          </button>
        </form>

        <div className="auth-card-footer">
          <p>Not municipal authority? <Link to="/login">Go to citizen/NGO login</Link></p>
          <div className="footer-links-mini">
            <Link to="/">Back to Homepage</Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
