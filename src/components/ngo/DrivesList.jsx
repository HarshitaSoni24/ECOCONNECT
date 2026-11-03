import { useState } from 'react'
import { useDrives } from '../../context/DrivesContext'
import { useComplaints } from '../../context/ComplaintsContext'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, 
  Users, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  Award,
  Sparkles,
  ClipboardList
} from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 }
}

function DriveCard({ drive, volunteerCount, onComplete }) {
  return (
    <motion.div 
      className="drive-card-modern"
      variants={itemVariants}
      layoutId={drive.id}
      whileHover={{ y: -3, boxShadow: 'var(--shadow-card-hover)' }}
    >
      <div className="drive-card-header-modern">
        <div className="drive-icon-pill">🌿</div>
        <div className="drive-meta-title-group">
          <h4>{drive.title}</h4>
          <span className="drive-date-badge">
            <Calendar size={12} /> {drive.date}
          </span>
        </div>
      </div>

      <div className="drive-card-body-modern">
        <p className="drive-meta-item-modern">
          <MapPin size={13} />
          <span>{drive.lat.toFixed(5)}, {drive.lng.toFixed(5)} ({drive.radius_km} km radius)</span>
        </p>
        <p className="drive-meta-item-modern">
          <Users size={13} />
          <span><strong>{volunteerCount}</strong> active volunteers signed up</span>
        </p>
        {drive.note && (
          <p className="drive-desc-snippet">
            &ldquo;{drive.note}&rdquo;
          </p>
        )}
      </div>

      <div className="drive-card-footer-modern">
        <span className={`drive-status-pill ${drive.status}`}>
          {drive.status === 'upcoming' ? '📅 Upcoming' : '✅ Completed'}
        </span>

        {drive.status === 'upcoming' && (
          <button 
            type="button" 
            className="btn-complete-drive"
            onClick={() => onComplete(drive)}
          >
            Mark Completed <ArrowRight size={13} />
          </button>
        )}
      </div>
    </motion.div>
  )
}

export default function DrivesList() {
  const { drives, updateDrive, volunteerCount } = useDrives()
  const { updateComplaint } = useComplaints()
  const [activeTab, setActiveTab] = useState('upcoming') // 'upcoming' | 'completed'

  const upcoming = drives.filter((drive) => drive.status === 'upcoming')
  const past = drives.filter((drive) => drive.status === 'completed')

  const handleComplete = (drive) => {
    updateDrive(drive.id, { status: 'completed' })
    if (drive.complaint_id) {
      updateComplaint(drive.complaint_id, { status: 'resolved' })
    }
  }

  const currentList = activeTab === 'upcoming' ? upcoming : past

  return (
    <div className="drives-list-modern">
      <div className="list-title-header">
        <ClipboardList size={18} className="title-icon" />
        <h2>Cleanup Campaigns</h2>
      </div>

      <div className="tab-navigation-bar">
        <button 
          type="button"
          className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Active Plans 
          <span className="tab-count-bubble">{upcoming.length}</span>
          {activeTab === 'upcoming' && <motion.div className="active-indicator-bar" layoutId="activeTabIndicator" />}
        </button>
        <button 
          type="button"
          className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          Past Operations 
          <span className="tab-count-bubble">{past.length}</span>
          {activeTab === 'completed' && <motion.div className="active-indicator-bar" layoutId="activeTabIndicator" />}
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="drives-tab-pane-content"
        >
          {currentList.length === 0 ? (
            <motion.div 
              className="empty-state-modern-pane"
              variants={itemVariants}
            >
              {activeTab === 'upcoming' ? (
                <>
                  <div className="empty-icon-wrap">🌱</div>
                  <h3>No Active Plans</h3>
                  <p>Organize a green campaign above to get started. Volunteers will see details instantly.</p>
                </>
              ) : (
                <>
                  <div className="empty-icon-wrap">🌳</div>
                  <h3>No Completed Operations</h3>
                  <p>Restore the ecosystem! Finish active campaigns to view success statistics here.</p>
                </>
              )}
            </motion.div>
          ) : (
            <div className="drives-cards-container">
              {currentList.map((drive) => (
                <DriveCard
                  key={drive.id}
                  drive={drive}
                  volunteerCount={volunteerCount(drive.id)}
                  onComplete={handleComplete}
                />
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
