import { useState } from 'react'
import { toast } from 'sonner'
import { useComplaints } from '../../context/ComplaintsContext'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../api/supabase'
import { StatusBadge } from '../shared/Badges'

function UrgentCard({ complaint }) {
  const { updateComplaint } = useComplaints()
  const { user } = useAuth()
  const [message, setMessage] = useState('')
  const [posting, setPosting] = useState(false)

  const handlePostUpdate = async () => {
    if (!message.trim()) return

    setPosting(true)
    try {
      const { error } = await supabase.from('progress_updates').insert({
        complaint_id: complaint.id,
        author_id: user.id,
        message: message.trim(),
      })
      if (error) throw error
      setMessage('')
      toast.success('Update posted.')
    } catch (error) {
      toast.error(error.message ?? 'Failed to post update.')
    } finally {
      setPosting(false)
    }
  }

  return (
    <div className="complaint-card">
      {complaint.image_url && (
        <img className="complaint-thumb" src={complaint.image_url} alt="" />
      )}
      <div className="complaint-body">
        <p className="complaint-text">{complaint.text}</p>
        <p className="complaint-meta">
          {complaint.lat?.toFixed(5)}, {complaint.lng?.toFixed(5)}
        </p>
        <p className="complaint-meta">
          {new Date(complaint.created_at).toLocaleString()}
        </p>
        <div className="card-badges">
          <StatusBadge status={complaint.status} />
        </div>
        <div className="card-actions">
          <button
            type="button"
            onClick={() => updateComplaint(complaint.id, { status: 'routed' })}
            disabled={complaint.status !== 'submitted'}
          >
            Acknowledge
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => updateComplaint(complaint.id, { status: 'resolved' })}
            disabled={complaint.status === 'resolved'}
          >
            Mark resolved
          </button>
        </div>
        <div className="progress-update-form">
          <input
            type="text"
            placeholder="Post a progress update..."
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
          <button
            type="button"
            className="btn-secondary"
            onClick={handlePostUpdate}
            disabled={posting || !message.trim()}
          >
            {posting ? 'Posting...' : 'Post update'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function UrgentQueue() {
  const { complaints } = useComplaints()

  const queue = complaints
    .filter((complaint) => complaint.severity === 'high')
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

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
            <UrgentCard key={complaint.id} complaint={complaint} />
          ))}
        </div>
      )}
    </div>
  )
}
