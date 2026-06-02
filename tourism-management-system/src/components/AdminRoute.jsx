import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function AdminRoute({ children }) {
  const { user, isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        backgroundColor: '#17130d',
        color: 'white'
      }}>
        Loading...
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  if (!user?.is_admin) {
    return <Navigate to="/" />
  }

  return children
}

export default AdminRoute