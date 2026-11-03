import React from 'react'
import { Check, Clock, ShieldAlert, CheckCircle2 } from 'lucide-react'
import './ProgressTracker.css'

const STEPS = [
  { 
    id: 'submitted', 
    label: 'Reported', 
    icon: '🌱',
    description: 'Complaint filed'
  },
  { 
    id: 'routed', 
    label: 'In Progress', 
    icon: '🌿',
    description: 'NGO/Govt working'
  },
  { 
    id: 'resolved', 
    label: 'Resolved', 
    icon: '🌳',
    description: 'Issue restored!'
  },
]

export default function ProgressTracker({ status }) {
  // Determine current step index
  const getActiveIndex = (currentStatus) => {
    switch (currentStatus) {
      case 'submitted':
        return 0
      case 'routed':
        return 1
      case 'resolved':
        return 2
      default:
        return 0
    }
  }

  const activeIndex = getActiveIndex(status)

  return (
    <div className="delivery-progress-container">
      <div className="delivery-progress-track">
        {STEPS.map((step, index) => {
          const isCompleted = index < activeIndex
          const isActive = index === activeIndex
          const isPending = index > activeIndex

          let statusClass = 'pending'
          if (isCompleted) statusClass = 'completed'
          if (isActive) statusClass = 'active'

          return (
            <div key={step.id} className={`delivery-progress-step ${statusClass}`}>
              <div className="step-node-wrapper">
                {/* Connecting bar to the next node */}
                {index < STEPS.length - 1 && (
                  <div 
                    className={`step-connector-bar ${index < activeIndex ? 'filled' : ''}`} 
                  />
                )}
                
                {/* Visual Circle Node */}
                <div className="step-circle-node">
                  {isCompleted ? (
                    <span className="node-check-icon"><Check size={14} strokeWidth={3} /></span>
                  ) : (
                    <span className="node-emoji">{step.icon}</span>
                  )}
                  {isActive && <span className="pulsing-halo"></span>}
                </div>
              </div>

              {/* Text Meta info */}
              <div className="step-label-group">
                <span className="step-main-label">{step.label}</span>
                <span className="step-sub-desc">{step.description}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
