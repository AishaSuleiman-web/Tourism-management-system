import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function Packages() {
  const [packages, setPackages] = useState([])
  const [filteredPackages, setFilteredPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  const [searchDestination, setSearchDestination] = useState('')
  const [priceRange, setPriceRange] = useState(120000)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/packages')
      const data = await response.json()
      if (data.success) {
        const validPackages = data.packages.filter(pkg => pkg && typeof pkg === 'object')
        setPackages(validPackages)
        setFilteredPackages(validPackages)
      } else {
        setError('Failed to load packages')
      }
    } catch (err) {
      setError('Server error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const filterPackages = () => {
    let filtered = [...packages]
    if (searchDestination.trim() !== '') {
      filtered = filtered.filter(pkg => 
        pkg.destination && pkg.destination.toLowerCase().includes(searchDestination.toLowerCase())
      )
    }
    filtered = filtered.filter(pkg => 
      pkg.price && pkg.price <= priceRange
    )
    setFilteredPackages(filtered)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    filterPackages()
  }

  const handlePriceChange = (e) => {
    const newPrice = parseInt(e.target.value)
    setPriceRange(newPrice)
    
    let filtered = [...packages]
    if (searchDestination.trim() !== '') {
      filtered = filtered.filter(pkg => 
        pkg.destination && pkg.destination.toLowerCase().includes(searchDestination.toLowerCase())
      )
    }
    filtered = filtered.filter(pkg => pkg.price && pkg.price <= newPrice)
    setFilteredPackages(filtered)
  }

  const clearFilters = () => {
    setSearchDestination('')
    setPriceRange(120000)
    setFilteredPackages(packages)
  }

  const formatCurrency = (amount) => {
    return '₦' + amount.toLocaleString()
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text">Loading amazing travel packages...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">Error: {error}</p>
        <button className="retry-btn" onClick={fetchPackages}>
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="hotels-container">
      {/* Hero Section with Search Bar */}
      <section className="hotels-hero">
        <div className="hotels-hero-bg" style={{ backgroundImage: 'url(https://plus.unsplash.com/premium_photo-1756156879240-3c7d2cb165e6?w=1600&q=85)' }}></div>
        <div className="hotels-hero-overlay"></div>
        
        <div className="hotels-hero-content">
          <h1 className="hotels-hero-title">Discover Amazing Travel Packages</h1>
          
          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-form-row">
              <div className="search-input-group">
                <input 
                  type="text"
                  className="search-input"
                  placeholder="Where to? (e.g., Lagos, Abuja, Calabar)"
                  value={searchDestination}
                  onChange={(e) => setSearchDestination(e.target.value)}
                />
              </div>

              <div className="search-btn-group">
                <button type="submit" className="search-btn">
                  Search
                </button>
              </div>

              <div>
                <button 
                  type="button"
                  className="filter-toggle-btn"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  {showFilters ? 'Hide Price Filter' : 'Show Price Filter'}
                </button>
              </div>
            </div>

            {showFilters && (
              <div className="price-filter-panel">
                <div className="price-filter-header">
                  <span className="price-filter-label">
                    Maximum Price: {formatCurrency(priceRange)}
                  </span>
                  <button className="clear-filters-btn" onClick={clearFilters}>
                    Clear Filters
                  </button>
                </div>
                <input
                  type="range"
                  className="price-range-input"
                  min="0"
                  max="120000"
                  step="5000"
                  value={priceRange}
                  onChange={handlePriceChange}
                />
                <div className="price-range-labels">
                  <span>₦0</span>
                  <span>₦30k</span>
                  <span>₦60k</span>
                  <span>₦90k</span>
                  <span>₦120k+</span>
                </div>
              </div>
            )}
          </form>
        </div>
      </section>

      {/* Results Info */}
      <div className="results-info">
        <p className="results-count">
          {filteredPackages.length} package{filteredPackages.length !== 1 ? 's' : ''} found
          {searchDestination && <span> in <strong>"{searchDestination}"</strong></span>}
        </p>
      </div>

      {/* Packages Grid */}
      <div className="hotels-grid-section">
        {filteredPackages.length === 0 ? (
          <div className="empty-state">
            <p className="empty-state-text">No packages found matching your criteria.</p>
            <button className="empty-state-btn" onClick={clearFilters}>
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="hotels-list">
            {filteredPackages.map(pkg => (
              <Link 
                key={pkg.id} 
                to={`/packages/${pkg.id}`} 
                style={{ textDecoration: 'none' }}
              >
                <div className="hotel-card">
                  <div className="hotel-card-image">
                    <img 
                      src={pkg.image_url || 'https://images.pexels.com/photos/1421932/pexels-photo-1421932.jpeg'} 
                      alt={pkg.destination}
                      onError={(e) => {
                        e.target.src = 'https://images.pexels.com/photos/1421932/pexels-photo-1421932.jpeg'
                      }}
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
                      {pkg.description ? pkg.description.substring(0, 100) + '...' : (pkg.inclusions ? pkg.inclusions.substring(0, 100) + '...' : 'Experience the best of this destination')}
                    </p>
                    <div className="hotel-amenities">
                      {pkg.inclusions && pkg.inclusions.split(',').slice(0, 3).map((item, index) => (
                        <span key={index} className="hotel-amenity">
                          {item.trim()}
                        </span>
                      ))}
                    </div>
                    <div className="hotel-price-section">
                      <div>
                        <span className="hotel-price">{formatCurrency(pkg.price)}</span>
                        <small>/package</small>
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
        )}
      </div>
    </div>
  )
}

export default Packages