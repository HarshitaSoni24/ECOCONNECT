import { useState, useEffect } from 'react'
import { useDrives } from '../../context/DrivesContext'
import { toast } from 'sonner'
import { 
  Plus, 
  Calendar, 
  Clock, 
  MapPin, 
  Layers, 
  PenTool, 
  Info,
  Sparkles,
  Link2
} from 'lucide-react'

const emptyForm = { title: '', note: '', date: '', time: '', lat: '', lng: '', radiusKm: 2 }

export default function DriveForm({ selectedComplaint, mapClickedCoords, onMapCoordsHandled, onDriveCreated }) {
  const { addDrive } = useDrives()
  const [form, setForm] = useState(() => ({
    ...emptyForm,
    lat: selectedComplaint?.lat ?? '',
    lng: selectedComplaint?.lng ?? '',
  }))
  const [address, setAddress] = useState('')
  const [addressLoading, setAddressLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Fetch coordinates address on update
  const fetchAddress = async (lat, lng) => {
    if (!lat || !lng) return
    setAddressLoading(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      )
      const data = await response.json()
      setAddress(data.display_name || 'Address details not found')
    } catch (err) {
      setAddress('Could not fetch location address')
    } finally {
      setAddressLoading(false)
    }
  }

  // Handle map clicked coords from parent
  useEffect(() => {
    if (mapClickedCoords) {
      const latVal = Number(mapClickedCoords.lat).toFixed(6)
      const lngVal = Number(mapClickedCoords.lng).toFixed(6)
      setForm((prev) => ({
        ...prev,
        lat: latVal,
        lng: lngVal,
      }))
      fetchAddress(latVal, lngVal)
      onMapCoordsHandled?.()
      toast.success('Coordinates set from map click!')
    }
  }, [mapClickedCoords, onMapCoordsHandled])

  // Fetch address on initial render if complaint coordinates exist
  useEffect(() => {
    if (selectedComplaint?.lat && selectedComplaint?.lng) {
      fetchAddress(selectedComplaint.lat, selectedComplaint.lng)
    }
  }, [selectedComplaint])

  const handleChange = (field) => (event) => {
    const val = event.target.value
    setForm((prev) => ({ ...prev, [field]: val }))
    if (field === 'lat' || field === 'lng') {
      // Re-fetch address if coordinates are edited manually
      const otherField = field === 'lat' ? 'lng' : 'lat'
      const otherVal = form[otherField]
      if (val && otherVal) {
        fetchAddress(field === 'lat' ? val : otherVal, field === 'lat' ? otherVal : val)
      }
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.title.trim() || !form.date || form.lat === '' || form.lng === '') {
      toast.warning('Please fill in all mandatory fields.')
      return
    }

    setSubmitting(true)
    try {
      await addDrive({
        title: form.title.trim(),
        note: form.note.trim() || null,
        lat: Number(form.lat),
        lng: Number(form.lng),
        radiusKm: Number(form.radiusKm) || 2,
        date: form.date,
        time: form.time || null,
        complaintId: selectedComplaint?.id ?? null,
      })

      setForm(emptyForm)
      setAddress('')
      onDriveCreated?.()
      toast.success('Green cleanup drive organized successfully!')
    } catch (error) {
      toast.error(error.message ?? 'Failed to create drive. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="drive-form-modern" onSubmit={handleSubmit}>
      {selectedComplaint && (
        <div className="linked-complaint-banner">
          <Link2 size={15} />
          <span>
            Linked to: <strong>{selectedComplaint.text.slice(0, 45)}{selectedComplaint.text.length > 45 ? '...' : ''}</strong>
          </span>
        </div>
      )}

      <div className="form-grid-modern">
        <div className="input-group-modern full-width">
          <label htmlFor="drive-title">
            <Sparkles size={14} /> Drive Title
          </label>
          <input
            id="drive-title"
            type="text"
            placeholder="e.g., Sanjeevaiah Park Trash Bash"
            value={form.title}
            onChange={handleChange('title')}
            required
          />
        </div>

        <div className="input-group-modern full-width">
          <label htmlFor="drive-note">
            <PenTool size={14} /> Message to volunteers
          </label>
          <textarea
            id="drive-note"
            rows={3}
            placeholder="Meeting points, gear details, guidelines, etc."
            value={form.note}
            onChange={handleChange('note')}
          />
        </div>

        <div className="input-group-modern">
          <label htmlFor="drive-date">
            <Calendar size={14} /> Date
          </label>
          <input
            id="drive-date"
            type="date"
            value={form.date}
            onChange={handleChange('date')}
            required
          />
        </div>

        <div className="input-group-modern">
          <label htmlFor="drive-time">
            <Clock size={14} /> Time
          </label>
          <input
            id="drive-time"
            type="time"
            value={form.time}
            onChange={handleChange('time')}
          />
        </div>

        <div className="input-group-modern">
          <label htmlFor="drive-lat">
            <MapPin size={14} /> Latitude
          </label>
          <input
            id="drive-lat"
            type="number"
            step="any"
            placeholder="Coordinates latitude"
            value={form.lat}
            onChange={handleChange('lat')}
            required
          />
        </div>

        <div className="input-group-modern">
          <label htmlFor="drive-lng">
            <MapPin size={14} /> Longitude
          </label>
          <input
            id="drive-lng"
            type="number"
            step="any"
            placeholder="Coordinates longitude"
            value={form.lng}
            onChange={handleChange('lng')}
            required
          />
        </div>

        <div className="input-group-modern full-width">
          <label htmlFor="drive-radius">
            <Layers size={14} /> Activity Radius (km)
          </label>
          <input
            id="drive-radius"
            type="number"
            min="0"
            step="0.1"
            placeholder="Drive impact range"
            value={form.radiusKm}
            onChange={handleChange('radiusKm')}
          />
        </div>
      </div>

      {address && (
        <div className="address-lookup-banner">
          <Info size={14} className="banner-icon" />
          <div className="address-details">
            <span className="address-label">Operational Area:</span>
            <span className="address-text">{addressLoading ? 'Loading address details...' : address}</span>
          </div>
        </div>
      )}

      <button type="submit" className="submit-btn-modern" disabled={submitting}>
        {submitting ? 'Dispatching...' : 'Dispatch Cleanup Drive'} <Plus size={16} />
      </button>
    </form>
  )
}
