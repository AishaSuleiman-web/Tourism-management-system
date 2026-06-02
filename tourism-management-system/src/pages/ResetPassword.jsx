import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { updatePassword } from '../services/authService'

function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Extract token from URL hash (Supabase uses hash fragment)
    const hashParams = new URLSearchParams(location.hash.substring(1))
    let token = hashParams.get('access_token')
    
    // Also check query params for custom token (nodemailer fallback)
    const queryParams = new URLSearchParams(location.search)
    const queryToken = queryParams.get('token')
    
    if (token) {
      localStorage.setItem('reset_token', token)
    } else if (queryToken) {
      localStorage.setItem('reset_token', queryToken)
    }
  }, [location])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    const token = localStorage.getItem('reset_token')
    
    if (!token) {
      setError('No reset token found. Please request a new password reset.')
      setLoading(false)
      return
    }

    const result = await updatePassword(password, token)

    if (result.success) {
      setMessage('Password updated successfully! Redirecting to login...')
      localStorage.removeItem('reset_token')
      setTimeout(() => navigate('/login'), 3000)
    } else {
      setError(result.error || 'Failed to update password')
    }
    setLoading(false)
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Reset Password</h2>
        
        {message && (
          <div className="login-success">
            {message}
          </div>
        )}
        
        {error && (
          <div className="login-error">
            {error}
          </div>
        )}
        
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-form-group">
            <label className="login-label">New Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="login-input"
              required
            />
          </div>

          <div className="login-form-group">
            <label className="login-label">Confirm New Password</label>
            <input 
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              className="login-input"
              required
            />
          </div>

          <button 
            type="submit" 
            className="login-btn" 
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Reset Password'}
          </button>
        </form>

        <p className="login-footer">
          <a href="/login">Back to Login</a>
        </p>
      </div>
    </div>
  )
}

export default ResetPassword