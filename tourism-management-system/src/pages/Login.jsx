import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { loginUser, forgotPassword } from '../services/authService'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')
  const [showForgot, setShowForgot] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetMessage, setResetMessage] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const validateEmail = (email) => {
    if (!email) return 'Email is required'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return 'Enter a valid email address'
    return ''
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setServerError('')

    const emailError = validateEmail(email)
    const passwordError = !password ? 'Password is required' : ''

    setErrors({ email: emailError, password: passwordError })
    if (emailError || passwordError) return

    setLoading(true)
    const result = await loginUser(email, password)

    if (result.success) {
      login(result.data.user)
      navigate('/dashboard')
    } else {
      setServerError(result.error)
    }
    setLoading(false)
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    setResetMessage('')
    const emailError = validateEmail(resetEmail)
    if (emailError) {
      setErrors({ resetEmail: emailError })
      return
    }

    setLoading(true)
    const result = await forgotPassword(resetEmail)
    if (result.success) {
      setResetMessage('Password reset email sent. Check your inbox.')
      setTimeout(() => setShowForgot(false), 3000)
    } else {
      setResetMessage(result.error)
    }
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '30px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      {!showForgot ? (
        <>
          <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Welcome Back</h2>
          {serverError && <div style={{ backgroundColor: '#FEE2E2', color: '#DC2626', padding: '12px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}>{serverError}</div>}
          
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '15px' }}>
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '5px', border: `1px solid ${errors.email ? '#DC2626' : '#D1D5DB'}`, borderRadius: '8px' }} />
              {errors.email && <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '5px' }}>{errors.email}</p>}
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '5px', border: `1px solid ${errors.password ? '#DC2626' : '#D1D5DB'}`, borderRadius: '8px' }} />
              {errors.password && <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '5px' }}>{errors.password}</p>}
            </div>

            <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', backgroundColor: loading ? '#9CA3AF' : '#3B82F6', color: 'white', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '15px' }}><button onClick={() => setShowForgot(true)} style={{ background: 'none', border: 'none', color: '#3B82F6', cursor: 'pointer' }}>Forgot Password?</button></p>
          <p style={{ textAlign: 'center', marginTop: '10px' }}>Don't have an account? <a href="/register">Register</a></p>
        </>
      ) : (
        <>
          <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Reset Password</h2>
          {resetMessage && <div style={{ backgroundColor: resetMessage.includes('sent') ? '#D1FAE5' : '#FEE2E2', color: resetMessage.includes('sent') ? '#065F46' : '#DC2626', padding: '12px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}>{resetMessage}</div>}
          
          <form onSubmit={handleForgotPassword}>
            <div style={{ marginBottom: '15px' }}>
              <label>Email Address</label>
              <input type="email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '5px', border: `1px solid ${errors.resetEmail ? '#DC2626' : '#D1D5DB'}`, borderRadius: '8px' }} />
              {errors.resetEmail && <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '5px' }}>{errors.resetEmail}</p>}
            </div>

            <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', backgroundColor: loading ? '#9CA3AF' : '#3B82F6', color: 'white', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Sending...' : 'Send Reset Email'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '15px' }}><button onClick={() => setShowForgot(false)} style={{ background: 'none', border: 'none', color: '#3B82F6', cursor: 'pointer' }}>Back to Login</button></p>
        </>
      )}
    </div>
  )
}

export default Login