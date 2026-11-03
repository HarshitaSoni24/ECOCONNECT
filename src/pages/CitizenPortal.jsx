import ComplaintForm from '../components/citizen/ComplaintForm'
import MyComplaints from '../components/citizen/MyComplaints'
import '../components/citizen/citizen.css'
import NearbyDrives from "../components/citizen/NearbyDrives";
import { AlertCircle, ArrowRight, CheckCircle2, ClipboardList, HandHeart, Leaf } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useComplaints } from '../context/ComplaintsContext'
import { useDrives } from '../context/DrivesContext'

export default function CitizenPortal() {
  const { profile } = useAuth()
  const { complaints } = useComplaints()
  const { drives } = useDrives()
  const myComplaints = complaints.filter((complaint) => complaint.user_id === profile?.id)
  const activeComplaints = myComplaints.filter((complaint) => complaint.status !== 'resolved').length
  const resolvedComplaints = myComplaints.filter((complaint) => complaint.status === 'resolved').length
  const upcomingDrives = drives.filter((drive) => drive.status === 'upcoming').length
  const firstName = profile?.full_name?.split(' ')[0] || 'there'

  return (
    <section className="citizen-portal" aria-labelledby="citizen-page-title">
      <div className="citizen-welcome">
        <div className="citizen-welcome-copy">
          <div className="eyebrow"><Leaf size={15} /> Your community, your voice</div>
          <h1 id="citizen-page-title">Good to see you, {firstName}.</h1>
          <p>Help keep your neighbourhood clean, safe, and thriving.</p>
        </div>
        <div className="welcome-mark" aria-hidden="true">
          <HandHeart size={30} />
        </div>
      </div>

      <div className="citizen-stat-grid" aria-label="Your EcoConnect summary">
        <div className="citizen-stat-card">
          <span className="stat-icon stat-icon-active"><AlertCircle size={18} /></span>
          <div><strong>{activeComplaints}</strong><span>Open reports</span></div>
        </div>
        <div className="citizen-stat-card">
          <span className="stat-icon stat-icon-resolved"><CheckCircle2 size={18} /></span>
          <div><strong>{resolvedComplaints}</strong><span>Issues resolved</span></div>
        </div>
        <div className="citizen-stat-card">
          <span className="stat-icon stat-icon-drives"><HandHeart size={18} /></span>
          <div><strong>{upcomingDrives}</strong><span>Upcoming drives</span></div>
        </div>
      </div>

      <div className="citizen-content-heading">
        <div>
          <p className="eyebrow eyebrow-dark">Make a difference</p>
          <h2>Report an issue</h2>
        </div>
        <p className="content-heading-note"><ClipboardList size={16} /> It only takes a minute</p>
      </div>

      <div className="citizen-primary-grid">
        <div className="citizen-report-column">
          <ComplaintForm />
        </div>
        <aside className="citizen-next-steps">
          <div className="next-steps-heading">
            <span className="next-steps-icon"><ArrowRight size={17} /></span>
            <div><p className="eyebrow eyebrow-dark">Good to know</p><h3>What happens next?</h3></div>
          </div>
          <ol>
            <li><span>1</span><p><strong>We review your report</strong><br />Our team checks the details and location.</p></li>
            <li><span>2</span><p><strong>It reaches the right people</strong><br />The responsible local team is notified.</p></li>
            <li><span>3</span><p><strong>You see every update</strong><br />Track progress in your complaints list.</p></li>
          </ol>
        </aside>
      </div>

      <div className="citizen-wide-section">
        <NearbyDrives />
      </div>

      <div className="citizen-wide-section citizen-complaints-section">
        <div className="section-card">
          <MyComplaints />
        </div>
      </div>
    </section>
  )
}
