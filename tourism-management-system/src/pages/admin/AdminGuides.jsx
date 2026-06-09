import { useState, useEffect } from "react"
import { supabase } from "../../config/supabaseClient"

function AdminGuides() {
  const [guides, setGuides] = useState([])
  const [guideBookings, setGuideBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingGuide, setEditingGuide] = useState(null)
  const [activeTab, setActiveTab] = useState("guides")
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    experience: '',
    story: '',
    price_per_day: '',
    image_url: '',
    rating: 4.5
  })

  useEffect(() => {
    fetchGuides()
    fetchGuideBookings()
  }, [])

  const fetchGuides = async () => {
    try {
      const { data, error } = await supabase
        .from('guides')
        .select('*')
        .order('name')

      if (error) throw error
      setGuides(data || [])
    } catch (err) {
      console.error('Error fetching guides:', err)
      setError(err.message)
    }
  }

  const fetchGuideBookings = async () => {
    try {
      const { data: bookings, error: bookingsError } = await supabase
        .from('guide_bookings')
        .select('*')
        .order('created_at', { ascending: false })

      if (bookingsError) throw bookingsError

      if (bookings && bookings.length > 0) {
       
        const guideIds = [...new Set(bookings.map(b => b.guide_id))]
        const { data: guides, error: guidesError } = await supabase
          .from('guides')
          .select('id, name, location')
          .in('id', guideIds)

        if (guidesError) throw guidesError


        const userIds = [...new Set(bookings.map(b => b.user_id))]
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, name, email')
          .in('id', userIds)

        if (profilesError) throw profilesError

        const guidesMap = {}
        guides?.forEach(g => { guidesMap[g.id] = g })

        const profilesMap = {}
        profiles?.forEach(p => { profilesMap[p.id] = p })

        const enrichedBookings = bookings.map(booking => ({
          ...booking,
          guides: guidesMap[booking.guide_id] || { name: 'Unknown Guide' },
          profiles: profilesMap[booking.user_id] || { name: 'Unknown User' }
        }))

        setGuideBookings(enrichedBookings)
      } else {
        setGuideBookings([])
      }
    } catch (err) {
      console.error('Error fetching guide bookings:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddGuide = () => {
    setEditingGuide(null)
    setFormData({
      name: '',
      location: '',
      experience: '',
      story: '',
      price_per_day: '',
      image_url: '',
      rating: 4.5
    })
    setShowModal(true)
  }

  const handleEditGuide = (guide) => {
    setEditingGuide(guide)
    setFormData({
      name: guide.name,
      location: guide.location,
      experience: guide.experience || '',
      story: guide.story || '',
      price_per_day: guide.price_per_day,
      image_url: guide.image_url || '',
      rating: guide.rating || 4.5
    })
    setShowModal(true)
  }

  const handleDeleteGuide = async (guide) => {
    if (!confirm(`Delete "${guide.name}"? This deletes all their bookings too.`)) return

    await supabase.from('guide_bookings').delete().eq('guide_id', guide.id)
    
    const { error } = await supabase.from('guides').delete().eq('id', guide.id)
    
    if (error) {
      alert('Error: ' + error.message)
    } else {
      alert(`Guide "${guide.name}" deleted`)
      fetchGuides()
      fetchGuideBookings()
    }
  }

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    const { error } = await supabase
      .from('guide_bookings')
      .update({ status: newStatus })
      .eq('id', bookingId)

    if (error) {
      alert('Error: ' + error.message)
    } else {
      alert(`Status updated to ${newStatus}`)
      fetchGuideBookings()
    }
  }

  const handleDeleteBooking = async (booking) => {
    if (!confirm(`Delete this booking?`)) return

    const { error } = await supabase
      .from('guide_bookings')
      .delete()
      .eq('id', booking.id)

    if (error) {
      alert('Error: ' + error.message)
    } else {
      alert('Booking deleted')
      fetchGuideBookings()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const guideData = {
      name: formData.name,
      location: formData.location,
      experience: formData.experience,
      story: formData.story,
      price_per_day: parseInt(formData.price_per_day),
      image_url: formData.image_url || 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg',
      rating: parseFloat(formData.rating)
    }

    let error
    if (editingGuide) {
      const { error: updateError } = await supabase
        .from('guides')
        .update(guideData)
        .eq('id', editingGuide.id)
      error = updateError
    } else {
      const { error: insertError } = await supabase
        .from('guides')
        .insert([guideData])
      error = insertError
    }

    if (error) {
      alert('Error: ' + error.message)
    } else {
      alert(editingGuide ? 'Guide updated' : 'Guide added')
      setShowModal(false)
      fetchGuides()
    }
  }

  const filteredGuides = guides.filter(guide =>
    guide.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guide.location?.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
    return <div className="admin-loading">Loading tour guides...</div>
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>Tour Guides Management</h1>
          <p>Manage tour guides and view their bookings</p>
        </div>
        <button className="admin-add-btn" onClick={handleAddGuide}>
          <span className="material-symbols-outlined">add</span>
          ADD NEW GUIDE
        </button>
      </div>

      <div className="admin-tabs">
        <button 
          className={`admin-tab ${activeTab === 'guides' ? 'active' : ''}`}
          onClick={() => setActiveTab('guides')}
        >
          Tour Guides ({guides.length})
        </button>
        <button 
          className={`admin-tab ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          Guide Bookings ({guideBookings.length})
        </button>
      </div>

      {activeTab === 'guides' && (
        <>
          <div className="admin-search-bar">
            <input
              type="text"
              className="admin-search-input"
              placeholder="Search guides by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="admin-table-card">
            <div className="admin-table-header">
              <h4>All Tour Guides</h4>
            </div>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Guide</th>
                    <th>Location</th>
                    <th>Price/Day</th>
                    <th>Rating</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGuides.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '60px' }}>
                        No tour guides found.
                      </td>
                    </tr>
                  ) : (
                    filteredGuides.map((guide) => (
                      <tr key={guide.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{
                              width: '56px',
                              height: '56px',
                              borderRadius: '50%',
                              overflow: 'hidden',
                              backgroundColor: '#2a2a2a'
                            }}>
                              <img 
                                src={guide.image_url || 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg'} 
                                alt={guide.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            </div>
                            <div>
                              <div style={{ fontWeight: '500' }}>{guide.name}</div>
                              <div style={{ fontSize: '12px', color: '#d2c5b2' }}>
                                {guide.experience?.substring(0, 60)}...
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>{guide.location}</td>
                        <td style={{ fontWeight: 'bold', color: '#f0bf65' }}>
                          {formatCurrency(guide.price_per_day)}
                        </td>
                        <td>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#f0bf65' }}>star</span>
                            {guide.rating}
                          </span>
                        </td>
                        <td>
                          <span className="admin-status-confirmed">Active</span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button className="admin-action-btn" onClick={() => handleEditGuide(guide)}>
                            <span className="material-symbols-outlined">edit</span>
                          </button>
                          <button className="admin-action-btn delete" onClick={() => handleDeleteGuide(guide)}>
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'bookings' && (
        <div className="admin-table-card">
          <div className="admin-table-header">
            <h4>All Guide Bookings ({guideBookings.length})</h4>
          </div>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Guide</th>
                  <th>Tour Date</th>
                  <th>Group Size</th>
                  <th>Duration</th>
                  <th>Total Price</th>
                  <th>Status</th>
                  <th>Booked On</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {guideBookings.length === 0 ? (
                  <tr>
                    <td colSpan="9" style={{ textAlign: 'center', padding: '60px' }}>
                      No guide bookings found.
                    </td>
                  </tr>
                ) : (
                  guideBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>{booking.profiles?.name || 'Unknown User'}</td>
                      <td>{booking.guides?.name || 'Unknown Guide'}</td>
                      <td>{new Date(booking.tour_date).toLocaleDateString()}</td>
                      <td>{booking.group_size} people</td>
                      <td>{booking.duration_days} day(s)</td>
                      <td className="admin-price">{formatCurrency(booking.total_price)}</td>
                      <td>
                        <select
                          value={booking.status}
                          onChange={(e) => handleUpdateBookingStatus(booking.id, e.target.value)}
                          className="admin-status-select"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td>{new Date(booking.created_at).toLocaleDateString()}</td>
                      <td className="admin-actions">
                        <button className="admin-action-delete" onClick={() => handleDeleteBooking(booking)}>
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <>
          <div className="admin-modal-overlay" onClick={() => setShowModal(false)}></div>
          <div className="admin-modal">
            <h3>{editingGuide ? 'Edit Tour Guide' : 'Add New Tour Guide'}</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Full Name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Location"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
              <input
                type="text"
                placeholder="Experience"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              />
              <input
                type="number"
                placeholder="Price per Day (₦)"
                required
                value={formData.price_per_day}
                onChange={(e) => setFormData({ ...formData, price_per_day: e.target.value })}
              />
              <input
                type="number"
                step="0.1"
                placeholder="Rating (1-5)"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
              />
              <input
                type="text"
                placeholder="Image URL"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              />
              <textarea
                rows="3"
                placeholder="Story / Bio"
                value={formData.story}
                onChange={(e) => setFormData({ ...formData, story: e.target.value })}
              />
              <div className="admin-modal-buttons">
                <button type="button" className="admin-modal-cancel" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-modal-submit">
                  {editingGuide ? 'Update Guide' : 'Add Guide'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  )
}

export default AdminGuides