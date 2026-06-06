import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../utils/storage'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const user = loginUser(email, password)
    if (!user) {
      setError('Invalid email or password.')
      return
    }
    if (user.role !== 'admin') {
      setError('Access denied. Admin only.')
      return
    }
    navigate('/dashboard')
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg)',
    }}>
      <div className="card" style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2rem' }}>✈</div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '0.5rem' }}>
            TravelAdmin
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: '4px' }}>
            Sign in to your admin account
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="admin@travel.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '6px',
              padding: '0.6rem 0.75rem',
              color: 'var(--danger)',
              fontSize: '0.82rem',
            }}>
              {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}>
            Sign In
          </button>
        </form>

        <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '0.75rem', marginTop: '1.5rem' }}>
          Demo: admin@travel.com / admin123
        </p>
      </div>
    </div>
  )
}