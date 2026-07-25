import { useComplaints } from '../../context/ComplaintsContext'

export default function StatsBar() {
  const { complaints } = useComplaints()

  const highSeverity = complaints.filter((complaint) => complaint.severity === 'high')
  const pending = highSeverity.filter((complaint) => complaint.status === 'submitted')
  const inProgress = highSeverity.filter((complaint) => complaint.status === 'routed')
  const resolved = highSeverity.filter((complaint) => complaint.status === 'resolved')

  const stats = [
    { label: 'Total high severity', value: highSeverity.length },
    { label: 'Pending', value: pending.length },
    { label: 'In progress', value: inProgress.length },
    { label: 'Resolved', value: resolved.length },
  ]

  return (
    <div className="stats-bar">
      {stats.map((stat) => (
        <div className="stat-tile" key={stat.label}>
          <span className="stat-value">{stat.value}</span>
          <span className="stat-label">{stat.label}</span>
        </div>
      ))}
    </div>
  )
}
