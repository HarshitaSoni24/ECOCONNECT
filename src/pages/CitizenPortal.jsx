import ComplaintForm from '../components/citizen/ComplaintForm'
import MyComplaints from '../components/citizen/MyComplaints'
import '../components/citizen/citizen.css'

export default function CitizenPortal() {
  return (
    <section className="citizen-portal">
      <h1>Citizen Portal</h1>
      <p>Report environmental complaints and track their status.</p>
      <ComplaintForm />
      <MyComplaints />
    </section>
  )
}
