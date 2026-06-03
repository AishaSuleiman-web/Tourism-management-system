import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function PackageDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [packageData, setPackageData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [bookingData, setBookingData] = useState({
    booking_date: '',
    number_of_people: 1
  })
  const [totalPrice, setTotalPrice] = useState(0)
  const [bookingMessage, setBookingMessage] = useState('')
  const [bookingLoading, setBookingLoading] = useState(false)

  useEffect(() => {
    fetchPackage()
  }, [id])

  useEffect(() => {
    if (packageData && bookingData.number_of_people) {
      setTotalPrice(packageData.price * bookingData.number_of_people)
    }
  }, [bookingData.number_of_people, packageData])

  const fetchPackage = async () => {
    setLoading(true)
    try {
      const response = await fetch(`http://localhost:5000/api/packages/${id}`)
      const data = await response.json()
      if (data.success) {
        setPackageData(data.package)
      } else {
        setError('Package not found')
      }
    } catch (err) {
      setError('Failed to load package')
    } finally {
      setLoading(false)
    }
  }

  const handleBookingClick = () => {
    if (!isAuthenticated) {
      if (window.confirm('Please login to book. Go to login page?')) {
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

    const token = localStorage.getItem('token')
    if (!token) {
      setBookingMessage('Please login to book')
      setBookingLoading(false)
      return
    }

    try {
      const response = await fetch('http://localhost:5000/api/packages/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          package_id: id,
          booking_date: bookingData.booking_date,
          number_of_people: parseInt(bookingData.number_of_people),
          total_price: totalPrice
        })
      })

      const data = await response.json()

      if (response.ok) {
        setBookingMessage('Booking confirmed!')
        setShowBookingForm(false)
        setTimeout(() => navigate('/my-bookings'), 2000)
      } else {
        setBookingMessage(data.error || 'Booking failed')
      }
    } catch (err) {
      setBookingMessage('Server error. Please try again.')
    } finally {
      setBookingLoading(false)
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
          <p className="loading-text">Loading package details...</p>
        </div>
      </div>
    )
  }

  if (error || !packageData) {
    return (
      <div className="hotels-container">
        <div className="error-container">
          <p className="error-message">{error || 'Package not found'}</p>
          <button className="retry-btn" onClick={() => navigate('/packages')}>Back to Packages</button>
        </div>
      </div>
    )
  }

  return (
    <div className="hotels-container">
      <section className="hotels-grid-section" style={{ paddingTop: '40px' }}>
        <button onClick={() => navigate(-1)} className="retry-btn" style={{ marginBottom: '20px', background: '#666' }}>
          ← Back to Packages
        </button>

        <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <img 
              src={packageData.image_url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'} 
              alt={packageData.destination}
              style={{ width: '100%', borderRadius: '12px', height: '400px', objectFit: 'cover' }}
            />
          </div>

          <div style={{ flex: 1, minWidth: '300px' }}>
            <h1 style={{ color: '#050b36', marginBottom: '8px' }}>{packageData.destination}</h1>
            <p style={{ color: '#666', fontSize: '18px', marginBottom: '16px' }}>⏱️ {packageData.duration}</p>
            
            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#050b36' }}>
                {formatCurrency(packageData.price)}
              </span>
              <span style={{ fontSize: '16px', fontWeight: 'normal' }}> / package</span>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <span style={{ display: 'inline-block', background: '#fbbf24', padding: '4px 8px', borderRadius: '8px', fontWeight: 'bold' }}>
                ★ {packageData.rating || 4.5}
              </span>
            </div>

            <h3 style={{ color: '#050b36', marginBottom: '8px' }}>Inclusions</h3>
            <p style={{ color: '#4b5563', lineHeight: '1.6', marginBottom: '20px' }}>{packageData.inclusions || packageData.description}</p>

            {!showBookingForm ? (
              <button 
                onClick={handleBookingClick}
                className="book-now-btn"
                style={{ width: '100%', padding: '14px', fontSize: '18px' }}
              >
                Book This Package
              </button>
            ) : (
              <form onSubmit={handleSubmitBooking} style={{ backgroundColor: '#f9fafb', padding: '24px', borderRadius: '12px' }}>
                <h3 style={{ marginTop: 0, marginBottom: '16px', color: '#050b36' }}>Complete Your Booking</h3>
                
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Travel Date</label>
                  <input
                    type="date"
                    name="booking_date"
                    value={bookingData.booking_date}
                    onChange={handleInputChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '8px' }}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Number of People</label>
                  <select
                    name="number_of_people"
                    value={bookingData.number_of_people}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '8px' }}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Person' : 'People'}</option>
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
                  <button type="submit" disabled={bookingLoading} style={{ flex: 1, padding: '10px', backgroundColor: '#3B82F6', color: 'white', border: 'none', borderRadius: '8px', cursor: bookingLoading ? 'not-allowed' : 'pointer' }}>
                    {bookingLoading ? 'Processing...' : 'Confirm Booking'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default PackageDetails