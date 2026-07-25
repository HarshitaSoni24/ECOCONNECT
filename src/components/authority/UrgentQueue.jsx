import { useComplaints } from '../../context/ComplaintsContext'
import { StatusBadge } from '../shared/Badges'

export default function UrgentQueue() {
  const { complaints, updateComplaintStatus } = useComplaints()

  const queue = complaints
    .filter((complaint) => complaint.severity === 'high')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  return (
    <div className="urgent-queue">
      <h2>Urgent Queue</h2>
      {queue.length === 0 ? (
        <p className="empty-state">
          🌤️ No urgent complaints right now — the city breathes easy.
        </p>
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
                    disabled={complaint.status !== 'submitted'}
                  >
                    Acknowledge
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => updateComplaintStatus(complaint.id, 'resolved')}
                    disabled={complaint.status === 'resolved'}
                  >
                    Mark resolved
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
