import { useState, useEffect } from "react"
import { supabase } from "../../config/supabaseClient"

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalHotels: 0,
    totalGuides: 0,
    totalPackages: 0,
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
      
      const { count: hotelsCount } = await supabase
        .from('hotels')
        .select('*', { count: 'exact', head: true })

      
      const { count: guidesCount } = await supabase
        .from('guides')
        .select('*', { count: 'exact', head: true })

      
      const { count: packagesCount } = await supabase
        .from('travel_packages')
        .select('*', { count: 'exact', head: true })

      
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      
      const [hotelBookings, guideBookings, packageBookings] = await Promise.all([
        supabase.from('bookings').select('*, hotels(name), profiles(name)').order('created_at', { ascending: false }).limit(3),
        supabase.from('guide_bookings').select('*, guides(name), profiles(name)').order('created_at', { ascending: false }).limit(3),
        supabase.from('package_bookings').select('*, travel_packages(destination), profiles(name)').order('created_at', { ascending: false }).limit(3)
      ])

      
      const allBookings = [
        ...(hotelBookings.data || []).map(b => ({
          ...b,
          type: 'hotel',
          typeLabel: 'Hotel',
          item_name: b.hotels?.name,
          date_display: `${new Date(b.check_in).toLocaleDateString()} - ${new Date(b.check_out).toLocaleDateString()}`,
          price: b.total_price
        })),
        ...(guideBookings.data || []).map(b => ({
          ...b,
          type: 'guide',
          typeLabel: 'Tour Guide',
          item_name: b.guides?.name,
          date_display: new Date(b.tour_date).toLocaleDateString(),
          price: b.total_price
        })),
        ...(packageBookings.data || []).map(b => ({
          ...b,
          type: 'package',
          typeLabel: 'Package',
          item_name: b.travel_packages?.destination,
          date_display: new Date(b.booking_date).toLocaleDateString(),
          price: b.total_price
        }))
      ]

     
      allBookings.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      

      const [{ count: hotelCount }, { count: guideCount }, { count: packageCount }] = await Promise.all([
        supabase.from('bookings').select('*', { count: 'exact', head: true }),
        supabase.from('guide_bookings').select('*', { count: 'exact', head: true }),
        supabase.from('package_bookings').select('*', { count: 'exact', head: true })
      ])

      const totalBookings = (hotelCount || 0) + (guideCount || 0) + (packageCount || 0)

      setStats({
        totalHotels: hotelsCount || 0,
        totalGuides: guidesCount || 0,
        totalPackages: packagesCount || 0,
        totalBookings: totalBookings,
        totalUsers: usersCount || 0,
        recentBookings: allBookings.slice(0, 5)
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

  const getTypeColor = (type) => {
    switch(type) {
      case 'hotel': return '#3B82F6'
      case 'guide': return '#10B981'
      case 'package': return '#F59E0B'
      default: return '#666'
    }
  }

  if (loading) {
    return <div className="admin-loading">Loading dashboard...</div>
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>Dashboard Overview</h1>
          <p>Insights for hotel, tour guide, and package management</p>
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
            <span className="material-symbols-outlined">tour</span>
          </div>
          <p className="admin-stat-label">Tour Guides</p>
          <p className="admin-stat-value">{stats.totalGuides}</p>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <span className="material-symbols-outlined">card_travel</span>
          </div>
          <p className="admin-stat-label">Travel Packages</p>
          <p className="admin-stat-value">{stats.totalPackages}</p>
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
                <th>Type</th>
                <th>Guest</th>
                <th>Item / Service</th>
                <th>Date(s)</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentBookings.map((booking, index) => (
                <tr key={`${booking.type}-${booking.id}-${index}`}>
                  <td style={{ color: getTypeColor(booking.type), fontWeight: 'bold' }}>
                    {booking.typeLabel}
                  </td>
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
                  <td>{booking.item_name || 'Unknown'}</td>
                  <td>{booking.date_display}</td>
                  <td style={{ fontWeight: 'bold', color: '#f0bf65' }}>
                    {formatCurrency(booking.price)}
                  </td>
                  <td>
                    <span className={booking.status === 'confirmed' ? 'admin-status-confirmed' : 'admin-status-pending'}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
              {stats.recentBookings.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                    No recent bookings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard