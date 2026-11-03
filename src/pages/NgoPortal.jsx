import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, Map, ListTodo, ClipboardEdit } from 'lucide-react'
import ComplaintQueue from '../components/ngo/ComplaintQueue'
import DriveForm from '../components/ngo/DriveForm'
import DrivesList from '../components/ngo/DrivesList'
import MapView from '../components/shared/MapView'
import { useComplaints } from '../context/ComplaintsContext'
import '../components/ngo/ngo.css'

const containerVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      staggerChildren: 0.15,
    },
  },
}

export default function NgoPortal() {
  const { complaints } = useComplaints()
  const [selectedComplaint, setSelectedComplaint] = useState(null)
  const [mapClickedCoords, setMapClickedCoords] = useState(null)

  const moderateComplaints = complaints.filter(
    (complaint) => complaint.severity === 'moderate',
  )

  const handleMapClick = (latlng) => {
    setMapClickedCoords({ lat: latlng.lat, lng: latlng.lng })
  }

  return (
    <motion.section 
      className="ngo-portal"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="portal-header-modern">
        <div className="portal-badge-modern">
          <Shield size={14} /> NGO operational center
        </div>
        <h1>NGO Workspace</h1>
        <p className="portal-subtitle-modern">
          Track high-density ecological hazards, dispatch local volunteer groups, and organize cleanups.
        </p>
      </div>

      <div className="ngo-layout">
        <div className="ngo-main">
          <div className="section-card">
            <div className="section-title-bar">
              <Map size={18} className="title-icon" />
              <h2>Hazard Hotspot Map</h2>
            </div>
            <p className="section-desc-text">
              Interactive workspace mapping moderate complaints. Click any marker to view details, or click on the map to set coordinates for your new cleanup drive.
            </p>
            <p className="map-provider-note">
              <Map size={13} /> Map data by OpenStreetMap and CARTO. Location tagging works without a browser-exposed API key.
            </p>
            <MapView
              complaints={moderateComplaints}
              height={320}
              onMapClick={handleMapClick}
            />
          </div>
        </div>

        <div className="ngo-workspace-grid">
          <div className="section-card ngo-queue-card">
            <div className="section-title-bar">
              <ListTodo size={18} className="title-icon" />
              <h2>Moderate Hazard Queue</h2>
            </div>
            <p className="section-desc-text">
              Accept complaints for resolution or coordinate a public environmental cleanup drive for high priority spots.
            </p>
            <ComplaintQueue onSelectForDrive={setSelectedComplaint} />
          </div>

          <div className="section-card ngo-coordinator-card">
            <div className="section-title-bar">
              <ClipboardEdit size={18} className="title-icon" />
              <h2>Drive Coordinator</h2>
            </div>
            <p className="section-desc-text">
              Plan and dispatch cleanups. Select from the queue or tap any position on the hotspot map above to pre-fill coordinates.
            </p>
            <DriveForm
              key={selectedComplaint?.id ?? 'none'}
              selectedComplaint={selectedComplaint}
              mapClickedCoords={mapClickedCoords}
              onMapCoordsHandled={() => setMapClickedCoords(null)}
              onDriveCreated={() => setSelectedComplaint(null)}
            />
          </div>
        </div>

        <div className="section-card ngo-campaigns-card">
          <DrivesList />
        </div>
      </div>
    </motion.section>
  )
}
