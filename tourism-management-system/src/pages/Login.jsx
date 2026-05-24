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

  const getInputClass = (hasError) => {
    return hasError ? 'login-input login-input-error' : 'login-input'
  }

  return (
    <div className="login-container">
      <div className="login-card">
        {!showForgot ? (
          <>
            <h2 className="login-title">Welcome Back</h2>
            {serverError && <div className="login-error">{serverError}</div>}
            
            <form className="login-form" onSubmit={handleLogin}>
              <div className="login-form-group">
                <label className="login-label">Email</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className={getInputClass(errors.email)}
                />
                {errors.email && <p className="login-error-text">{errors.email}</p>}
              </div>

              <div className="login-form-group">
                <label className="login-label">Password</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className={getInputClass(errors.password)}
                />
                {errors.password && <p className="login-error-text">{errors.password}</p>}
              </div>

              <button 
                type="submit" 
                className="login-btn" 
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <p className="login-footer">
              <button 
                onClick={() => setShowForgot(true)} 
                className="login-forgot-btn"
              >
                Forgot Password?
              </button>
            </p>
            <p className="login-footer">
              Don't have an account? <a href="/register">Register</a>
            </p>
          </>
        ) : (
          <>
            <h2 className="forgot-password-title">Reset Password</h2>
            {resetMessage && (
              <div className={resetMessage.includes('sent') ? 'login-success' : 'login-error'}>
                {resetMessage}
              </div>
            )}
            
            <form className="login-form" onSubmit={handleForgotPassword}>
              <div className="login-form-group">
                <label className="login-label">Email Address</label>
                <input 
                  type="email" 
                  value={resetEmail} 
                  onChange={(e) => setResetEmail(e.target.value)} 
                  className={getInputClass(errors.resetEmail)}
                />
                {errors.resetEmail && <p className="login-error-text">{errors.resetEmail}</p>}
              </div>

              <button 
                type="submit" 
                className="login-btn" 
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Email'}
              </button>
            </form>

            <p className="login-footer">
              <button 
                onClick={() => setShowForgot(false)} 
                className="back-to-login-btn"
              >
                Back to Login
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export default Login