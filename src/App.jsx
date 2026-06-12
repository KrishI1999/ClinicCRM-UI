import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import SuperAdminDashboard from './Superadmindashboard'

// Lazy load all route components
const LandingPage   = lazy(() => import('./LandingPage'))
const Login        = lazy(() => import('./AuthComponents/Login'))
const Register     = lazy(() => import('./AuthComponents/Register'))
const Dashboard    = lazy(() => import('./Dashboard'))
const UserDashboard = lazy(() => import('./UserDashboard'))
const Patients     = lazy(() => import('./Patients'))
const EditPatient  = lazy(() => import('./EditPatient'))
const PatientVisits = lazy(() => import('./PatientVisits'))
const AllVisits    = lazy(() => import('./AllVisits'))
const Revenue      = lazy(() => import('./Revenue'))
const ProtectedRoute = lazy(() => import('./ProtectedRoute'))

function PageLoader() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <p>Loading...</p>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public routes */}
           <Route path="/"          element={<LandingPage />} />
          <Route path="/login"   element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin only */}
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <Dashboard />
            </ProtectedRoute>
          } />

          <Route path="/revenue" element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <Revenue />
            </ProtectedRoute>
          } />

          {/* Staff only */}
          <Route path="/userdashboard" element={
            <ProtectedRoute allowedRoles={['Staff']}>
              <UserDashboard />
            </ProtectedRoute>
          } />

          <Route path="/superadmin" element={
            <ProtectedRoute allowedRoles={['SuperAdmin']}>
              <SuperAdminDashboard/>
            </ProtectedRoute>
          } />

          {/* Admin + Staff */}
          <Route path="/patients" element={
            <ProtectedRoute allowedRoles={['Admin', 'Staff']}>
              <Patients />
            </ProtectedRoute>
          } />

          <Route path="/patients/:id" element={
            <ProtectedRoute allowedRoles={['Admin', 'Staff']}>
              <EditPatient />
            </ProtectedRoute>
          } />

          <Route path="/visits/patient/:id" element={
            <ProtectedRoute allowedRoles={['Admin', 'Staff']}>
              <PatientVisits />
            </ProtectedRoute>
          } />

          <Route path="/visits" element={
            <ProtectedRoute allowedRoles={['Admin', 'Staff']}>
              <AllVisits />
            </ProtectedRoute>
          } />

          {/* Fallbacks */}
          <Route path="/unauthorized" element={<div>403 - Access Denied</div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App