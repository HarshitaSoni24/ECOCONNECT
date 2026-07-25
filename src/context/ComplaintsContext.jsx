import { createContext, useContext, useState } from 'react'
import { mockComplaints } from '../data/mockComplaints'

const ComplaintsContext = createContext(null)

export function ComplaintsProvider({ children }) {
  const [complaints, setComplaints] = useState(mockComplaints)

  const addComplaint = (complaint) => {
    setComplaints((prev) => [complaint, ...prev])
  }

  const updateComplaintStatus = (id, status) => {
    setComplaints((prev) =>
      prev.map((complaint) =>
        complaint.id === id ? { ...complaint, status } : complaint,
      ),
    )
  }

  return (
    <ComplaintsContext.Provider
      value={{ complaints, addComplaint, updateComplaintStatus }}
    >
      {children}
    </ComplaintsContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useComplaints() {
  const context = useContext(ComplaintsContext)
  if (!context) {
    throw new Error('useComplaints must be used within a ComplaintsProvider')
  }
  return context
}
