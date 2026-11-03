import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ZoomIn, ZoomOut, RotateCw } from 'lucide-react'
import { useState } from 'react'

export default function ImageLightbox({ isOpen, imageUrl, onClose, altText = 'Evidence Photo' }) {
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)

  // Block scrolling on body when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleZoomIn = (e) => {
    e.stopPropagation()
    setScale((prev) => Math.min(prev + 0.25, 3))
  }

  const handleZoomOut = (e) => {
    e.stopPropagation()
    setScale((prev) => Math.max(prev - 0.25, 0.75))
  }

  const handleRotate = (e) => {
    e.stopPropagation()
    setRotation((prev) => (prev + 90) % 360)
  }

  return (
    <AnimatePresence>
      {isOpen && imageUrl && (
        <motion.div
          key={imageUrl}
          className="lightbox-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* Header Controls */}
          <div className="lightbox-header" onClick={(e) => e.stopPropagation()}>
            <span className="lightbox-title">{altText}</span>
            <div className="lightbox-controls">
              <button type="button" onClick={handleZoomIn} title="Zoom In">
                <ZoomIn size={18} />
              </button>
              <button type="button" onClick={handleZoomOut} title="Zoom Out">
                <ZoomOut size={18} />
              </button>
              <button type="button" onClick={handleRotate} title="Rotate">
                <RotateCw size={18} />
              </button>
              <button type="button" className="lightbox-close-btn" onClick={onClose} title="Close Lightbox">
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Immersive Central Photo */}
          <div className="lightbox-viewport">
            <motion.img
              src={imageUrl}
              alt={altText}
              className="lightbox-image"
              onClick={(e) => e.stopPropagation()}
              style={{ cursor: 'zoom-in' }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ 
                scale, 
                rotate: rotation,
                opacity: 1 
              }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            />
          </div>

          {/* Backdrop hint */}
          <div className="lightbox-footer-hint">
            <p>Click anywhere to dismiss</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
