import { useState, useCallback } from 'react'
import { useComplaints } from '../../context/ComplaintsContext'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { 
  FileText, 
  Camera, 
  MapPin, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Upload, 
  Trash2,
  Navigation
} from 'lucide-react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix default Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const HYDERABAD_CENTER = [17.385, 78.4867]

const STEPS = [
  { id: 1, label: 'Describe', icon: <FileText size={18} /> },
  { id: 2, label: 'Evidence', icon: <Camera size={18} /> },
  { id: 3, label: 'Location', icon: <MapPin size={18} /> },
]

// Draggable Marker Component
function DraggableMarker({ position, setPosition, onPositionChange }) {
  const mapEvents = useMapEvents({
    click(e) {
      setPosition(e.latlng)
      onPositionChange(e.latlng)
    },
  })

  return (
    <Marker
      draggable={true}
      position={position}
      eventHandlers={{
        dragend(e) {
          const latlng = e.target.getLatLng()
          setPosition(latlng)
          onPositionChange(latlng)
        },
      }}
    />
  )
}

export default function ComplaintForm() {
  const { addComplaint } = useComplaints()

  const [currentStep, setCurrentStep] = useState(1)
  const [direction, setDirection] = useState(1) // 1 for forward, -1 for backward
  const [text, setText] = useState('')
  const [photo, setPhoto] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [location, setLocation] = useState(null)
  const [address, setAddress] = useState('')
  const [locationError, setLocationError] = useState(null)
  const [locating, setLocating] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const fetchAddress = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      )
      const data = await response.json()
      setAddress(data.display_name || 'Address not found')
    } catch (err) {
      setAddress('Could not fetch address')
    }
  }

  const handlePositionChange = useCallback((latlng) => {
    setLocation({ lat: latlng.lat, lng: latlng.lng })
    fetchAddress(latlng.lat, latlng.lng)
  }, [])

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 60 : -60,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir) => ({
      x: dir < 0 ? 60 : -60,
      opacity: 0,
    }),
  }

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0] ?? null
    setPhoto(file)
    setPreviewUrl(file ? URL.createObjectURL(file) : null)
  }

  const handleRemovePhoto = () => {
    setPhoto(null)
    setPreviewUrl(null)
  }

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.')
      toast.error('Geolocation is not supported by this browser.')
      return
    }

    setLocating(true)
    setLocationError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        setLocation(loc)
        fetchAddress(loc.lat, loc.lng)
        setLocating(false)
        toast.success('Location tagged successfully!')
      },
      (error) => {
        setLocating(false)
        if (error.code === error.PERMISSION_DENIED) {
          setLocationError('Location permission denied. Please enable it in your browser settings.')
          toast.error('Location permission denied.')
        } else {
          setLocationError('Could not retrieve your location. Please try again.')
          toast.error('Could not retrieve location.')
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
    setCurrentStep(1)
    setDirection(1)
  }

  const handleNextStep = () => {
    if (currentStep === 1 && !text.trim()) {
      toast.warning('Please provide a description of the issue.')
      return
    }
    setDirection(1)
    setCurrentStep((prev) => Math.min(prev + 1, 3))
  }

  const handleBackStep = () => {
    setDirection(-1)
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!text.trim()) {
      toast.error('Please describe the environmental issue first.')
      return
    }

    setSubmitting(true)
    try {
      await addComplaint({
        text: text.trim(),
        photoFile: photo,
        lat: location?.lat ?? null,
        lng: location?.lng ?? null,
      })
      resetForm()
      toast.success('Environmental complaint submitted successfully! Thank you for keeping our community green.')
    } catch (error) {
      toast.error(error.message ?? 'Failed to submit complaint. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const isFormValid = text.trim().length > 0

  return (
    <div className="complaint-wizard-card">
      {/* Step Indicator / Progress Header */}
      <div className="wizard-progress-header">
        {STEPS.map((step) => (
          <div 
            key={step.id} 
            className={`wizard-step-node ${
              currentStep === step.id 
                ? 'active' 
                : currentStep > step.id 
                  ? 'completed' 
                  : ''
            }`}
          >
            <div className="node-icon-wrapper">
              {currentStep > step.id ? <Check size={14} /> : step.icon}
            </div>
            <span className="node-label">{step.label}</span>
            {step.id < 3 && <div className="node-line-connector"></div>}
          </div>
        ))}
      </div>

      <form className="complaint-form-wizard-inner" onSubmit={handleSubmit}>
        <AnimatePresence mode="wait" custom={direction}>
          {/* STEP 1: DESCRIPTION */}
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
              className="wizard-step-pane"
            >
              <div className="pane-header">
                <h3>Step 1: Tell us what is happening</h3>
                <p>Provide details on the environmental hazard or complaint (e.g., trash accumulation, leaking pipe, tree down, etc.).</p>
              </div>

              <div className="form-group-field">
                <label htmlFor="complaint-text">Description of the Issue</label>
                <textarea
                  id="complaint-text"
                  rows={5}
                  placeholder="Explain the environmental concern in detail so responding personnel know what to look for..."
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  required
                />
              </div>
            </motion.div>
          )}

          {/* STEP 2: EVIDENCE */}
          {currentStep === 2 && (
            <motion.div
              key="step-2"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
              className="wizard-step-pane"
            >
              <div className="pane-header">
                <h3>Step 2: Add visual evidence</h3>
                <p>An image helps authorities verify and evaluate the severity of the concern much faster.</p>
              </div>

              <div className="photo-upload-container">
                {!previewUrl ? (
                  <label className="file-drop-zone" htmlFor="complaint-photo">
                    <Upload size={32} className="upload-cloud-icon" />
                    <span className="upload-main-text">Click to upload photo</span>
                    <span className="upload-sub-text">PNG, JPG or JPEG up to 5MB</span>
                    <input 
                      id="complaint-photo" 
                      type="file" 
                      accept="image/*" 
                      onChange={handlePhotoChange} 
                      className="hidden-file-input"
                    />
                  </label>
                ) : (
                  <div className="preview-image-wrapper">
                    <img className="photo-preview-wizard" src={previewUrl} alt="Complaint preview" />
                    <button 
                      type="button" 
                      className="remove-photo-btn"
                      onClick={handleRemovePhoto}
                      title="Remove image"
                    >
                      <Trash2 size={16} /> Delete Photo
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* STEP 3: LOCATION */}
          {currentStep === 3 && (
            <motion.div
              key="step-3"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
              className="wizard-step-pane"
            >
              <div className="pane-header">
                <h3>Step 3: Tag Location</h3>
                <p>Pin the exact location. Drag the pin to adjust.</p>
              </div>

              <div className="location-wizard-panel">
                <button 
                  type="button" 
                  className={`btn-location-action ${locating ? 'pulse' : ''}`}
                  onClick={handleUseMyLocation} 
                  disabled={locating}
                >
                  <Navigation size={18} /> {locating ? 'Fetching GPS...' : 'Use my current location'}
                </button>

                <div style={{ height: '300px', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
                  <MapContainer center={location || HYDERABAD_CENTER} zoom={13} style={{ height: '100%', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {location && (
                      <DraggableMarker 
                        position={location} 
                        setPosition={setLocation} 
                        onPositionChange={handlePositionChange} 
                      />
                    )}
                  </MapContainer>
                </div>

                {location ? (
                  <div className="location-success-indicator">
                    <div className="success-badge">
                      <Check size={14} /> Coordinates Tagged
                    </div>
                    <p className="coords-text">
                      Latitude: <span>{location.lat.toFixed(5)}</span> | Longitude: <span>{location.lng.toFixed(5)}</span>
                    </p>
                    <p className="coords-text" style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
                      <strong>Address:</strong> {address}
                    </p>
                  </div>
                ) : (
                  <p className="location-pending-text">
                    📍 No coordinates tagged yet. Click on map or use location.
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Controls Footer */}
        <div className="wizard-action-footer">
          {currentStep > 1 && (
            <button 
              type="button" 
              className="btn-secondary btn-wizard" 
              onClick={handleBackStep}
            >
              <ArrowLeft size={16} /> Back
            </button>
          )}

          {currentStep < 3 ? (
            <button
              key="next-btn"
              type="button"
              className="btn-wizard submit-btn"
              onClick={handleNextStep}
              style={{ marginLeft: currentStep === 1 ? 'auto' : '0' }}
            >
              Next Step <ArrowRight size={16} />
            </button>
          ) : (
            <button
              key="submit-btn"
              type="submit"
              className="btn-wizard submit-btn success"
              disabled={!isFormValid || submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Complaint'} <Check size={16} />
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
