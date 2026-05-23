import { useState, useEffect } from 'react'
import { getAllHotels } from '../services/hotelService'
import HotelCard from '../components/HotelCard'

function Hotels() {
  const [hotels, setHotels] = useState([])
  const [filteredHotels, setFilteredHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Search states
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
      // Filter out any invalid hotel entries
      const validHotels = result.hotels.filter(hotel => hotel && typeof hotel === 'object')
      setHotels(validHotels)
      setFilteredHotels(validHotels)
    } else {
      setError(result.error || 'Failed to load hotels')
    }
    setLoading(false)
  }

  // Filter hotels based on search criteria
  const filterHotels = () => {
    let filtered = [...hotels]

    // Filter by location
    if (searchLocation.trim() !== '') {
      filtered = filtered.filter(hotel => 
        hotel.location && hotel.location.toLowerCase().includes(searchLocation.toLowerCase())
      )
    }

    // Filter by price range (max price)
    filtered = filtered.filter(hotel => 
      hotel.price_per_night && hotel.price_per_night <= priceRange
    )

    setFilteredHotels(filtered)
  }

  // Apply filters when search button is clicked
  const handleSearch = (e) => {
    e.preventDefault()
    filterHotels()
  }

  // Apply filters when price range changes
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

  // Clear all filters
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
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#f8f9ff'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          border: '5px solid #e5e7eb',
          borderTop: '5px solid #050b36',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ marginTop: '20px', color: '#666' }}>Loading amazing hotels...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '60px',
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#f8f9ff'
      }}>
        <p style={{ color: '#dc2626' }}>Error: {error}</p>
        <button 
          onClick={fetchHotels}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#050b36',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div style={{ width: '100%', backgroundColor: '#f8f9ff' }}>
      {/* Hero Section with Search Bar */}
      <section style={{
        width: '100%',
        minHeight: '500px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        padding: '60px 0'
      }}>
        {/* Background Image */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url(https://images.unsplash.com/photo-1566073771259-6a8506099945)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0
        }}></div>
        
        {/* Dark Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(5, 11, 54, 0.4)',
          zIndex: 1
        }}></div>
        
        {/* Content */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: '900px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          <h1 style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: '700',
            fontSize: '42px',
            color: 'white',
            marginBottom: '30px',
            textAlign: 'center',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}>
            Experience Nigeria's Finest Stays
          </h1>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '16px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
          }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ flex: 3, minWidth: '200px' }}>
                <input 
                  type="text"
                  placeholder="Where to? (e.g., Lagos, Abuja, Port Harcourt)"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    fontSize: '16px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '12px',
                    outline: 'none',
                    backgroundColor: 'white',
                    color: '#050b36',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ flex: 1, minWidth: '120px' }}>
                <button 
                  type="submit" 
                  style={{
                    width: '100%',
                    backgroundColor: '#7d5800',
                    color: 'white',
                    padding: '14px 20px',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#5c4200'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#7d5800'}
                >
                  Search
                </button>
              </div>

              <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center' }}>
                <button 
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#050b36',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    textDecoration: 'underline',
                    padding: '8px'
                  }}
                >
                  {showFilters ? 'Hide Price Filter' : 'Show Price Filter'}
                </button>
              </div>
            </div>

            {/* Price Filter Panel */}
            {showFilters && (
              <div style={{
                borderTop: '1px solid #e0e0e0',
                paddingTop: '15px',
                marginTop: '5px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
                  <span style={{ fontWeight: 'bold', color: '#050b36' }}>
                    Maximum Price: {formatCurrency(priceRange)}
                  </span>
                  <button 
                    onClick={clearFilters}
                    style={{
                      padding: '6px 16px',
                      backgroundColor: '#dc2626',
                      color: 'white',
                      border: 'none',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Clear Filters
                  </button>
                </div>
                <input
                  type="range"
                  min="0"
                  max="500000"
                  step="10000"
                  value={priceRange}
                  onChange={handlePriceChange}
                  style={{ width: '100%' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '12px', color: '#666' }}>
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

      {/* Results Info */}
      <div style={{
        maxWidth: '1200px',
        margin: '40px auto 0',
        padding: '0 20px'
      }}>
        <p style={{ fontSize: '16px', color: '#666' }}>
          {filteredHotels.length} hotel{filteredHotels.length !== 1 ? 's' : ''} found
          {searchLocation && <span> in <strong>"{searchLocation}"</strong></span>}
        </p>
      </div>

      {/* Hotel Grid - Centered, No Side Columns */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '30px 20px 80px',
        width: '100%'
      }}>
        {filteredHotels.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px', 
            backgroundColor: 'white', 
            borderRadius: '16px'
          }}>
            <p style={{ fontSize: '18px', color: '#666', marginBottom: '20px' }}>
              No hotels found matching your criteria.
            </p>
            <button 
              onClick={clearFilters}
              style={{
                padding: '10px 24px',
                backgroundColor: '#050b36',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                cursor: 'pointer'
              }}
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>
            {filteredHotels.map(hotel => (
              hotel && <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Hotels