import { useState, useEffect } from "react"
import { supabase } from "../../config/supabaseClient"

function AdminHotels() {
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingHotel, setEditingHotel] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    price_per_night: '',
    description: '',
    image_url: '',
    rating: 4.5,
    amenities: []
  })
  const [amenitiesInput, setAmenitiesInput] = useState("")

  useEffect(() => {
    fetchHotels()
  }, [])

  const fetchHotels = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('hotels')
      .select('*')
      .order('name')

    if (error) {
      console.error('Error fetching hotels:', error)
    } else {
      setHotels(data || [])
    }
    setLoading(false)
  }

  const handleAddHotel = () => {
    setEditingHotel(null)
    setFormData({
      name: '',
      location: '',
      price_per_night: '',
      description: '',
      image_url: '',
      rating: 4.5,
      amenities: []
    })
    setAmenitiesInput("")
    setShowModal(true)
  }

  const handleEditHotel = (hotel) => {
    setEditingHotel(hotel)
    setFormData({
      name: hotel.name,
      location: hotel.location,
      price_per_night: hotel.price_per_night,
      description: hotel.description || '',
      image_url: hotel.image_url || '',
      rating: hotel.rating || 4.5,
      amenities: hotel.amenities || []
    })
    setAmenitiesInput((hotel.amenities || []).join(', '))
    setShowModal(true)
  }

  const handleDeleteHotel = async (hotel) => {
    if (!confirm(`Are you sure you want to delete "${hotel.name}"? This will also delete all bookings for this hotel.`)) {
      return
    }

    const { error: bookingsError } = await supabase
      .from('bookings')
      .delete()
      .eq('hotel_id', hotel.id)

    if (bookingsError) {
      console.error('Error deleting bookings:', bookingsError)
    }

    const { error } = await supabase
      .from('hotels')
      .delete()
      .eq('id', hotel.id)

    if (error) {
      alert('Error deleting hotel: ' + error.message)
    } else {
      alert(`Hotel "${hotel.name}" deleted successfully`)
      fetchHotels()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const amenitiesArray = amenitiesInput
      .split(',')
      .map(item => item.trim())
      .filter(item => item !== "")

    const hotelData = {
      name: formData.name,
      location: formData.location,
      price_per_night: parseInt(formData.price_per_night),
      description: formData.description,
      image_url: formData.image_url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
      rating: parseFloat(formData.rating),
      amenities: amenitiesArray
    }

    let error
    if (editingHotel) {
      const { error: updateError } = await supabase
        .from('hotels')
        .update(hotelData)
        .eq('id', editingHotel.id)
      error = updateError
    } else {
      const { error: insertError } = await supabase
        .from('hotels')
        .insert([hotelData])
      error = insertError
    }

    if (error) {
      alert('Error saving hotel: ' + error.message)
    } else {
      alert(editingHotel ? 'Hotel updated successfully' : 'Hotel added successfully')
      setShowModal(false)
      fetchHotels()
    }
  }

  const filteredHotels = hotels.filter(hotel =>
    hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotel.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatCurrency = (amount) => {
    return '₦' + amount.toLocaleString()
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>Loading hotels...</div>
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>Hotels Management</h1>
          <p>Add, edit, or remove hotels from your portfolio</p>
        </div>
        <button className="admin-add-btn" onClick={handleAddHotel}>
          <span className="material-symbols-outlined">add</span>
          ADD NEW HOTEL
        </button>
      </div>

      <div className="admin-search-bar">
        <input
          type="text"
          className="admin-search-input"
          placeholder="Search hotels by name or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="admin-table-card">
        <div className="admin-table-header">
          <h4>All Hotels ({filteredHotels.length})</h4>
        </div>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Location</th>
                <th>Price/Night</th>
                <th>Rating</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredHotels.map((hotel) => (
                <tr key={hotel.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        backgroundColor: '#2a2a2a'
                      }}>
                        <img 
                          src={hotel.image_url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'} 
                          alt={hotel.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <div>
                        <div style={{ fontWeight: '500' }}>{hotel.name}</div>
                        <div style={{ fontSize: '12px', color: '#d2c5b2' }}>
                          {hotel.amenities?.slice(0, 2).join(', ')}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{hotel.location}</td>
                  <td style={{ fontWeight: 'bold', color: '#f0bf65' }}>
                    {formatCurrency(hotel.price_per_night)}
                  </td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#f0bf65' }}>star</span>
                      {hotel.rating}
                    </span>
                  </td>
                  <td>
                    <span className="admin-status-confirmed">Active</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="admin-action-btn" onClick={() => handleEditHotel(hotel)} title="Edit hotel">
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                    <button className="admin-action-btn delete" onClick={() => handleDeleteHotel(hotel)} title="Delete hotel">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <>
          <div className="admin-modal-overlay" onClick={() => setShowModal(false)}></div>
          <div className="admin-modal">
            <h3>{editingHotel ? 'Edit Hotel' : 'Add New Hotel'}</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Hotel Name *"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Location *"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
              <input
                type="number"
                placeholder="Price per Night (₦) *"
                required
                value={formData.price_per_night}
                onChange={(e) => setFormData({ ...formData, price_per_night: e.target.value })}
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
              <input
                type="text"
                placeholder="Amenities (comma separated)"
                value={amenitiesInput}
                onChange={(e) => setAmenitiesInput(e.target.value)}
              />
              <textarea
                rows="3"
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <div className="admin-modal-buttons">
                <button type="button" className="admin-modal-cancel" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-modal-submit">
                  {editingHotel ? 'Update Hotel' : 'Add Hotel'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  )
}

export default AdminHotels