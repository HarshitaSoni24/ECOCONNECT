import { useDrives } from '../../context/DrivesContext'
import { useComplaints } from '../../context/ComplaintsContext'

function DriveCard({ drive, onComplete }) {
  return (
    <div className="drive-card">
      <div className="drive-body">
        <p className="drive-title">{drive.title}</p>
        <p className="complaint-meta">
          {drive.lat.toFixed(5)}, {drive.lng.toFixed(5)} · {drive.radiusKm} km radius
        </p>
        <p className="complaint-meta">{drive.date}</p>
        <div className="card-badges">
          <span className={`drive-badge drive-badge-${drive.status}`}>
            {drive.status === 'upcoming' ? '📅 Upcoming' : '✅ Completed'}
          </span>
        </div>
        {drive.status === 'upcoming' && (
          <div className="card-actions">
            <button type="button" onClick={() => onComplete(drive)}>
              Mark completed
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function DrivesList() {
  const { drives, completeDrive } = useDrives()
  const { updateComplaintStatus } = useComplaints()

  const upcoming = drives.filter((drive) => drive.status === 'upcoming')
  const past = drives.filter((drive) => drive.status === 'completed')

  const handleComplete = (drive) => {
    completeDrive(drive.id)
    if (drive.linkedComplaintId) {
      updateComplaintStatus(drive.linkedComplaintId, 'resolved')
    }
  }

  return (
    <div className="drives-list">
      <h2>Cleanup Drives</h2>

      <h3>Upcoming</h3>
      {upcoming.length === 0 ? (
        <p className="empty-state">🌱 No drives planned yet.</p>
      ) : (
        <div className="complaint-list">
          {upcoming.map((drive) => (
            <DriveCard key={drive.id} drive={drive} onComplete={handleComplete} />
          ))}
        </div>
      )}

      <h3>Past</h3>
      {past.length === 0 ? (
        <p className="empty-state">🌳 No completed drives yet.</p>
      ) : (
        <div className="complaint-list">
          {past.map((drive) => (
            <DriveCard key={drive.id} drive={drive} onComplete={handleComplete} />
          ))}
        </div>
      )}
    </div>
  )
}
