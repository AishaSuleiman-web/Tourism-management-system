import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '../services/authService'

function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [serverMessage, setServerMessage] = useState('')
  const [messageType, setMessageType] = useState('') // 'success' or 'error'
  const navigate = useNavigate()

  // Auto-dismiss message after 5 seconds
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
      // Handle rate limit error specifically
      if (result.error && result.error.toLowerCase().includes('rate limit')) {
        setServerMessage('Too many registration attempts. Please wait a few minutes before trying again.')
      } else {
        setServerMessage(result.error || 'Registration failed. Please try again.')
      }
    }
    setLoading(false)
  }

  // Message styles
  const messageStyles = {
    success: {
      backgroundColor: '#D1FAE5',
      color: '#065F46',
      borderLeft: '4px solid #10B981'
    },
    error: {
      backgroundColor: '#FEE2E2',
      color: '#DC2626',
      borderLeft: '4px solid #EF4444'
    }
  }

  const currentMessageStyle = messageType === 'success' ? messageStyles.success : messageStyles.error

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '30px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Create Account</h2>
      
      {serverMessage && (
        <div style={{ 
          ...currentMessageStyle, 
          padding: '12px', 
          borderRadius: '8px', 
          marginBottom: '20px', 
          textAlign: 'center',
          animation: 'fadeOut 5s forwards'
        }}>
          {serverMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Full Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} style={{ width: '100%', padding: '10px', marginTop: '5px', border: `1px solid ${errors.name ? '#DC2626' : '#D1D5DB'}`, borderRadius: '8px' }} />
          {errors.name && <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '5px' }}>{errors.name}</p>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} style={{ width: '100%', padding: '10px', marginTop: '5px', border: `1px solid ${errors.email ? '#DC2626' : '#D1D5DB'}`, borderRadius: '8px' }} />
          {errors.email && <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '5px' }}>{errors.email}</p>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} style={{ width: '100%', padding: '10px', marginTop: '5px', border: `1px solid ${errors.password ? '#DC2626' : '#D1D5DB'}`, borderRadius: '8px' }} />
          {errors.password && <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '5px' }}>{errors.password}</p>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Confirm Password</label>
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} style={{ width: '100%', padding: '10px', marginTop: '5px', border: `1px solid ${errors.confirmPassword ? '#DC2626' : (formData.confirmPassword && !errors.confirmPassword ? '#10B981' : '#D1D5DB')}`, borderRadius: '8px' }} />
          {errors.confirmPassword ? <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '5px' }}>{errors.confirmPassword}</p> : formData.confirmPassword && !errors.confirmPassword && <p style={{ color: '#10B981', fontSize: '12px', marginTop: '5px' }}>✓ Passwords match</p>}
        </div>

        <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', backgroundColor: loading ? '#9CA3AF' : '#3B82F6', color: 'white', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer' }}>
          {loading ? 'Creating Account...' : 'Register'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '20px' }}>Already have an account? <a href="/login">Login</a></p>
      
      <style>{`
        @keyframes fadeOut {
          0% { opacity: 1; }
          70% { opacity: 1; }
          100% { opacity: 0; visibility: hidden; }
        }
      `}</style>
    </div>
  )
}

export default Register