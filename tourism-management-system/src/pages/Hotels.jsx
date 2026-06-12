import { useState, useEffect } from 'react'
import { getAllHotels } from '../services/hotelService'
import HotelCard from '../components/HotelCard'

function Hotels() {
  const [hotels, setHotels] = useState([])
  const [filteredHotels, setFilteredHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  const [searchLocation, setSearchLocation] = useState('')
  const [priceRange, setPriceRange] = useState(500000)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchHotels()
  }, [])

  const fetchHotels = async () => {
    setLoading(true)
    const result = await getAllHotels()
    if (result.success) {
      const validHotels = result.hotels.filter(hotel => hotel && typeof hotel === 'object')
      setHotels(validHotels)
      setFilteredHotels(validHotels)
    } else {
      setError(result.error || 'Failed to load hotels')
    }
    setLoading(false)
  }

  const filterHotels = () => {
    let filtered = [...hotels]
    if (searchLocation.trim() !== '') {
      filtered = filtered.filter(hotel => 
        hotel.location && hotel.location.toLowerCase().includes(searchLocation.toLowerCase())
      )
    }
    filtered = filtered.filter(hotel => 
      hotel.price_per_night && hotel.price_per_night <= priceRange
    )
    setFilteredHotels(filtered)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    filterHotels()
  }

  const handlePriceChange = (e) => {
    const newPrice = parseInt(e.target.value)
    setPriceRange(newPrice)
    
    let filtered = [...hotels]
    if (searchLocation.trim() !== '') {
      filtered = filtered.filter(hotel => 
        hotel.location && hotel.location.toLowerCase().includes(searchLocation.toLowerCase())
      )
    }
    filtered = filtered.filter(hotel => hotel.price_per_night && hotel.price_per_night <= newPrice)
    setFilteredHotels(filtered)
  }

  const clearFilters = () => {
    setSearchLocation('')
    setPriceRange(500000)
    setFilteredHotels(hotels)
  }

  const formatCurrency = (amount) => {
    return '₦' + amount.toLocaleString()
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text">Loading amazing hotels...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">Error: {error}</p>
        <button className="retry-btn" onClick={fetchHotels}>
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="hotels-container">

      <section className="hotels-hero">
        <div className="hotels-hero-bg" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1566073771259-6a8506099945)' }}></div>
        <div className="hotels-hero-overlay"></div>
        
        <div className="hotels-hero-content">
          <h1 className="hotels-hero-title">Experience Nigeria's Finest Stays</h1>
          
          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-form-row">
              <div className="search-input-group">
                <input 
                  type="text"
                  className="search-input"
                  placeholder="Where to? (e.g., Lagos, Abuja, Port Harcourt)"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
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
                  max="500000"
                  step="10000"
                  value={priceRange}
                  onChange={handlePriceChange}
                />
                <div className="price-range-labels">
                  <span>₦0</span>
                  <span>₦100k</span>
                  <span>₦200k</span>
                  <span>₦300k</span>
                  <span>₦400k</span>
                  <span>₦500k+</span>
                </div>
              </div>
            )}
          </form>
        </div>
      </section>

      <div className="results-info">
        <p className="results-count">
          {filteredHotels.length} hotel{filteredHotels.length !== 1 ? 's' : ''} found
          {searchLocation && <span> in <strong>"{searchLocation}"</strong></span>}
        </p>
      </div>


      <div className="hotels-grid-section">
        {filteredHotels.length === 0 ? (
          <div className="empty-state">
            <p className="empty-state-text">No hotels found matching your criteria.</p>
            <button className="empty-state-btn" onClick={clearFilters}>
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="hotels-list">
            {filteredHotels.map(hotel => (
              hotel && <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Hotels