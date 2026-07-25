import { useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { StatusBadge, SeverityBadge } from './Badges'

const HYDERABAD_CENTER = [17.385, 78.4867]

// Leaflet paints markers via inline SVG attributes, not CSS classes, so
// these can't reference the theme's CSS custom properties directly —
// kept as literal hex matching --clay-red / --sun / --leaf / --stone.
const SEVERITY_COLORS = {
  high: '#c1554d',
  moderate: '#e9b44c',
  low: '#74c69d',
  pending: '#6b7a70',
}

function truncate(text, max = 80) {
  if (!text) return ''
  return text.length > max ? `${text.slice(0, max)}…` : text
}

function hasValidCoords(complaint) {
  return typeof complaint.lat === 'number' && typeof complaint.lng === 'number'
}

// Frames the given points so markers are visible without manual panning,
// falling back to the default center/zoom when there's nothing to show.
// Keyed on the coordinates themselves (not the array reference) so an
// unrelated status update elsewhere doesn't yank the view back to a fit.
function FitToMarkers({ points, fallbackCenter, fallbackZoom }) {
  const map = useMap()
  const pointsKey = points.map((point) => point.join(',')).join('|')

  useEffect(() => {
    if (points.length === 0) {
      map.setView(fallbackCenter, fallbackZoom)
    } else if (points.length === 1) {
      map.setView(points[0], fallbackZoom)
    } else {
      map.fitBounds(points, { padding: [30, 30] })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pointsKey])

  return null
}

export default function MapView({
  complaints = [],
  center = HYDERABAD_CENTER,
  zoom = 12,
  onMarkerClick,
  height = 500,
  title,
}) {
  const markers = complaints.filter(hasValidCoords)
  const points = useMemo(
    () => markers.map((complaint) => [complaint.lat, complaint.lng]),
    [markers],
  )

  return (
    <div className="map-card">
      {title && (
        <div className="map-card-header">
          <h3>{title}</h3>
        </div>
      )}
      <div className="map-view" style={{ height }}>
        <MapContainer
          center={center}
          zoom={zoom}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
        >
          <FitToMarkers points={points} fallbackCenter={center} fallbackZoom={zoom} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {markers.map((complaint) => (
            <CircleMarker
              key={complaint.id}
              center={[complaint.lat, complaint.lng]}
              radius={9}
              pathOptions={{
                color: '#fff',
                weight: 2,
                fillColor: SEVERITY_COLORS[complaint.severity] ?? SEVERITY_COLORS.pending,
                fillOpacity: 0.9,
              }}
              eventHandlers={
                onMarkerClick ? { click: () => onMarkerClick(complaint) } : undefined
              }
            >
              <Popup>
                <p className="popup-text">{truncate(complaint.text)}</p>
                <div className="popup-badges">
                  <SeverityBadge severity={complaint.severity} />
                  <StatusBadge status={complaint.status} />
                </div>
                <p className="popup-meta">
                  {new Date(complaint.createdAt).toLocaleString()}
                </p>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  )
}
