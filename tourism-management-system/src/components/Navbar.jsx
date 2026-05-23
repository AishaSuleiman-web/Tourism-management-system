import { Link, NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  // Style for active links
  const activeLinkStyle = {
    textDecoration: 'none',
    color: '#7d5800',
    fontWeight: 'bold',
    borderBottom: '2px solid #7d5800',
    paddingBottom: '4px'
  }

  const normalLinkStyle = {
    textDecoration: 'none',
    color: 'white',
    fontWeight: '500'
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 40px',
      backgroundColor: 'black',
      borderBottom: '1px solid #333',
      width: '100%',
      boxSizing: 'border-box',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Logo */}
      <div style={{
        fontSize: '24px',
        fontWeight: 'bold',
        color: 'white'
      }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
          TourEase
        </Link>
      </div>

      {/* Navigation Links - Same for all users */}
      <div style={{
        display: 'flex',
        gap: '32px',
        alignItems: 'center'
      }}>
        <NavLink 
          to="/" 
          style={({ isActive }) => isActive ? activeLinkStyle : normalLinkStyle}
        >
          Home
        </NavLink>
        <NavLink 
          to="/hotels" 
          style={({ isActive }) => isActive ? activeLinkStyle : normalLinkStyle}
        >
          Hotels
        </NavLink>
        <NavLink 
          to="/destinations" 
          style={({ isActive }) => isActive ? activeLinkStyle : normalLinkStyle}
        >
          Destinations
        </NavLink>
        <NavLink 
          to="/tours" 
          style={({ isActive }) => isActive ? activeLinkStyle : normalLinkStyle}
        >
          Tour Guides
        </NavLink>
      </div>
      
      {/* Auth Buttons - Conditional based on login status */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        {isAuthenticated ? (
          <>
            {/* Show these when user is logged in */}
            <NavLink 
              to="/my-bookings" 
              style={({ isActive }) => isActive ? activeLinkStyle : { textDecoration: 'none', color: 'white', fontWeight: '500' }}
            >
              My Bookings
            </NavLink>
            
            {/* Profile Dropdown or Link */}
            <div style={{ position: 'relative' }}>
              <button style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'transparent',
                border: '1px solid #7d5800',
                borderRadius: '30px',
                padding: '6px 16px',
                color: 'white',
                cursor: 'pointer'
              }}>
                <span>👤</span>
                <span>{user?.name || 'Profile'}</span>
              </button>
            </div>

            {/* Logout Button */}
            <button 
              onClick={handleLogout}
              style={{
                padding: '8px 20px',
                backgroundColor: '#dc2626',
                border: 'none',
                borderRadius: '30px',
                color: 'white',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#b91c1c'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#dc2626'}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            {/* Show these when user is NOT logged in */}
            <Link to="/register">
              <button style={{
                padding: '8px 20px',
                backgroundColor: '#7d5800',
                border: 'none',
                borderRadius: '30px',
                color: 'white',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#5c4200'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#7d5800'}
              >
                Sign Up
              </button>
            </Link>
            <Link to="/login">
              <button style={{
                padding: '8px 20px',
                backgroundColor: 'transparent',
                border: '1px solid white',
                borderRadius: '30px',
                color: 'white',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'white'
                e.target.style.color = 'black'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent'
                e.target.style.color = 'white'
              }}
              >
                Log In
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar