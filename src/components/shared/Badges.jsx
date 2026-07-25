// "Status as growth": complaints move through a plant-like lifecycle
// rather than a plain workflow label.
const STATUS_CONTENT = {
  submitted: { icon: '🌱', label: 'Reported' },
  routed: { icon: '🌿', label: 'In progress' },
  resolved: { icon: '🌳', label: 'Resolved' },
}

const SEVERITY_LABELS = {
  pending: 'Pending',
  low: 'Low',
  moderate: 'Moderate',
  high: 'High',
}

export function StatusBadge({ status }) {
  const content = STATUS_CONTENT[status]
  return (
    <span className="status-badge">
      {content ? `${content.icon} ${content.label}` : status}
    </span>
  )
}

export function SeverityBadge({ severity }) {
  return (
    <span className={`severity-badge severity-${severity}`}>
      {SEVERITY_LABELS[severity] ?? severity}
    </span>
  )
}
