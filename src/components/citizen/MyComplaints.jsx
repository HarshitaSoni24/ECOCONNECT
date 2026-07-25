import { useComplaints } from '../../context/ComplaintsContext'
import { StatusBadge, SeverityBadge } from '../shared/Badges'

export default function MyComplaints() {
  const { complaints } = useComplaints()

  const sorted = [...complaints].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  )

  return (
    <div className="my-complaints">
      <h2>My Complaints</h2>
      {sorted.length === 0 ? (
        <p className="empty-state">🌱 No complaints yet — report one to get started.</p>
      ) : (
        <div className="complaint-list">
          {sorted.map((complaint) => (
            <div className="complaint-card" key={complaint.id}>
              {complaint.imageUrl && (
                <img
                  className="complaint-thumb"
                  src={complaint.imageUrl}
                  alt=""
                />
              )}
              <div className="complaint-body">
                <p className="complaint-text">{complaint.text}</p>
                <p className="complaint-meta">
                  {new Date(complaint.createdAt).toLocaleString()}
                </p>
                <div className="card-badges">
                  <StatusBadge status={complaint.status} />
                  <SeverityBadge severity={complaint.severity} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
