import { useEffect, useMemo, useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, useMap, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { StatusBadge, SeverityBadge } from './Badges'

const HYDERABAD_CENTER = [17.385, 78.4867]

// Standard light & dark cartographic tiles for seamless theme matching
const TILE_LAYERS = {
  light: {
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
  },
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
  }
}

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
    // Keyed on coordinates (not the array reference) so an unrelated
    // status update elsewhere doesn't yank the view back to a fit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pointsKey])

  return null
}

// Custom component to dynamically handle map tile theme changes safely
function TileLayerTheme() {
  const [activeTheme, setActiveTheme] = useState(document.documentElement.getAttribute('data-theme') || 'light')

  useEffect(() => {
    // Poll/Listen for theme changes on html element
    const observer = new MutationObserver(() => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light'
      setActiveTheme(currentTheme)
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    })

    return () => observer.disconnect()
  }, [])

  const currentTile = activeTheme === 'dark' ? TILE_LAYERS.dark : TILE_LAYERS.light

  return (
    <TileLayer
      key={activeTheme} // Force re-render of TileLayer when theme toggles
      attribution={currentTile.attribution}
      url={currentTile.url}
    />
  )
}

function MapEvents({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick?.(e.latlng)
    }
  })
  return null
}

export default function MapView({
  complaints = [],
  center = HYDERABAD_CENTER,
  zoom = 12,
  onMarkerClick,
  onMapClick,
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
          <TileLayerTheme />
          {onMapClick && <MapEvents onMapClick={onMapClick} />}
          {markers.map((complaint) => (
            <CircleMarker
              key={complaint.id}
              center={[complaint.lat, complaint.lng]}
              radius={complaint.severity === 'high' ? 11 : 9}
              pathOptions={{
                color: complaint.severity === 'high' ? '#ffebeb' : '#fff',
                weight: complaint.severity === 'high' ? 3 : 2,
                fillColor: SEVERITY_COLORS[complaint.severity] ?? SEVERITY_COLORS.pending,
                fillOpacity: 0.95,
              }}
              eventHandlers={
                onMarkerClick ? { click: () => onMarkerClick(complaint) } : undefined
              }
            >
              <Popup>
                <div className="leaflet-popup-custom">
                  <p className="popup-text">{truncate(complaint.text)}</p>
                  {complaint.image_url && (
                    <img
                      src={complaint.image_url}
                      alt="Evidence Thumb"
                      className="popup-preview-img"
                    />
                  )}
                  <div className="popup-badges">
                    <SeverityBadge severity={complaint.severity} />
                    <StatusBadge status={complaint.status} />
                  </div>
                  <p className="popup-meta">
                    {new Date(complaint.created_at).toLocaleString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  )
}
