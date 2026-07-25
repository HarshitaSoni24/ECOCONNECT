import { useComplaints } from '../../context/ComplaintsContext'
import { StatusBadge } from '../shared/Badges'

export default function ComplaintQueue({ onSelectForDrive }) {
  const { complaints, updateComplaintStatus } = useComplaints()

  const queue = complaints.filter((complaint) => complaint.severity === 'moderate')

  return (
    <div className="complaint-queue">
      <h2>Complaint Queue</h2>
      {queue.length === 0 ? (
        <p className="empty-state">🌤️ No moderate complaints right now.</p>
      ) : (
        <div className="complaint-list">
          {queue.map((complaint) => (
            <div className="complaint-card" key={complaint.id}>
              {complaint.imageUrl && (
                <img className="complaint-thumb" src={complaint.imageUrl} alt="" />
              )}
              <div className="complaint-body">
                <p className="complaint-text">{complaint.text}</p>
                <p className="complaint-meta">
                  {complaint.lat?.toFixed(5)}, {complaint.lng?.toFixed(5)}
                </p>
                <p className="complaint-meta">
                  {new Date(complaint.createdAt).toLocaleString()}
                </p>
                <div className="card-badges">
                  <StatusBadge status={complaint.status} />
                </div>
                <div className="card-actions">
                  <button
                    type="button"
                    onClick={() => updateComplaintStatus(complaint.id, 'routed')}
                    disabled={complaint.status === 'routed'}
                  >
                    Accept
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => onSelectForDrive(complaint)}
                  >
                    Create Drive
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
