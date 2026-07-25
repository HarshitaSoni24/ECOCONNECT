import { useState } from 'react'
import { useDrives } from '../../context/DrivesContext'

const emptyForm = { title: '', date: '', lat: '', lng: '', radiusKm: 2 }

// Mount this with a `key` tied to the selected complaint so switching
// selections resets the form with fresh prefilled values.
export default function DriveForm({ selectedComplaint, onDriveCreated }) {
  const { addDrive } = useDrives()
  const [form, setForm] = useState(() => ({
    ...emptyForm,
    lat: selectedComplaint?.lat ?? '',
    lng: selectedComplaint?.lng ?? '',
  }))

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!form.title.trim() || !form.date || form.lat === '' || form.lng === '') return

    addDrive({
      id: `d${Date.now()}`,
      title: form.title.trim(),
      lat: Number(form.lat),
      lng: Number(form.lng),
      radiusKm: Number(form.radiusKm) || 2,
      date: form.date,
      status: 'upcoming',
      linkedComplaintId: selectedComplaint?.id ?? null,
      volunteers: [],
    })

    setForm(emptyForm)
    onDriveCreated?.()
  }

  return (
    <form className="drive-form" onSubmit={handleSubmit}>
      <h2>Create Cleanup Drive</h2>

      {selectedComplaint && (
        <p className="linked-complaint">
          Linked to complaint: <em>{selectedComplaint.text}</em>
        </p>
      )}

      <label htmlFor="drive-title">Title</label>
      <input
        id="drive-title"
        type="text"
        value={form.title}
        onChange={handleChange('title')}
        required
      />

      <label htmlFor="drive-date">Date</label>
      <input
        id="drive-date"
        type="date"
        value={form.date}
        onChange={handleChange('date')}
        required
      />

      <label htmlFor="drive-lat">Latitude</label>
      <input
        id="drive-lat"
        type="number"
        step="any"
        value={form.lat}
        onChange={handleChange('lat')}
        required
      />

      <label htmlFor="drive-lng">Longitude</label>
      <input
        id="drive-lng"
        type="number"
        step="any"
        value={form.lng}
        onChange={handleChange('lng')}
        required
      />

      <label htmlFor="drive-radius">Radius (km)</label>
      <input
        id="drive-radius"
        type="number"
        min="0"
        step="0.1"
        value={form.radiusKm}
        onChange={handleChange('radiusKm')}
      />

      <button type="submit" className="submit-btn">
        Create Drive
      </button>
    </form>
  )
}
