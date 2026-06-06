import { NavLink, useNavigate } from 'react-router-dom'
import { logoutUser } from '../utils/storage'

const links = [
  { to: '/dashboard', label: 'Dashboard',  icon: '📊' },
  { to: '/bookings',  label: 'Bookings',   icon: '📋' },
  { to: '/hotels',    label: 'Hotels',     icon: '🏨' },
  { to: '/guides',    label: 'Guides',     icon: '🧭' },
  { to: '/packages',  label: 'Packages',   icon: '📦' },
  { to: '/users',     label: 'Users',      icon: '👥' },
]

export default function Sidebar() {
  const navigate = useNavigate()

  function handleLogout() {
    logoutUser()
    navigate('/login')
  }

  return (
    <aside style={{
      width: 'var(--sidebar-w)',
      background: 'var(--bg2)',
      borderRight: '1px solid var(--border)',
      height: '100vh',
      position: 'fixed',
      top: 0, left: 0,
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem 0',
    }}>
      {/* Logo */}
      <div style={{ padding: '0 1.5rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent)' }}>
          ✈ TravelAdmin
        </div>
        <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: '2px' }}>
          Admin Panel
        </div>
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {links.map(l => (
          <NavLink
            key={l.to}
            to={l.to}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.6rem 0.75rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: isActive ? 600 : 400,
              background: isActive ? 'rgba(59,130,246,0.15)' : 'transparent',
              color: isActive ? 'var(--accent2)' : 'var(--muted)',
              transition: 'all 0.15s',
            })}
          >
            <span>{l.icon}</span>
            <span>{l.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: '0 0.75rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
        <button
          onClick={handleLogout}
          className="btn btn-ghost"
          style={{ width: '100%', justifyContent: 'center' }}
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  )
}