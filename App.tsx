import { Routes, Route, Navigate } from 'react-router-dom'
import { getCurrentUser } from './utils/storage'
import ProtectedRoute from './components/ProtectedRoute'
import Sidebar from './components/Sidebar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Bookings from './pages/Bookings'
import Hotels from './pages/Hotels'
import Guides from './pages/Guides'
import Packages from './pages/Packages'
import Users from './pages/Users'

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{
        marginLeft: 'var(--sidebar-w)',
        flex: 1,
        minHeight: '100vh',
        background: 'var(--bg)',
      }}>
        {children}
      </main>
    </div>
  )
}

export default function App() {
  const user = getCurrentUser()

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/dashboard" element={
        <ProtectedRoute>
          <AdminLayout><Dashboard /></AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/bookings" element={
        <ProtectedRoute>
          <AdminLayout><Bookings /></AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/hotels" element={
        <ProtectedRoute>
          <AdminLayout><Hotels /></AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/guides" element={
        <ProtectedRoute>
          <AdminLayout><Guides /></AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/packages" element={
        <ProtectedRoute>
          <AdminLayout><Packages /></AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/users" element={
        <ProtectedRoute>
          <AdminLayout><Users /></AdminLayout>
        </ProtectedRoute>
      } />

      <Route path="*" element={
        <Navigate to={user?.role === 'admin' ? '/dashboard' : '/login'} replace />
      } />
    </Routes>
  )
}