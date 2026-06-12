import { useState } from "react"
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"

function AdminLayout() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navItems = [
    { path: "/admin", icon: "dashboard", label: "Dashboard" },
    { path: "/admin/hotels", icon: "hotel", label: "Hotels" },
    { path: "/admin/bookings", icon: "book_online", label: "Bookings" },
    { path: "/admin/users", icon: "group", label: "Users" },
    { path: "/admin/packages", icon: "card_travel", label: "Packages" },
    { path: "/admin/guides", icon: "tour", label: "Tour Guides" },
  ]

  const isActive = (path) => {
    if (path === "/admin" && location.pathname === "/admin") return true
    if (path !== "/admin" && location.pathname.startsWith(path)) return true
    return false
  }

  return (
    <div className="admin-layout">
      
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <h1>TourEase</h1>
        </div>
        <nav className="admin-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-nav-item ${isActive(item.path) ? 'active' : ''}`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="admin-logout">
          <button onClick={handleLogout}>
            <span className="material-symbols-outlined">logout</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

    
      <header className="admin-mobile-header">
        <button className="admin-mobile-menu-btn" onClick={() => setMobileMenuOpen(true)}>
          <span className="material-symbols-outlined">menu</span>
        </button>
        <h2>TourEase Admin</h2>
        <div className="admin-mobile-avatar">
          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGVOyXME1lhBpkSVxE2bZj2ou23OKBYP2Cz1VeVo8EwHlvNDGXBHXM89DugINa-LFktYkb_CB62O_WxGnts8sn2OsZkki8apmZ4oZAcd3kijlnW_KWDy6TEkf6IvfeE_4Dz2xm3tBGE2wB_gQmA-4Ugm4afIvbfVRiXAx-ywgN08LZM0H5QbDTjm0kVnc4nYgaRTKJ1wdcUABRaSOC0BiQSilVmMgBJgqTmlixfVEXAj_eO5SYpleCi_qu2vl_1tFHOjsnNe1v-Q" alt="Admin" />
        </div>
      </header>

     
      <nav className="admin-bottom-nav">
        {navItems.map((item) => (
          <Link key={item.path} to={item.path} className={isActive(item.path) ? 'active' : ''}>
            <span className="material-symbols-outlined">{item.icon}</span>
          </Link>
        ))}
      </nav>

     
      {mobileMenuOpen && (
        <>
          <div className="admin-drawer-overlay" onClick={() => setMobileMenuOpen(false)}></div>
          <div className={`admin-mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
            <div className="admin-drawer-header">
              <h1>TourEase</h1>
            </div>
            <nav className="admin-drawer-nav">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path} className={isActive(item.path) ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>
                  <span className="material-symbols-outlined">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
            <div className="admin-drawer-logout">
              <button onClick={handleLogout}>
                <span className="material-symbols-outlined">logout</span>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </>
      )}

      
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout