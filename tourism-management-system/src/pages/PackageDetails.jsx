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
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading package details...</div>
  }

  if (error || !packageData) {
    return <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>{error || 'Package not found'}</div>
  }

  return (
    <div style={{ padding: '40px' }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: '20px', padding: '8px 16px', cursor: 'pointer' }}>
        ← Back
      </button>

      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <img 
            src={packageData.image_url || 'https://images.pexels.com/photos/1421932/pexels-photo-1421932.jpeg'} 
            alt={packageData.destination}
            style={{ width: '100%', borderRadius: '12px' }}
            onError={(e) => {
              e.target.src = 'https://images.pexels.com/photos/1421932/pexels-photo-1421932.jpeg'
            }}
          />
        </div>

        <div style={{ flex: 1, minWidth: '300px' }}>
          <h1>{packageData.destination}</h1>
          <p style={{ color: '#666', fontSize: '18px' }}>⏱️ {packageData.duration}</p>
          
          <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '20px 0' }}>
            {formatCurrency(packageData.price)} <span style={{ fontSize: '16px', fontWeight: 'normal' }}>/package</span>
          </p>

          <h3>About this package</h3>
          <p style={{ lineHeight: '1.6' }}>{packageData.description || packageData.inclusions}</p>

          {packageData.inclusions && (
            <>
              <h3>Inclusions</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '30px' }}>
                {packageData.inclusions.split(',').map((item, index) => (
                  <span key={index} style={{ backgroundColor: '#f0f0f0', padding: '6px 12px', borderRadius: '20px' }}>
                    ✓ {item.trim()}
                  </span>
                ))}
              </div>
            </>
          )}

          {!showBookingForm ? (
            <button 
              onClick={handleBookingClick}
              style={{ backgroundColor: '#3B82F6', color: 'white', padding: '14px 28px', border: 'none', borderRadius: '8px', fontSize: '18px', cursor: 'pointer', width: '100%' }}
            >
              Book This Package
            </button>
          ) : (
            <form onSubmit={handleSubmitBooking} style={{ backgroundColor: '#f9f9f9', padding: '24px', borderRadius: '12px' }}>
              <h3 style={{ marginTop: 0 }}>Complete Your Booking</h3>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Travel Date</label>
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
                <label style={{ display: 'block', marginBottom: '5px' }}>Number of People</label>
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

export default PackageDetails