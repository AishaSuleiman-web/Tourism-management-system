import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { getHotelById, bookHotel } from '../services/hotelService'

function HotelDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [hotel, setHotel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [bookingData, setBookingData] = useState({
    check_in: '',
    check_out: '',
    number_of_guests: 1
  })
  const [totalPrice, setTotalPrice] = useState(0)
  const [bookingMessage, setBookingMessage] = useState('')
  const [bookingLoading, setBookingLoading] = useState(false)

  const formatCurrency = (amount) => {
    return '₦' + amount.toLocaleString()
  }

  useEffect(() => {
    loadHotel()
  }, [id])

  useEffect(() => {
    if (bookingData.check_in && bookingData.check_out && hotel) {
      const checkIn = new Date(bookingData.check_in)
      const checkOut = new Date(bookingData.check_out)
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))
      if (nights > 0) {
        setTotalPrice(nights * hotel.price_per_night * bookingData.number_of_guests)
      } else {
        setTotalPrice(0)
      }
    }
  }, [bookingData.check_in, bookingData.check_out, bookingData.number_of_guests, hotel])

  const loadHotel = async () => {
    setLoading(true)
    const result = await getHotelById(id)
    if (result.success) {
      setHotel(result.hotel)
    } else {
      setError(result.error)
    }
    setLoading(false)
  }

  const handleBookingClick = () => {
    if (!isAuthenticated) {
      if (window.confirm('Please login to book a hotel. Go to login page?')) {
        navigate('/login')
      }
      return
    }
    setShowBookingForm(true)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setBookingData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmitBooking = async (e) => {
    e.preventDefault()
    setBookingLoading(true)
    setBookingMessage('')

    const bookingPayload = {
      hotel_id: id,
      check_in: bookingData.check_in,
      check_out: bookingData.check_out,
      number_of_guests: bookingData.number_of_guests,
      total_price: totalPrice
    }

    const result = await bookHotel(bookingPayload)

    if (result.success) {
      setBookingMessage('Booking confirmed! Check your email for details.')
      setShowBookingForm(false)
      setTimeout(() => navigate('/'), 2000)
    } else {
      setBookingMessage(result.error)
    }
    setBookingLoading(false)
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading hotel details...</div>
  }

  if (error || !hotel) {
    return <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>{error || 'Hotel not found'}</div>
  }

  return (
    <div style={{ padding: '40px' }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: '20px', padding: '8px 16px', cursor: 'pointer' }}>
        ← Back
      </button>

      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <img 
            src={hotel.image_url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'} 
            alt={hotel.name}
            style={{ width: '100%', borderRadius: '12px' }}
          />
        </div>

        <div style={{ flex: 1, minWidth: '300px' }}>
          <h1>{hotel.name}</h1>
          <p style={{ color: '#666', fontSize: '18px' }}>📍 {hotel.location}</p>
          
          <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '20px 0' }}>
            {formatCurrency(hotel.price_per_night)} <span style={{ fontSize: '16px', fontWeight: 'normal' }}>/ night</span>
          </p>

          <h3>Description</h3>
          <p style={{ lineHeight: '1.6' }}>{hotel.description}</p>

          <h3>Amenities</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '30px' }}>
            {hotel.amenities?.map((item, index) => (
              <span key={index} style={{ backgroundColor: '#f0f0f0', padding: '6px 12px', borderRadius: '20px' }}>
                ✓ {item}
              </span>
            ))}
          </div>

          {!showBookingForm ? (
            <button 
              onClick={handleBookingClick}
              style={{ backgroundColor: '#3B82F6', color: 'white', padding: '14px 28px', border: 'none', borderRadius: '8px', fontSize: '18px', cursor: 'pointer', width: '100%' }}
            >
              Book Now
            </button>
          ) : (
            <form onSubmit={handleSubmitBooking} style={{ backgroundColor: '#f9f9f9', padding: '24px', borderRadius: '12px' }}>
              <h3 style={{ marginTop: 0 }}>Complete Your Booking</h3>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Check-in Date</label>
                <input
                  type="date"
                  name="check_in"
                  value={bookingData.check_in}
                  onChange={handleInputChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '8px' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Check-out Date</label>
                <input
                  type="date"
                  name="check_out"
                  value={bookingData.check_out}
                  onChange={handleInputChange}
                  required
                  min={bookingData.check_in || new Date().toISOString().split('T')[0]}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '8px' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Number of Guests</label>
                <select
                  name="number_of_guests"
                  value={bookingData.number_of_guests}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '8px' }}
                >
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                </select>
              </div>

              {totalPrice > 0 && (
                <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#e0f2fe', borderRadius: '8px' }}>
                  <strong>Total Price:</strong> {formatCurrency(totalPrice)}
                </div>
              )}

              {bookingMessage && (
                <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: bookingMessage.includes('confirmed') ? '#d1fae5' : '#fee2e2', color: bookingMessage.includes('confirmed') ? '#065f46' : '#dc2626', borderRadius: '8px' }}>
                  {bookingMessage}
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" onClick={() => setShowBookingForm(false)} style={{ flex: 1, padding: '10px', backgroundColor: '#9ca3af', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" disabled={bookingLoading} style={{ flex: 1, padding: '10px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: bookingLoading ? 'not-allowed' : 'pointer' }}>
                  {bookingLoading ? 'Processing...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default HotelDetails