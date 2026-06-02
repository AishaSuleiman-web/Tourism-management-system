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
      className="hotel-card"
      onClick={() => navigate(`/hotels/${hotel.id}`)}
    >
    
      <div className="hotel-card-image">
        <img 
          src={hotel.image_url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'} 
          alt={hotel.name || 'Hotel'}
        />
      </div>
      
      
      <div className="hotel-card-content">
        <div>
          <div className="hotel-card-header">
            <h3>{hotel.name || 'Hotel Name'}</h3>
            <div className="hotel-rating">
              <span className="hotel-rating-stars">{renderStars()}</span>
              <span className="hotel-rating-value">({hotel.rating || 4.0})</span>
            </div>
          </div>
          
          <div className="hotel-location">
            <span>📍</span> {hotel.location || 'Location not specified'}
          </div>
          
          <p className="hotel-description">
            {(hotel.description || 'No description available.').substring(0, 120)}...
          </p>
          
          <div className="hotel-amenities">
            {hotel.amenities && hotel.amenities.slice(0, 4).map((amenity, idx) => (
              <span key={idx} className="hotel-amenity">{amenity}</span>
            ))}
          </div>
        </div>
        
        <div className="hotel-price-section">
          <div>
            <span className="hotel-price">{formatCurrency(hotel.price_per_night || 0)}</span>
            <small> / night</small>
          </div>
          <button className="book-now-btn">
            Book Now
          </button>
        </div>
      </div>
    </div>
  )
}

export default HotelCard