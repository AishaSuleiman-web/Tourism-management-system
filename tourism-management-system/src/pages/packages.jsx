import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function Packages() {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/packages')
      const data = await response.json()
      if (data.success) {
        setPackages(data.packages)
      } else {
        setError('Failed to load packages')
      }
    } catch (err) {
      setError('Server error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return '₦' + amount.toLocaleString()
  }

  if (loading) {
    return (
      <div className="hotels-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading-text">Loading travel packages...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="hotels-container">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button className="retry-btn" onClick={fetchPackages}>Try Again</button>
        </div>
      </div>
    )
  }

  return (
    <div className="hotels-container">
      <section className="hotels-grid-section" style={{ paddingTop: '40px' }}>
        <div className="admin-page-header">
          <div>
            <h1 style={{ color: '#050b36' }}>Travel Packages</h1>
            <p style={{ color: '#666' }}>Discover amazing travel packages across Nigeria</p>
          </div>
        </div>

        <div className="hotels-list">
          {packages.map((pkg) => (
            <Link 
              key={pkg.id} 
              to={`/packages/${pkg.id}`} 
              style={{ textDecoration: 'none' }}
            >
              <div className="hotel-card">
                <div className="hotel-card-image">
                  <img 
                    src={pkg.image_url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'} 
                    alt={pkg.destination}
                  />
                </div>
                <div className="hotel-card-content">
                  <div className="hotel-card-header">
                    <h3>{pkg.destination}</h3>
                    <div className="hotel-rating">
                      <span className="hotel-rating-stars">★</span>
                      <span className="hotel-rating-value">{pkg.rating || 4.5}</span>
                    </div>
                  </div>
                  <div className="hotel-location">
                    <span>⏱️</span> {pkg.duration}
                  </div>
                  <p className="hotel-description">
                    {pkg.description || (pkg.inclusions ? pkg.inclusions.substring(0, 100) : 'Experience the best of this destination')}
                  </p>
                  <div className="hotel-price-section">
                    <div>
                      <span className="hotel-price">{formatCurrency(pkg.price)}</span>
                      <small> / package</small>
                    </div>
                    <button className="book-now-btn">
                      View Details →
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Packages