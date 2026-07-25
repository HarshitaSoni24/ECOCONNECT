import { createContext, useContext, useState } from 'react'

const DrivesContext = createContext(null)

export function DrivesProvider({ children }) {
  const [drives, setDrives] = useState([])

  const addDrive = (drive) => {
    setDrives((prev) => [drive, ...prev])
  }

  const completeDrive = (id) => {
    setDrives((prev) =>
      prev.map((drive) =>
        drive.id === id ? { ...drive, status: 'completed' } : drive,
      ),
    )
  }

  return (
    <DrivesContext.Provider value={{ drives, addDrive, completeDrive }}>
      {children}
    </DrivesContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDrives() {
  const context = useContext(DrivesContext)
  if (!context) {
    throw new Error('useDrives must be used within a DrivesProvider')
  }
  return context
}
