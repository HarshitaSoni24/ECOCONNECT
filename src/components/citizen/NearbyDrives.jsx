import { useDrives } from "../../context/DrivesContext";
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Clock, Check, HeartHandshake, MapPin } from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const rowVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 }
}

export default function NearbyDrives() {
  const { drives, volunteer, unvolunteer, isVolunteering } = useDrives();
  const upcoming = drives.filter((d) => d.status === "upcoming");

  return (
    <div className="drives-feed-premium section-card">
      <div className="feed-header">
        <HeartHandshake className="header-icon" size={20} />
        <h3>Cleanup Drives Near You</h3>
      </div>
      
      {upcoming.length === 0 ? (
        <div className="empty-state-modern-pane small">
          <div className="empty-icon-wrap mini">🌤️</div>
          <p>No drives near you right now — the community is doing great!</p>
        </div>
      ) : (
        <motion.div 
          className="table-responsive"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <table className="drives-table-premium">
            <thead>
              <tr>
                <th>Drive details</th>
                <th>Schedule</th>
                <th>Operation</th>
              </tr>
            </thead>
            <tbody>
              {upcoming.map((d) => {
                const isSignedUp = isVolunteering(d.id);
                return (
                  <motion.tr 
                    key={d.id} 
                    className="drive-row-strip"
                    variants={rowVariants}
                    whileHover={{ scale: 1.005, backgroundColor: 'var(--sage-deep)' }}
                  >
                    <td className="drive-main-cell">
                      <div className="drive-title-group">
                        <span className="drive-bullet">🌱</span>
                        <strong>{d.title}</strong>
                      </div>
                      {d.note && <p className="drive-note-modern">{d.note}</p>}
                      <div className="drive-coords-sub">
                        <MapPin size={11} /> {d.lat.toFixed(4)}, {d.lng.toFixed(4)} · {d.radius_km}km
                      </div>
                    </td>
                    <td className="drive-date-cell-modern">
                      <div className="date-time-item">
                        <Calendar size={12} className="meta-icon" /> 
                        <span>{d.date}</span>
                      </div>
                      <div className="date-time-item clock">
                        <Clock size={12} className="meta-icon" /> 
                        <span>{d.time || 'All Day'}</span>
                      </div>
                    </td>
                    <td className="drive-action-cell-modern">
                      <button 
                        type="button"
                        className={`btn-sm btn-join-premium ${isSignedUp ? 'joined' : ''}`} 
                        onClick={() => isSignedUp ? unvolunteer(d.id) : volunteer(d.id)}
                      >
                        {isSignedUp ? (
                          <>
                            <Check size={13} strokeWidth={3} /> Registered
                          </>
                        ) : (
                          "Join Campaign"
                        )}
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </motion.div>
      )}
    </div>
  );
}
