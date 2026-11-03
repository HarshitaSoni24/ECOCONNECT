import { useState, useEffect } from 'react'
import { useComplaints } from '../../context/ComplaintsContext'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../api/supabase'
import { StatusBadge, SeverityBadge } from '../shared/Badges'
import ImageLightbox from '../shared/ImageLightbox'
import ProgressTracker from '../shared/ProgressTracker'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Filter,
  ArrowUpDown,
  FolderOpen,
  Calendar,
  AlertTriangle,
  RefreshCw,
  Search
} from 'lucide-react'

// SEVERITY WEIGHTS FOR SORTING
const SEVERITY_ORDER = {
  high: 4,
  moderate: 3,
  low: 2,
  pending: 1
}

function ComplaintCard({ complaint, onImageClick }) {
  const [updates, setUpdates] = useState([])

  useEffect(() => {
    let cancelled = false
    supabase
      .from('progress_updates')
      .select('*')
      .eq('complaint_id', complaint.id)
      .order('created_at')
      .then(({ data, error }) => {
        if (!error && !cancelled) setUpdates(data)
      })
    return () => {
      cancelled = true
    }
  }, [complaint.id])

  return (
    <motion.div
      className={`complaint-card citizen-complaint-card ${complaint.image_url ? 'has-evidence' : 'no-evidence'}`}
      layoutId={complaint.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      {complaint.image_url && (
        <div className="citizen-complaint-media">
          <button
            type="button"
            className="btn-thumb-click"
            onClick={() => onImageClick(complaint.image_url)}
          >
            <img
              className="complaint-thumb"
              src={complaint.image_url}
              alt="Evidence"
            />
            <span>View evidence</span>
          </button>
        </div>
      )}
      <div className="complaint-body">
        <p className="complaint-text">{complaint.text}</p>
        <div className="complaint-meta-row">
          <span className="meta-item">
            <Calendar size={12} /> {new Date(complaint.created_at).toLocaleString()}
          </span>
          {complaint.lat && (
            <span className="meta-item">
              <AlertTriangle size={12} /> Geotagged
            </span>
          )}
        </div>
        <div className="card-badges">
          <StatusBadge status={complaint.status} />
          <SeverityBadge severity={complaint.severity} />
        </div>
        
        <ProgressTracker status={complaint.status} />

        {updates.length > 0 && (
          <div className="citizen-latest-update">
            <span>Latest update</span>
            <p>{updates[updates.length - 1].message}</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default function MyComplaints() {
  const { complaints, loading } = useComplaints()
  const { user } = useAuth()
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [searchQuery, setSearchQuery] = useState('')
  const [lightbox, setLightbox] = useState({ isOpen: false, imageUrl: null })

  // 1. FILTER COMPLAINTS
  const ownComplaints = complaints.filter((c) => c.user_id === user?.id)
  const filteredComplaints = ownComplaints.filter((c) => {
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter
    const matchesSearch = c.text.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  // 2. SORT COMPLAINTS
  const sortedComplaints = [...filteredComplaints].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.created_at) - new Date(a.created_at)
    }
    if (sortBy === 'oldest') {
      return new Date(a.created_at) - new Date(b.created_at)
    }
    if (sortBy === 'severity') {
      return (SEVERITY_ORDER[b.severity] || 0) - (SEVERITY_ORDER[a.severity] || 0)
    }
    return 0
  })

  return (
    <div className="my-complaints">
      <div className="section-header-row">
        <h2>My Complaints</h2>
        {ownComplaints.length > 0 && (
          <button 
            type="button" 
            className="btn-icon-refresh" 
            onClick={() => {
              // Assuming you want a manual refresh trigger
              // fetchComplaints() 
            }}
            title="Refresh List"
          >
            <RefreshCw size={15} />
          </button>
        )}
      </div>

      <ImageLightbox 
        isOpen={lightbox.isOpen}
        imageUrl={lightbox.imageUrl}
        onClose={() => setLightbox({ isOpen: false, imageUrl: null })}
      />

      {/* FILTER AND SORT BAR */}
      {ownComplaints.length > 0 && (
        <div className="filter-sort-bar">
          <div className="search-input-wrapper">
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search complaints..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="bar-selectors">
            <div className="selector-group">
              <Filter size={14} className="bar-icon" />
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter by Status"
              >
                <option value="all">All Statuses</option>
                <option value="submitted">Submitted</option>
                <option value="routed">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            <div className="selector-group">
              <ArrowUpDown size={14} className="bar-icon" />
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort by Option"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="severity">Highest Severity</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* LOADING SKELETON PLACEHOLDERS */}
      {loading ? (
        <div className="complaint-list">
          {[1, 2].map((i) => (
            <div className="complaint-card skeleton-card" key={i}>
              <div className="skeleton-thumb shimmer"></div>
              <div className="complaint-body" style={{ flexGrow: 1 }}>
                <div className="skeleton-line title shimmer" style={{ width: '80%' }}></div>
                <div className="skeleton-line text shimmer" style={{ width: '40%', marginTop: '0.4rem' }}></div>
                <div className="skeleton-row-badges" style={{ display: 'flex', gap: '0.5rem', marginTop: '0.8rem' }}>
                  <div className="skeleton-badge shimmer" style={{ width: '70px', height: '20px', borderRadius: '999px' }}></div>
                  <div className="skeleton-badge shimmer" style={{ width: '80px', height: '20px', borderRadius: '999px' }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          {sortedComplaints.length === 0 ? (
            <motion.div 
              className="premium-empty-state-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="empty-icon-wrapper">
                <FolderOpen size={36} />
              </div>
              <h3>No Complaints Found</h3>
              <p>
                {ownComplaints.length === 0
                  ? "You haven't reported any environmental issues yet. Use the wizard form above to file your first complaint!"
                  : "We couldn't find any complaints matching your current search or filters. Try adjusting your query."}
              </p>
              {ownComplaints.length > 0 && (
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => {
                    setSearchQuery('')
                    setStatusFilter('all')
                    setSortBy('newest')
                  }}
                >
                  Reset Filters
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div className="complaint-list" layout>
              {sortedComplaints.map((complaint) => (
                <ComplaintCard
                  key={complaint.id}
                  complaint={complaint}
                  onImageClick={(imageUrl) => setLightbox({ isOpen: true, imageUrl })}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}
