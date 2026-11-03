import { useComplaints } from '../../context/ComplaintsContext'
import { StatusBadge } from '../shared/Badges'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, 
  MapPin, 
  Check, 
  Sparkles, 
  Compass,
  AlertCircle,
  Clock
} from 'lucide-react'
import { toast } from 'sonner'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
}

const cardVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, x: -100, transition: { duration: 0.25 } }
}

export default function ComplaintQueue({ onSelectForDrive }) {
  const { complaints, updateComplaint } = useComplaints()

  const queue = complaints.filter((complaint) => complaint.severity === 'moderate')

  const handleAccept = async (id) => {
    try {
      await updateComplaint(id, { status: 'routed' })
      toast.success('Complaint accepted into local workspace progress.')
    } catch (err) {
      toast.error('Failed to accept complaint.')
    }
  }

  return (
    <div className="complaint-queue-modern">
      {queue.length === 0 ? (
        <div className="empty-state-modern-pane">
          <div className="empty-icon-wrap">🌤️</div>
          <h3>All Clear!</h3>
          <p>No moderate severity ecological complaints in the queue. The local ecosystem is currently balanced!</p>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          <motion.div 
            className="queue-cards-list"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            layout
          >
            {queue.map((complaint) => (
              <motion.div
                className="complaint-card-modern"
                key={complaint.id}
                variants={cardVariants}
                exit="exit"
                layoutId={`queue-card-${complaint.id}`}
                whileHover={{ y: -2, boxShadow: 'var(--shadow-card-hover)' }}
              >
                {complaint.image_url && (
                  <div className="complaint-card-media">
                    <img className="complaint-thumb-modern" src={complaint.image_url} alt="Evidence" />
                    <div className="media-overlay-badge">
                      <AlertCircle size={10} /> Moderate Severity
                    </div>
                  </div>
                )}
                
                <div className="complaint-card-content-modern">
                  <p className="complaint-text-modern">{complaint.text}</p>
                  
                  <div className="complaint-meta-grid-modern">
                    <div className="meta-item-modern">
                      <Compass size={12} />
                      <span>{complaint.lat?.toFixed(5)}, {complaint.lng?.toFixed(5)}</span>
                    </div>
                    <div className="meta-item-modern">
                      <Clock size={12} />
                      <span>{new Date(complaint.created_at).toLocaleDateString()} at {new Date(complaint.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>

                  <div className="complaint-card-actions-row">
                    <div className="badges-group">
                      <StatusBadge status={complaint.status} />
                    </div>

                    <div className="actions-buttons">
                      <button
                        type="button"
                        className="btn-sm btn-accept"
                        onClick={() => handleAccept(complaint.id)}
                        disabled={complaint.status === 'routed'}
                      >
                        <Check size={13} /> {complaint.status === 'routed' ? 'Accepted' : 'Accept'}
                      </button>
                      <button
                        type="button"
                        className="btn-sm btn-secondary btn-create-drive"
                        onClick={() => {
                          onSelectForDrive(complaint)
                          toast.info('Complaint coordinates linked to drive coordinator.')
                        }}
                      >
                        <Sparkles size={13} /> Organise Drive
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}
