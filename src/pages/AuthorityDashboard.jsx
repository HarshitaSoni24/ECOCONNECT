import StatsBar from '../components/authority/StatsBar'
import UrgentQueue from '../components/authority/UrgentQueue'
import MapView from '../components/shared/MapView'
import { useComplaints } from '../context/ComplaintsContext'
import '../components/authority/authority.css'

export default function AuthorityDashboard() {
  const { complaints } = useComplaints()

  return (
    <section className="authority-dashboard">
      <h1>Authority Dashboard</h1>
      <p>Triage, route, and resolve complaints across the city.</p>

      <StatsBar />
      <MapView complaints={complaints} height={500} title="Citywide view" />
      <UrgentQueue />
    </section>
  )
}
