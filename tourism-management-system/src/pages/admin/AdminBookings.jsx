import { useState, useEffect } from "react"
import { supabase } from "../../config/supabaseClient"

function AdminBookings() {
  const [bookings, setBookings] = useState([])
  const [hotels, setHotels] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [editingStatus, setEditingStatus] = useState(null)

  useEffect(() => {
    fetchBookings()
    fetchHotels()
  }, [])

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      
     // console.log('Raw bookings data:', data)
      setBookings(data || [])
    } catch (err) {
      console.error('Error fetching bookings:', err)
      setError(err.message)
    }
  }

  const fetchHotels = async () => {
    try {
      const { data, error } = await supabase
        .from('hotels')
        .select('id, name, location')

      if (error) throw error
      
      const hotelsMap = {}
      data?.forEach(hotel => {
        hotelsMap[hotel.id] = hotel
      })
      setHotels(hotelsMap)
    } catch (err) {
      console.error('Error fetching hotels:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId)

      if (error) throw error
      
      alert(`Booking status updated to ${newStatus}`)
      fetchBookings()
    } catch (err) {
      alert('Error updating status: ' + err.message)
    }
    setEditingStatus(null)
  }

  const deleteBooking = async (booking) => {
    if (!confirm(`Delete this booking? Cannot undo.`)) {
      return
    }

    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', booking.id)

      if (error) throw error
      
      alert('Booking deleted successfully')
      fetchBookings()
    } catch (err) {
      alert('Error deleting booking: ' + err.message)
    }
  }

  const filteredBookings = bookings.filter(booking => {
    const hotelName = hotels[booking.hotel_id]?.name?.toLowerCase() || ''
    const matchesSearch = hotelName.includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter
    return matchesSearch && matchesStatus
  })

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

  if (loading) {
    return <div className="admin-loading">Loading bookings...</div>
  }

  if (error) {
    return (
      <div className="admin-error">
        Error: {error}
        <button onClick={() => { fetchBookings(); fetchHotels(); }} className="admin-retry-btn">Try Again</button>
      </div>
    )
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>Bookings Management</h1>
          <p>View, update, and manage all user bookings</p>
        </div>
      </div>

      <div className="admin-filters">
        <div className="admin-search-bar">
          <input
            type="text"
            className="admin-search-input"
            placeholder="Search by hotel..."
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
      </div>

      <div className="admin-table-card">
        <div className="admin-table-header">
          <h4>All Bookings ({filteredBookings.length})</h4>
        </div>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Hotel</th>
                <th>Location</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Guests</th>
                <th>Price</th>
                <th>Status</th>
                <th>Booked On</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{hotels[booking.hotel_id]?.name || 'Unknown Hotel'}</td>
                  <td>{hotels[booking.hotel_id]?.location || ''}</td>
                  <td>{new Date(booking.check_in).toLocaleDateString()}</td>
                  <td>{new Date(booking.check_out).toLocaleDateString()}</td>
                  <td>{booking.number_of_guests}</td>
                  <td className="admin-price">{formatCurrency(booking.total_price)}</td>
                  <td>
                    {editingStatus === booking.id ? (
                      <select
                        value={booking.status}
                        onChange={(e) => updateBookingStatus(booking.id, e.target.value)}
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
                    {editingStatus === booking.id ? (
                      <button className="admin-action-cancel" onClick={() => setEditingStatus(null)}>Cancel</button>
                    ) : (
                      <button className="admin-action-edit" onClick={() => setEditingStatus(booking.id)} title="Update status">
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                    )}
                    <button className="admin-action-delete" onClick={() => deleteBooking(booking)} title="Delete booking">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredBookings.length === 0 && (
        <div className="admin-empty-state">
          No bookings found. 
          {bookings.length > 0 && <span> Try changing your search or filter.</span>}
        </div>
      )}
    </div>
  )
}

export default AdminBookings