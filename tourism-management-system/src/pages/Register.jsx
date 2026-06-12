import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../services/authService'

function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [serverMessage, setServerMessage] = useState('')
  const [messageType, setMessageType] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (serverMessage) {
      const timer = setTimeout(() => {
        setServerMessage('')
        setMessageType('')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [serverMessage])

  const validateField = (name, value, allData) => {
    if (name === 'name') {
      if (!value.trim()) return 'Full name is required'
      if (value.trim().length < 2) return 'Name must be at least 2 characters'
    }
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!value) return 'Email is required'
      if (!emailRegex.test(value)) return 'Enter a valid email address'
    }
    if (name === 'password') {
      if (!value) return 'Password is required'
      if (value.length < 6) return 'Password must be at least 6 characters'
    }
    if (name === 'confirmPassword') {
      if (!value) return 'Please confirm your password'
      if (value !== allData.password) return 'Passwords do not match'
    }
    return ''
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    const newFormData = { ...formData, [name]: value }
    setFormData(newFormData)
    const error = validateField(name, value, newFormData)
    setErrors(prev => ({ ...prev, [name]: error }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerMessage('')

    const newErrors = {
      name: validateField('name', formData.name, formData),
      email: validateField('email', formData.email, formData),
      password: validateField('password', formData.password, formData),
      confirmPassword: validateField('confirmPassword', formData.confirmPassword, formData)
    }
    setErrors(newErrors)

    if (Object.values(newErrors).some(e => e)) return

    setLoading(true)
    const result = await registerUser({
      name: formData.name.trim(),
      email: formData.email,
      password: formData.password
    })

    if (result.success) {
      setMessageType('success')
      setServerMessage('Registration successful! Please check your email for the confirmation link.')
      setTimeout(() => navigate('/login'), 5000)
    } else {
      setMessageType('error')
      if (result.error && result.error.toLowerCase().includes('rate limit')) {
        setServerMessage('Too many registration attempts. Please wait a few minutes before trying again.')
      } else {
        setServerMessage(result.error || 'Registration failed. Please try again.')
      }
    }
    setLoading(false)
  }

  const getInputClass = (fieldName) => {
    if (errors[fieldName]) return 'form-input form-input-error'
    if (formData[fieldName] && !errors[fieldName] && fieldName === 'confirmPassword') return 'form-input form-input-success'
    return 'form-input'
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Create Account</h2>
        
        {serverMessage && (
          <div className={`register-message register-message-${messageType}`}>
            {serverMessage}
          </div>
        )}
        
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              className={getInputClass('name')}
            />
            {errors.name && <p className="error-text">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              className={getInputClass('email')}
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              className={getInputClass('password')}
            />
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input 
              type="password" 
              name="confirmPassword" 
              value={formData.confirmPassword} 
              onChange={handleChange} 
              className={getInputClass('confirmPassword')}
            />
            {errors.confirmPassword ? (
              <p className="error-text">{errors.confirmPassword}</p>
            ) : formData.confirmPassword && !errors.confirmPassword ? (
              <p className="success-text">✓ Passwords match</p>
            ) : null}
          </div>

          <button 
            type="submit" 
            className="register-btn" 
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="register-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Register