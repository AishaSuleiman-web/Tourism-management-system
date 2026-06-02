import { useState } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <nav className="navbar">
        
        <div className="logo">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
            TourEase
          </Link>
        </div>

        <div className="nav-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/hotels">Hotels</NavLink>
          <NavLink to="/destinations">Destinations</NavLink>
          <NavLink to="/guides">Tour Guides</NavLink>
          
          {/* Admin link for admin users */}
          {isAuthenticated && user?.is_admin && (
            <NavLink to="/admin">Admin</NavLink>
          )}
        </div>

        <div className="auth-buttons">
          {isAuthenticated ? (
            <>
              <NavLink to="/my-bookings">My Bookings</NavLink>
             
              <div className="profile-btn-container">
                <button className="profile-btn">
                  {user?.name || 'Profile'}
                </button>
              </div>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/register">
                <button className="signup-btn">Sign Up</button>
              </Link>
              <Link to="/login">
                <button className="login-btn">Log In</button>
              </Link>
            </>
          )}
        </div>

        <button 
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </nav>

      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</NavLink>
        <NavLink to="/hotels" onClick={() => setIsMobileMenuOpen(false)}>Hotels</NavLink>
        <NavLink to="/destinations" onClick={() => setIsMobileMenuOpen(false)}>Destinations</NavLink>
        <NavLink to="/tours" onClick={() => setIsMobileMenuOpen(false)}>Tour Guides</NavLink>
        
        {/* Admin link in mobile menu */}
        {isAuthenticated && user?.is_admin && (
          <NavLink to="/admin" onClick={() => setIsMobileMenuOpen(false)}>Admin</NavLink>
        )}
        
        <div style={{ height: '1px', backgroundColor: '#333', margin: '8px 0' }}></div>
        
        {isAuthenticated ? (
          <>
            <NavLink to="/my-bookings" onClick={() => setIsMobileMenuOpen(false)}>My Bookings</NavLink>
            
            <div className="mobile-profile-name">
              {user?.name || 'Profile'}
            </div>
            <button 
              className="logout-btn" 
              onClick={handleLogout}
              style={{ width: '100%' }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
              <button className="signup-btn" style={{ width: '100%' }}>Sign Up</button>
            </Link>
            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
              <button className="login-btn" style={{ width: '100%' }}>Log In</button>
            </Link>
          </>
        )}
      </div>
    </>
  )
}

export default Navbar