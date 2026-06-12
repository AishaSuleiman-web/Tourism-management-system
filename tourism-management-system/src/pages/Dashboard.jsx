import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { getProfile } from '../services/authService'

function Dashboard() {
  const { user, logout, isAuthenticated } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    const fetchProfile = async () => {
      const result = await getProfile()
      if (result.success) setProfile(result.user)
      setLoading(false)
    }
    fetchProfile()
  }, [isAuthenticated, navigate])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>

  const displayUser = profile || user

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '30px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h2 style={{ marginBottom: '24px', color: '#1F2937' }}>Dashboard</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <p><strong>Name:</strong> {displayUser?.name}</p>
        <p><strong>Email:</strong> {displayUser?.email}</p>
      </div>
      
      <button
        onClick={handleLogout}
        style={{
          padding: '10px 20px',
          backgroundColor: '#DC2626',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        Logout
      </button>
    </div>
  )
}

export default Dashboard