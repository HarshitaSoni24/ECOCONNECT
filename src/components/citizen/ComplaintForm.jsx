import { useState } from 'react'
import { useComplaints } from '../../context/ComplaintsContext'

export default function ComplaintForm() {
  const { addComplaint } = useComplaints()

  const [text, setText] = useState('')
  const [photo, setPhoto] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [location, setLocation] = useState(null)
  const [locationError, setLocationError] = useState(null)
  const [locating, setLocating] = useState(false)

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0] ?? null
    setPhoto(file)
    setPreviewUrl(file ? URL.createObjectURL(file) : null)
  }

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.')
      return
    }

    setLocating(true)
    setLocationError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setLocating(false)
      },
      (error) => {
        setLocating(false)
        if (error.code === error.PERMISSION_DENIED) {
          setLocationError('Location permission denied. Please enable it to tag your complaint.')
        } else {
          setLocationError('Could not get your location. Please try again.')
        }
      },
    )
  }

  const resetForm = () => {
    setText('')
    setPhoto(null)
    setPreviewUrl(null)
    setLocation(null)
    setLocationError(null)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!text.trim()) return

    addComplaint({
      id: `c${Date.now()}`,
      text: text.trim(),
      imageUrl: photo ? URL.createObjectURL(photo) : null,
      lat: location?.lat ?? null,
      lng: location?.lng ?? null,
      severity: 'pending',
      isDuplicate: false,
      status: 'submitted',
      createdAt: new Date(),
    })

    resetForm()
  }

  return (
    <form className="complaint-form" onSubmit={handleSubmit}>
      <h2>Report a Complaint</h2>

      <label htmlFor="complaint-text">Description</label>
      <textarea
        id="complaint-text"
        rows={4}
        placeholder="Describe the environmental issue..."
        value={text}
        onChange={(event) => setText(event.target.value)}
        required
      />

      <label htmlFor="complaint-photo">Photo</label>
      <input id="complaint-photo" type="file" accept="image/*" onChange={handlePhotoChange} />
      {previewUrl && (
        <img className="photo-preview" src={previewUrl} alt="Complaint preview" />
      )}

      <div className="location-row">
        <button type="button" onClick={handleUseMyLocation} disabled={locating}>
          {locating ? 'Locating...' : 'Use my location'}
        </button>
        {location && (
          <span className="location-value">
            {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
          </span>
        )}
      </div>
      {locationError && <p className="location-error">{locationError}</p>}

      <button type="submit" className="submit-btn">
        Submit Complaint
      </button>
    </form>
  )
}
