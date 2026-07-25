import { useState } from 'react'
import ComplaintQueue from '../components/ngo/ComplaintQueue'
import DriveForm from '../components/ngo/DriveForm'
import DrivesList from '../components/ngo/DrivesList'
import MapView from '../components/shared/MapView'
import { useComplaints } from '../context/ComplaintsContext'
import '../components/ngo/ngo.css'

export default function NgoPortal() {
  const { complaints } = useComplaints()
  const [selectedComplaint, setSelectedComplaint] = useState(null)

  const moderateComplaints = complaints.filter(
    (complaint) => complaint.severity === 'moderate',
  )

  return (
    <section className="ngo-portal">
      <h1>NGO Portal</h1>
      <p>Review nearby complaints and coordinate community response.</p>

      <div className="ngo-layout">
        <div className="ngo-main">
          <MapView
            complaints={moderateComplaints}
            height={300}
            title="Moderate complaints nearby"
          />
          <ComplaintQueue onSelectForDrive={setSelectedComplaint} />
        </div>

        <div className="ngo-sidebar">
          <DriveForm
            key={selectedComplaint?.id ?? 'none'}
            selectedComplaint={selectedComplaint}
            onDriveCreated={() => setSelectedComplaint(null)}
          />
          <DrivesList />
        </div>
      </div>
    </section>
  )
}
