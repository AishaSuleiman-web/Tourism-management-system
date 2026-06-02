import { useState, useEffect } from 'react'
import { getUserBookings } from '../services/hotelService'
import { formatCurrency } from '../utils/formatCurrency'

function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadBookings()
  }, [])

  const loadBookings = async () => {
    setLoading(true)
    const result = await getUserBookings()
    if (result.success) {
      setBookings(result.bookings)
    } else {
      setError(result.error)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="bookings-loading">
        <div className="bookings-spinner"></div>
      </div>
    )
  }

  return (
    <div className="bookings-container">
      <main className="bookings-main">
        
        <div className="bookings-header">
          <h2 className="bookings-title">My Bookings</h2>
          <p className="bookings-subtitle">
            Manage your stays and upcoming adventures across Nigeria.
          </p>
        </div>

       
        {error && (
          <div className="bookings-error">
            {error}
          </div>
        )}

        
        {bookings.length === 0 ? (
          <div className="empty-state-container">
            <div className="empty-state-icon">
              <span>🎫</span>
            </div>
            <h3 className="empty-state-title">You haven't made any bookings yet</h3>
            <p className="empty-state-text">
              Start your journey by exploring our handpicked luxury stays and curated Nigerian experiences.
            </p>
            <a href="/hotels" className="empty-state-btn">
              Browse Hotels
            </a>
          </div>
        ) : (
          <div className="bookings-grid">
            {bookings.map((booking) => {
              const checkIn = new Date(booking.check_in)
              const checkOut = new Date(booking.check_out)
              const bookedOn = new Date(booking.created_at || booking.booking_date)
              const isCompleted = checkOut < new Date()
              const status = isCompleted ? 'Completed' : (booking.status || 'Confirmed')
              const statusClass = isCompleted ? 'status-completed' : 'status-confirmed'

              return (
                <a 
                  key={booking.id}
                  href={`/hotels/${booking.hotel_id}`}
                  className="booking-card"
                >
                  <div className="booking-card-inner">
                    
                    <div className="booking-image">
                      <img 
                        src={booking.hotels?.image_url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'} 
                        alt={booking.hotels?.name}
                      />
                      <div className={`booking-status ${statusClass}`}>
                        {status}
                      </div>
                    </div>

                   
                    <div className="booking-content">
                      <div>
                        <h3 className="booking-hotel-name">{booking.hotels?.name}</h3>
                        <div className="booking-location">
                          <span style={{ marginRight: '4px' }}>📍</span>
                          <span>{booking.hotels?.location}</span>
                        </div>

                        <div className="booking-dates">
                          <div>
                            <p className="date-label">Check-in</p>
                            <div className="date-value">
                              <span>📅</span>
                              <span>{checkIn.toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div>
                            <p className="date-label">Check-out</p>
                            <div className="date-value">
                              <span>📅</span>
                              <span>{checkOut.toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>

                        <div className="booking-meta">
                          <div className="booking-guests">
                            <span style={{ marginRight: '8px' }}>👥</span>
                            <span>{booking.number_of_guests} Guest{booking.number_of_guests !== 1 ? 's' : ''}</span>
                          </div>
                          <div className="booking-date">
                            <p className="booking-date-label">Booked on</p>
                            <p className="booking-date-value">{bookedOn.toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>

                      <div className="booking-price">
                        <span className={`booking-price-value ${isCompleted ? 'completed' : ''}`}>
                          {formatCurrency(booking.total_price)}
                        </span>
                      </div>
                    </div>
                  </div>
                </a>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

export default MyBookings