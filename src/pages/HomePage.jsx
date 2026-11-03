import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  User,
  Users,
  Landmark,
  Leaf,
  CheckCircle,
  TrendingUp,
  Calendar,
  ChevronRight,
  Sparkles
} from 'lucide-react'
import './login.css'

const STATS = [
  { value: '14,820+', label: 'Issues Resolved', icon: <CheckCircle size={18} /> },
  { value: '3,240+', label: 'Registered Citizens', icon: <User size={18} /> },
  { value: '180+', label: 'Active Green Drives', icon: <Calendar size={18} /> },
  { value: '98.2%', label: 'Resolution Rate', icon: <TrendingUp size={18} /> },
]

const STEPS = [
  { 
    number: '01',
    icon: '🌱', 
    title: 'Report', 
    description: 'Instantly file environmental hazards with photo and GPS location tagging.' 
  },
  { 
    number: '02',
    icon: '🔍', 
    title: 'AI Assess', 
    description: 'EcoConnect categorizes and determines urgency in real-time.' 
  },
  { 
    number: '03',
    icon: '🌿', 
    title: 'Act', 
    description: 'Local authorities or NGO mobilizers coordinate response teams.' 
  },
  { 
    number: '04',
    icon: '🌳', 
    title: 'Restore', 
    description: 'Issue is resolved, logged on the ledger, and tracked publicly.' 
  },
]

const PORTALS = [
  {
    role: 'citizen',
    title: 'Citizen Portal',
    description: 'Report illegal dumping, water clogging, or open trash. Follow your complaint state live.',
    actionText: 'Enter Citizen Portal',
    icon: <User size={24} />,
    color: 'var(--leaf)',
    path: '/login'
  },
  {
    role: 'ngo',
    title: 'NGO Workspace',
    description: 'Access hot-spot mappings, coordinate green volunteers, and host local clean-up events.',
    actionText: 'Enter NGO Workspace',
    icon: <Users size={24} />,
    color: 'var(--moss)',
    path: '/login'
  },
  {
    role: 'authority',
    title: 'Official Dashboard',
    description: 'Approve, route, and assign complaints to field staff. View analytical heatmaps.',
    actionText: 'Access Authority Portal',
    icon: <Landmark size={24} />,
    color: 'var(--forest)',
    path: '/authority-login'
  }
]

export default function HomePage() {
  const navigate = useNavigate()

  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="home-container">
      {/* 1. STICKY TOP NAVIGATION */}
      <header className="home-navbar">
        <div className="nav-brand">
          <Leaf className="brand-icon" size={24} />
          <span>EcoConnect</span>
        </div>
        <nav className="nav-links-wrapper">
          <button type="button" className="nav-link-btn" onClick={() => scrollToSection('how-it-works')}>
            How it works
          </button>
          <button type="button" className="nav-link-btn" onClick={() => scrollToSection('portals')}>
            Portals
          </button>
          <button type="button" className="nav-link-btn" onClick={() => navigate('/login')}>
            Login
          </button>
          <button type="button" className="btn-nav-cta" onClick={() => navigate('/register')}>
            Get started
          </button>
        </nav>
      </header>

      {/* BACKGROUND BLOBS */}
      <div className="ambient-blob home-blob-1"></div>
      <div className="ambient-blob home-blob-2"></div>

      {/* 2. HERO SECTION */}
      <section className="home-hero-section">
        <div className="hero-grid-container">
          <motion.div 
            className="hero-left-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="hero-announcement">
              <Sparkles size={14} /> Hyderabad Environmental Action Initiative
            </span>
            <h1 className="hero-main-title">
              Fostering cleaner, safer, and <em>greener</em> neighborhoods.
            </h1>
            <p className="hero-main-desc">
              EcoConnect bridges Hyderabad’s active citizens, passionate environmental NGOs, and municipal authorities to report, track, and collaboratively solve environmental challenges in real-time.
            </p>
            <div className="hero-cta-group">
              <button 
                type="button" 
                className="btn-primary btn-hero-action" 
                onClick={() => navigate('/register')}
              >
                Report an issue <ChevronRight size={18} />
              </button>
              <button 
                type="button" 
                className="btn-secondary btn-hero-action" 
                onClick={() => scrollToSection('portals')}
              >
                Explore Portals
              </button>
            </div>
          </motion.div>

          {/* STATS COMPONENT INSIDE HERO */}
          <motion.div 
            className="hero-right-content"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="stats-box-grid">
              {STATS.map((stat, idx) => (
                <motion.div 
                  key={stat.label} 
                  className="home-stat-card"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1, duration: 0.5 }}
                >
                  <div className="home-stat-icon">{stat.icon}</div>
                  <h3 className="home-stat-value">{stat.value}</h3>
                  <p className="home-stat-label">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="home-how-section">
        <div className="section-title-block">
          <span className="section-tag">Methodology</span>
          <h2>A Growth-Minded Pipeline</h2>
          <p>EcoConnect uses a transparent, four-stage environmental resolution pipeline to process and act on reported hazards.</p>
        </div>

        <div className="how-steps-flex-grid">
          {STEPS.map((step, idx) => (
            <motion.div 
              key={step.title}
              className="how-step-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
            >
              <div className="how-step-badge">{step.number}</div>
              <div className="how-step-icon">{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. PORTALS GATEWAY SECTION */}
      <section id="portals" className="home-portals-section">
        <div className="section-title-block">
          <span className="section-tag">Access Points</span>
          <h2>Explore Dedicated Workspaces</h2>
          <p>Login directly to your designated portal or create an account to begin coordinating actions.</p>
        </div>

        <div className="portals-cards-container">
          {PORTALS.map((portal, idx) => (
            <motion.div
              key={portal.title}
              className="home-portal-entry-card"
              whileHover={{ y: -8 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
            >
              <div className="portal-icon-container" style={{ color: portal.color, background: 'var(--sage-deep)' }}>
                {portal.icon}
              </div>
              <h3>{portal.title}</h3>
              <p>{portal.description}</p>
              <button 
                type="button" 
                className="btn-portal-entry"
                onClick={() => navigate(portal.path)}
                style={{ '--btn-brand-color': portal.color }}
              >
                {portal.actionText} <ChevronRight size={16} />
              </button>
            </motion.div>
          ))}
        </div>

        <div className="portals-alternative-cta">
          <p>New to Hyderabad’s green initiative? <button type="button" onClick={() => navigate('/register')}>Create an account today</button></p>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="home-footer">
        <div className="footer-top-panel">
          <div className="footer-brand-side">
            <div className="nav-brand">
              <Leaf size={22} className="brand-icon" />
              <span>EcoConnect</span>
            </div>
            <p className="footer-tagline">Report. Resolve. Restore.</p>
          </div>
          <div className="footer-links-side">
            <a href="#privacy">Privacy Policy</a>
            <span className="footer-bullet">•</span>
            <a href="#terms">Terms of Service</a>
            <span className="footer-bullet">•</span>
            <a href="#support">Help & Support</a>
          </div>
        </div>
        <div className="footer-bottom-panel">
          <p className="copyright-label">&copy; {new Date().getFullYear()} EcoConnect Hyderabad. All rights reserved.</p>
          <span className="built-tag">Built in Hyderabad 🌿</span>
        </div>
      </footer>
    </div>
  )
}
