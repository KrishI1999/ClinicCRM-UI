import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Login from './AuthComponents/Login.jsx'
import Register from './AuthComponents/Register'
import Dashboard from './Dashboard'
import { Navigate } from 'react-router-dom'
import Patients from './Patients'
import { Link } from 'react-router-dom'
import PatientVisits from './PatientVisits'
import EditPatient from './EditPatient'
import AllVisits from './AllVisits'
import Revenue from './Revenue'
import UserDashboard from './UserDashboard'
import ProtectedRoute from './ProtectedRoute'
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin only */}
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <Dashboard />
            </ProtectedRoute>
          } />

          {/* Staff only */}
          <Route path="/userdashboard" element={
            <ProtectedRoute allowedRoles={["Staff"]}>
              <UserDashboard />
            </ProtectedRoute>
          } />

          {/* Both Admin and Staff */}
          <Route path="/patients" element={
            <ProtectedRoute allowedRoles={["Admin", "Staff"]}>
              <Patients />
            </ProtectedRoute>
          } />
          <Route path="/patients/:id" element={
            <ProtectedRoute allowedRoles={["Admin", "Staff"]}>
              <EditPatient />
            </ProtectedRoute>
          } />
          <Route path="/visits/patient/:id" element={
            <ProtectedRoute allowedRoles={["Admin", "Staff"]}>
              <PatientVisits />
            </ProtectedRoute>
          } />
          <Route path="/visits" element={
            <ProtectedRoute allowedRoles={["Admin", "Staff"]}>
              <AllVisits />
            </ProtectedRoute>
          } />
          <Route path="/revenue" element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <Revenue />
            </ProtectedRoute>
          } />

          <Route path="/unauthorized" element={<div>403 - Access Denied</div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
