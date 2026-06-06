import { Navigate } from 'react-router-dom'
import { getCurrentUser } from '../utils/storage'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = getCurrentUser()

  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/login" replace />

  return <>{children}</>
}