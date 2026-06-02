import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function Guides() {
  const [guides, setGuides] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchGuides()
  }, [])

  const fetchGuides = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/guides')
      const data = await response.json()
      if (data.success) {
        setGuides(data.guides)
      } else {
        setError('Failed to load guides')
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
          <p className="loading-text">Loading tour guides...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="hotels-container">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button className="retry-btn" onClick={fetchGuides}>Try Again</button>
        </div>
      </div>
    )
  }

  return (
    <div className="hotels-container">
      <section className="hotels-grid-section" style={{ paddingTop: '40px' }}>
        <div className="admin-page-header">
          <div>
            <h1 style={{ color: '#050b36' }}>Tour Guides</h1>
            <p style={{ color: '#666' }}>Experience Nigeria with our professional local guides</p>
          </div>
        </div>

        <div className="hotels-list">
          {guides.map((guide) => (
            <Link 
              key={guide.id} 
              to={`/guide/${guide.id}`} 
              style={{ textDecoration: 'none' }}
            >
              <div className="hotel-card">
                <div className="hotel-card-image">
                  <img 
                    src={guide.image_url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'} 
                    alt={guide.name}
                  />
                </div>
                <div className="hotel-card-content">
                  <div className="hotel-card-header">
                    <h3>{guide.name}</h3>
                    <div className="hotel-rating">
                      <span className="hotel-rating-stars">★</span>
                      <span className="hotel-rating-value">{guide.rating || 4.5}</span>
                    </div>
                  </div>
                  <div className="hotel-location">
                    <span>📍</span> {guide.location}
                  </div>
                  <p className="hotel-description">
                    {guide.experience}
                  </p>
                  <div className="hotel-price-section">
                    <div>
                      <span className="hotel-price">{formatCurrency(guide.price_per_day)}</span>
                      <small> / person / day</small>
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

export default Guides