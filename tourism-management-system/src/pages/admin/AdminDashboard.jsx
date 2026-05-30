import { useState, useEffect } from "react"
import { supabase } from "../../config/supabaseClient"

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalHotels: 0,
    totalBookings: 0,
    totalUsers: 0,
    recentBookings: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    setLoading(true)

    try {
      // Get total hotels
      const { count: hotelsCount } = await supabase
        .from('hotels')
        .select('*', { count: 'exact', head: true })

      // Get total bookings
      const { count: bookingsCount } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })

      // Get total users
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      // Get recent bookings
      const { data: recentBookings } = await supabase
        .from('bookings')
        .select(`
          id,
          check_in,
          check_out,
          total_price,
          status,
          hotels (name, location),
          profiles (name)
        `)
        .order('created_at', { ascending: false })
        .limit(5)

      setStats({
        totalHotels: hotelsCount || 0,
        totalBookings: bookingsCount || 0,
        totalUsers: usersCount || 0,
        recentBookings: recentBookings || []
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return '₦' + amount.toLocaleString()
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px', color: 'white' }}>Loading dashboard...</div>
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>Dashboard Overview</h1>
          <p>Insights for premium hotel management</p>
        </div>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <span className="material-symbols-outlined">hotel</span>
          </div>
          <p className="admin-stat-label">Total Hotels</p>
          <p className="admin-stat-value">{stats.totalHotels}</p>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <span className="material-symbols-outlined">book_online</span>
          </div>
          <p className="admin-stat-label">Total Bookings</p>
          <p className="admin-stat-value">{stats.totalBookings}</p>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <span className="material-symbols-outlined">group</span>
          </div>
          <p className="admin-stat-label">Total Users</p>
          <p className="admin-stat-value">{stats.totalUsers}</p>
        </div>
      </div>

      <div className="admin-table-card">
        <div className="admin-table-header">
          <h4>Recent Bookings</h4>
        </div>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Guest</th>
                <th>Hotel</th>
                <th>Dates</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentBookings.map((booking) => (
                <tr key={booking.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(240, 191, 101, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#f0bf65',
                        fontWeight: 'bold',
                        fontSize: '12px'
                      }}>
                        {booking.profiles?.name?.charAt(0) || 'U'}
                      </div>
                      <span>{booking.profiles?.name || 'Guest'}</span>
                    </div>
                  </td>
                  <td>{booking.hotels?.name || 'Unknown'}</td>
                  <td>
                    {new Date(booking.check_in).toLocaleDateString()} - {new Date(booking.check_out).toLocaleDateString()}
                  </td>
                  <td style={{ fontWeight: 'bold', color: '#f0bf65' }}>
                    {formatCurrency(booking.total_price)}
                  </td>
                  <td>
                    <span className={booking.status === 'confirmed' ? 'admin-status-confirmed' : 'admin-status-pending'}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard