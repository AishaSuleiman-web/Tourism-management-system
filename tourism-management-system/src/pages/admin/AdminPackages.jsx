import { useState, useEffect } from "react"
import { supabase } from "../../config/supabaseClient"

function AdminPackages() {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingPackage, setEditingPackage] = useState(null)
  const [formData, setFormData] = useState({
    destination: '',
    duration: '',
    price: '',
    inclusions: '',
    image_url: '',
    rating: 4.5,
    description: ''
  })

  useEffect(() => {
    fetchPackages()
  }, [])

 const fetchPackages = async () => {
  setLoading(true)
  try {
    console.log('=== FETCHING PACKAGES ===')
    console.log('Table name: travel_packages')
    
    const { data, error } = await supabase
      .from('travel_packages')
      .select('*')
      .order('destination')

    if (error) {
      console.error('SUPABASE ERROR:', error)
      setError(error.message)
    } else {
      console.log('DATA RECEIVED:', data)
      console.log('NUMBER OF PACKAGES:', data?.length || 0)
      setPackages(data || [])
    }
  } catch (err) {
    console.error('EXCEPTION:', err)
    setError(err.message)
  } finally {
    setLoading(false)
  }
}

  const handleAddPackage = () => {
    setEditingPackage(null)
    setFormData({
      destination: '',
      duration: '',
      price: '',
      inclusions: '',
      image_url: '',
      rating: 4.5,
      description: ''
    })
    setShowModal(true)
  }

  const handleEditPackage = (pkg) => {
    setEditingPackage(pkg)
    setFormData({
      destination: pkg.destination,
      duration: pkg.duration,
      price: pkg.price,
      inclusions: pkg.inclusions || '',
      image_url: pkg.image_url || '',
      rating: pkg.rating || 4.5,
      description: pkg.description || ''
    })
    setShowModal(true)
  }

  const handleDeletePackage = async (pkg) => {
    if (!confirm(`Are you sure you want to delete "${pkg.destination}"? This will also delete all bookings for this package.`)) {
      return
    }

    const { error: bookingsError } = await supabase
      .from('package_bookings')
      .delete()
      .eq('package_id', pkg.id)

    if (bookingsError) {
      console.error('Error deleting bookings:', bookingsError)
    }

    const { error } = await supabase
      .from('travel_packages')
      .delete()
      .eq('id', pkg.id)

    if (error) {
      alert('Error deleting package: ' + error.message)
    } else {
      alert(`Package "${pkg.destination}" deleted successfully`)
      fetchPackages()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const packageData = {
      destination: formData.destination,
      duration: formData.duration,
      price: parseInt(formData.price),
      inclusions: formData.inclusions,
      image_url: formData.image_url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
      rating: parseFloat(formData.rating),
      description: formData.description
    }

    let error
    if (editingPackage) {
      const { error: updateError } = await supabase
        .from('travel_packages')
        .update(packageData)
        .eq('id', editingPackage.id)
      error = updateError
    } else {
      const { error: insertError } = await supabase
        .from('travel_packages')
        .insert([packageData])
      error = insertError
    }

    if (error) {
      alert('Error saving package: ' + error.message)
    } else {
      alert(editingPackage ? 'Package updated successfully' : 'Package added successfully')
      setShowModal(false)
      fetchPackages()
    }
  }

  const filteredPackages = packages.filter(pkg =>
    pkg.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.duration.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatCurrency = (amount) => {
    return '₦' + amount.toLocaleString()
  }

  if (loading) {
    return <div className="admin-loading">Loading packages...</div>
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>Packages Management</h1>
          <p>Add, edit, or remove travel packages from your portfolio</p>
        </div>
        <button className="admin-add-btn" onClick={handleAddPackage}>
          <span className="material-symbols-outlined">add</span>
          ADD NEW PACKAGE
        </button>
      </div>

      <div className="admin-search-bar">
        <input
          type="text"
          className="admin-search-input"
          placeholder="Search packages by destination or duration..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="admin-table-card">
        <div className="admin-table-header">
          <h4>All Packages ({filteredPackages.length})</h4>
        </div>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Package</th>
                <th>Duration</th>
                <th>Price</th>
                <th>Rating</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPackages.map((pkg) => (
                <tr key={pkg.id}>
                  <tr>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        backgroundColor: '#2a2a2a'
                      }}>
                        <img 
                          src={pkg.image_url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'} 
                          alt={pkg.destination}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <div>
                        <div style={{ fontWeight: '500' }}>{pkg.destination}</div>
                        <div style={{ fontSize: '12px', color: '#d2c5b2' }}>
                          {pkg.inclusions?.substring(0, 50)}...
                        </div>
                      </div>
                    </div>
                  </tr>
                  <td>{pkg.duration}</td>
                  <td style={{ fontWeight: 'bold', color: '#f0bf65' }}>
                    {formatCurrency(pkg.price)}
                   </td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#f0bf65' }}>star</span>
                      {pkg.rating}
                    </span>
                   </td>
                  <td>
                    <span className="admin-status-confirmed">Active</span>
                   </td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="admin-action-btn" onClick={() => handleEditPackage(pkg)} title="Edit package">
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                    <button className="admin-action-btn delete" onClick={() => handleDeletePackage(pkg)} title="Delete package">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                   </td>
                 </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      
      {showModal && (
        <>
          <div className="admin-modal-overlay" onClick={() => setShowModal(false)}></div>
          <div className="admin-modal">
            <h3>{editingPackage ? 'Edit Package' : 'Add New Package'}</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Destination *"
                required
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              />
              <input
                type="text"
                placeholder="Duration (e.g., 3 Days / 2 Nights) *"
                required
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              />
              <input
                type="number"
                placeholder="Price (₦) *"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
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
                placeholder="Inclusions (comma separated)"
                value={formData.inclusions}
                onChange={(e) => setFormData({ ...formData, inclusions: e.target.value })}
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
                  {editingPackage ? 'Update Package' : 'Add Package'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  )
}

export default AdminPackages