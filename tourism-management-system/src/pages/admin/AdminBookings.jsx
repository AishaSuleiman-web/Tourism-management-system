import { useState, useEffect } from "react"
import { supabase } from "../../config/supabaseClient"

function AdminBookings() {
  const [hotelBookings, setHotelBookings] = useState([])
  const [guideBookings, setGuideBookings] = useState([])
  const [packageBookings, setPackageBookings] = useState([])
  const [allBookings, setAllBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [editingStatus, setEditingStatus] = useState(null)

  useEffect(() => {
    fetchAllBookings()
  }, [])

  const fetchAllBookings = async () => {
    setLoading(true)
    try {
      // Fetch Hotel Bookings
      const { data: hotels, error: hotelError } = await supabase
        .from('bookings')
        .select(`
          *,
          hotels (name, location),
          profiles (name, email)
        `)
        .order('created_at', { ascending: false })

      if (hotelError) throw hotelError

      const hotelBookingsWithType = (hotels || []).map(booking => ({
        ...booking,
        booking_type: 'hotel',
        item_name: booking.hotels?.name || 'Unknown Hotel',
        item_location: booking.hotels?.location || ''
      }))

      // Fetch Guide Bookings
      const { data: guides, error: guideError } = await supabase
        .from('guide_bookings')
        .select(`
          *,
          guides (name, location),
          profiles (name, email)
        `)
        .order('created_at', { ascending: false })

      if (guideError) throw guideError

      const guideBookingsWithType = (guides || []).map(booking => ({
        ...booking,
        booking_type: 'guide',
        item_name: booking.guides?.name || 'Unknown Guide',
        item_location: booking.guides?.location || '',
        check_in: booking.tour_date,
        check_out: booking.tour_date,
        number_of_guests: booking.group_size,
        duration: booking.duration_days
      }))

      // Fetch Package Bookings
      const { data: packages, error: packageError } = await supabase
        .from('package_bookings')
        .select(`
          *,
          travel_packages (destination, duration, price),
          profiles (name, email)
        `)
        .order('created_at', { ascending: false })

      if (packageError) throw packageError

      const packageBookingsWithType = (packages || []).map(booking => ({
        ...booking,
        booking_type: 'package',
        item_name: booking.travel_packages?.destination || 'Unknown Package',
        item_location: '',
        check_in: booking.booking_date,
        check_out: booking.booking_date,
        number_of_guests: booking.number_of_people,
        total_price: booking.total_price
      }))

      setHotelBookings(hotelBookingsWithType)
      setGuideBookings(guideBookingsWithType)
      setPackageBookings(packageBookingsWithType)

      const all = [...hotelBookingsWithType, ...guideBookingsWithType, ...packageBookingsWithType]
      all.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      setAllBookings(all)

    } catch (err) {
      console.error('Error fetching bookings:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateBookingStatus = async (bookingId, newStatus, bookingType) => {
    let table
    switch(bookingType) {
      case 'hotel':
        table = 'bookings'
        break
      case 'guide':
        table = 'guide_bookings'
        break
      case 'package':
        table = 'package_bookings'
        break
      default:
        return
    }

    try {
      const { error } = await supabase
        .from(table)
        .update({ status: newStatus })
        .eq('id', bookingId)

      if (error) throw error
      
      alert(`Booking status updated to ${newStatus}`)
      fetchAllBookings()
    } catch (err) {
      alert('Error updating status: ' + err.message)
    }
    setEditingStatus(null)
  }

  const deleteBooking = async (booking) => {
    if (!confirm(`Delete this ${booking.booking_type} booking? Cannot undo.`)) {
      return
    }

    let table
    switch(booking.booking_type) {
      case 'hotel':
        table = 'bookings'
        break
      case 'guide':
        table = 'guide_bookings'
        break
      case 'package':
        table = 'package_bookings'
        break
      default:
        return
    }

    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', booking.id)

      if (error) throw error
      
      alert('Booking deleted successfully')
      fetchAllBookings()
    } catch (err) {
      alert('Error deleting booking: ' + err.message)
    }
  }

  const getFilteredBookings = () => {
    let filtered = allBookings

    if (typeFilter !== "all") {
      filtered = filtered.filter(booking => booking.booking_type === typeFilter)
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(booking => booking.status === statusFilter)
    }

    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.item_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.profiles?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return filtered
  }

  const formatCurrency = (amount) => {
    return '₦' + amount.toLocaleString()
  }

  const getStatusBadge = (status) => {
    switch(status) {
      case 'confirmed': return 'admin-status-confirmed'
      case 'pending': return 'admin-status-pending'
      case 'cancelled': return 'admin-status-cancelled'
      default: return 'admin-status-pending'
    }
  }

  const getTypeLabel = (type) => {
    switch(type) {
      case 'hotel': return 'Hotel'
      case 'guide': return 'Tour Guide'
      case 'package': return 'Package'
      default: return 'Unknown'
    }
  }

  const filteredBookings = getFilteredBookings()

  if (loading) {
    return <div className="admin-loading">Loading all bookings...</div>
  }

  if (error) {
    return (
      <div className="admin-error">
        Error: {error}
        <button onClick={fetchAllBookings} className="admin-retry-btn">Try Again</button>
      </div>
    )
  }

  const stats = {
    total: allBookings.length,
    hotels: hotelBookings.length,
    guides: guideBookings.length,
    packages: packageBookings.length
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>All Bookings Management</h1>
          <p>View, update, and manage all user bookings (Hotels, Tour Guides & Packages)</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="admin-stats-grid" style={{ marginBottom: '24px' }}>
        <div className="admin-stat-card" style={{ cursor: 'pointer' }} onClick={() => setTypeFilter("all")}>
          <p className="admin-stat-label">Total Bookings</p>
          <p className="admin-stat-value">{stats.total}</p>
        </div>
        <div className="admin-stat-card" style={{ cursor: 'pointer', borderLeft: '3px solid #3B82F6' }} onClick={() => setTypeFilter("hotel")}>
          <p className="admin-stat-label">Hotels</p>
          <p className="admin-stat-value">{stats.hotels}</p>
        </div>
        <div className="admin-stat-card" style={{ cursor: 'pointer', borderLeft: '3px solid #10B981' }} onClick={() => setTypeFilter("guide")}>
          <p className="admin-stat-label">Tour Guides</p>
          <p className="admin-stat-value">{stats.guides}</p>
        </div>
        <div className="admin-stat-card" style={{ cursor: 'pointer', borderLeft: '3px solid #F59E0B' }} onClick={() => setTypeFilter("package")}>
          <p className="admin-stat-label">Packages</p>
          <p className="admin-stat-value">{stats.packages}</p>
        </div>
      </div>

      <div className="admin-filters">
        <div className="admin-search-bar">
          <input
            type="text"
            className="admin-search-input"
            placeholder="Search by item or customer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <select
          className="admin-status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select
          className="admin-status-filter"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="hotel">Hotels Only</option>
          <option value="guide">Tour Guides Only</option>
          <option value="package">Packages Only</option>
        </select>
      </div>

      <div className="admin-table-card">
        <div className="admin-table-header">
          <h4>All Bookings ({filteredBookings.length})</h4>
        </div>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Item / Service</th>
                <th>Customer</th>
                <th>Date(s)</th>
                <th>Guests</th>
                <th>Price</th>
                <th>Status</th>
                <th>Booked On</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => {
                const typeLabel = getTypeLabel(booking.booking_type)
                return (
                  <tr key={`${booking.booking_type}-${booking.id}`}>
                    <td>
                      <span style={{ fontWeight: 'bold' }}>
                        {typeLabel}
                      </span>
                    </td>
                    <td>
                      <div>
                        <div style={{ fontWeight: '500' }}>{booking.item_name}</div>
                        {booking.item_location && (
                          <div style={{ fontSize: '12px', color: '#d2c5b2' }}>
                            Location: {booking.item_location}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>{booking.profiles?.name || 'Guest'}</td>
                    <td>
                      {booking.check_in === booking.check_out 
                        ? new Date(booking.check_in).toLocaleDateString()
                        : `${new Date(booking.check_in).toLocaleDateString()} - ${new Date(booking.check_out).toLocaleDateString()}`
                      }
                    </td>
                    <td>{booking.number_of_guests || booking.group_size || booking.number_of_people || 1}</td>
                    <td className="admin-price">{formatCurrency(booking.total_price)}</td>
                    <td>
                      {editingStatus === `${booking.booking_type}-${booking.id}` ? (
                        <select
                          value={booking.status}
                          onChange={(e) => updateBookingStatus(booking.id, e.target.value, booking.booking_type)}
                          className="admin-status-select"
                        >
                          <option value="confirmed">Confirmed</option>
                          <option value="pending">Pending</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      ) : (
                        <span className={getStatusBadge(booking.status)}>{booking.status}</span>
                      )}
                    </td>
                    <td>{new Date(booking.created_at).toLocaleDateString()}</td>
                    <td className="admin-actions">
                      {editingStatus === `${booking.booking_type}-${booking.id}` ? (
                        <button className="admin-action-cancel" onClick={() => setEditingStatus(null)}>Cancel</button>
                      ) : (
                        <button className="admin-action-edit" onClick={() => setEditingStatus(`${booking.booking_type}-${booking.id}`)} title="Update status">
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                      )}
                      <button className="admin-action-delete" onClick={() => deleteBooking(booking)} title="Delete booking">
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredBookings.length === 0 && (
        <div className="admin-empty-state">
          No bookings found. 
          {allBookings.length > 0 && <span> Try changing your search or filters.</span>}
        </div>
      )}
    </div>
  )
}

export default AdminBookings