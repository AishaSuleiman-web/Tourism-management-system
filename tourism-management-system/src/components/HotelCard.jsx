import { useNavigate } from 'react-router-dom'

function HotelCard({ hotel }) {
  const navigate = useNavigate()

  // Guard clause: If hotel is undefined or null, don't render
  if (!hotel || typeof hotel !== 'object') {
    return null
  }

  const formatCurrency = (amount) => {
    return '₦' + amount.toLocaleString()
  }

  const renderStars = () => {
    const rating = hotel.rating || 4.0
    const fullStars = Math.floor(rating)
    const stars = []
    for (let i = 0; i < fullStars; i++) stars.push('★')
    for (let i = stars.length; i < 5; i++) stars.push('☆')
    return stars.join('')
  }

  return (
    <div 
      onClick={() => navigate(`/hotels/${hotel.id}`)}
      style={{
        display: 'flex',
        backgroundColor: 'white',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.12)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'
      }}
    >
      {/* Image Section */}
      <div style={{ width: '280px', height: '200px', flexShrink: 0 }}>
        <img 
          src={hotel.image_url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'} 
          alt={hotel.name || 'Hotel'}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      
      {/* Content Section */}
      <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: '#050b36' }}>{hotel.name || 'Hotel Name'}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ color: '#7d5800' }}>{renderStars()}</span>
              <span style={{ fontSize: '14px', color: '#666' }}>({hotel.rating || 4.0})</span>
            </div>
          </div>
          <p style={{ color: '#666', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>📍</span> {hotel.location || 'Location not specified'}
          </p>
          <p style={{ color: '#4b5563', marginBottom: '12px', fontSize: '14px', lineHeight: '1.5' }}>
            {(hotel.description || 'No description available.').substring(0, 120)}...
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {hotel.amenities && hotel.amenities.slice(0, 4).map((amenity, idx) => (
              <span key={idx} style={{ backgroundColor: '#f3f4f6', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', color: '#4b5563' }}>
                {amenity}
              </span>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
          <div>
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#050b36' }}>{formatCurrency(hotel.price_per_night || 0)}</span>
            <span style={{ color: '#666', fontSize: '14px' }}> / night</span>
          </div>
          <button style={{
            padding: '8px 24px',
            backgroundColor: '#7d5800',
            color: 'white',
            border: 'none',
            borderRadius: '30px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#5c4200'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#7d5800'}
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  )
}

export default HotelCard