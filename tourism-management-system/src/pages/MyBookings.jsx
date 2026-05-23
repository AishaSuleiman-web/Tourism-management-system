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
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        width: '100%'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid #e5e7eb',
          borderTop: '4px solid #050b36',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div style={{
      width: '100%',
      backgroundColor: '#f8f9ff',
      minHeight: '100vh'
    }}>
      <main style={{
        padding: '100px 40px 120px 40px',
        maxWidth: '1400px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: '600',
            color: '#050b36',
            marginBottom: '8px'
          }}>
            My Bookings
          </h2>
          <p style={{
            fontSize: '16px',
            color: '#46464e'
          }}>
            Manage your stays and upcoming adventures across Nigeria.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            backgroundColor: '#ffdad6',
            color: '#ba1a1a',
            padding: '16px',
            borderRadius: '12px',
            marginBottom: '24px'
          }}>
            {error}
          </div>
        )}

        {/* Bookings Grid */}
        {bookings.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            maxWidth: '500px',
            margin: '60px auto',
            padding: '40px'
          }}>
            <div style={{
              width: '96px',
              height: '96px',
              backgroundColor: '#d3e4fe',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '24px'
            }}>
              <span style={{ fontSize: '48px', color: '#050b36', opacity: 0.5 }}>🎫</span>
            </div>
            <h3 style={{
              fontSize: '28px',
              fontWeight: '600',
              color: '#050b36',
              marginBottom: '12px'
            }}>
              You haven't made any bookings yet
            </h3>
            <p style={{
              color: '#46464e',
              marginBottom: '32px',
              lineHeight: '1.6'
            }}>
              Start your journey by exploring our handpicked luxury stays and curated Nigerian experiences.
            </p>
            <a href="/hotels" style={{
              backgroundColor: '#050b36',
              color: 'white',
              padding: '14px 32px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontWeight: '500',
              display: 'inline-block'
            }}>
              Browse Hotels
            </a>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(500px, 1fr))',
            gap: '32px'
          }}>
            {bookings.map((booking) => {
              const checkIn = new Date(booking.check_in)
              const checkOut = new Date(booking.check_out)
              const bookedOn = new Date(booking.created_at || booking.booking_date)
              const isCompleted = checkOut < new Date()
              const status = isCompleted ? 'Completed' : (booking.status || 'Confirmed')
              const statusColors = isCompleted 
                ? { bg: '#d3e4fe', color: '#101841' }
                : { bg: '#ffdea9', color: '#775300' }

              return (
                <a 
                  key={booking.id}
                  href={`/hotels/${booking.hotel_id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.7)',
                      backdropFilter: 'blur(16px)',
                      borderRadius: '24px',
                      overflow: 'hidden',
                      border: '1px solid rgba(226, 232, 240, 0.8)',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)'
                      e.currentTarget.style.boxShadow = '0 20px 25px -12px rgba(5,11,54,0.15)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                      {/* Image Section */}
                      <div style={{ width: '200px', minHeight: '200px', position: 'relative' }}>
                        <img 
                          src={booking.hotels?.image_url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'} 
                          alt={booking.hotels?.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            minHeight: '200px'
                          }}
                        />
                        <div style={{
                          position: 'absolute',
                          top: '16px',
                          left: '16px',
                          backgroundColor: statusColors.bg,
                          color: statusColors.color,
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '11px',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          {status}
                        </div>
                      </div>

                      {/* Content Section */}
                      <div style={{
                        flex: 1,
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}>
                        <div>
                          <h3 style={{
                            fontSize: '20px',
                            fontWeight: '600',
                            color: '#050b36',
                            marginBottom: '4px'
                          }}>
                            {booking.hotels?.name}
                          </h3>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            color: '#46464e',
                            marginBottom: '16px',
                            fontSize: '13px'
                          }}>
                            <span style={{ marginRight: '4px' }}>📍</span>
                            <span>{booking.hotels?.location}</span>
                          </div>

                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '16px',
                            marginBottom: '16px'
                          }}>
                            <div>
                              <p style={{
                                fontSize: '11px',
                                fontWeight: '600',
                                textTransform: 'uppercase',
                                color: '#76767f',
                                marginBottom: '4px'
                              }}>
                                Check-in
                              </p>
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                color: '#050b36',
                                fontWeight: '500',
                                fontSize: '14px'
                              }}>
                                <span style={{ marginRight: '8px', color: '#7d5800' }}>📅</span>
                                <span>{checkIn.toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div>
                              <p style={{
                                fontSize: '11px',
                                fontWeight: '600',
                                textTransform: 'uppercase',
                                color: '#76767f',
                                marginBottom: '4px'
                              }}>
                                Check-out
                              </p>
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                color: '#050b36',
                                fontWeight: '500',
                                fontSize: '14px'
                              }}>
                                <span style={{ marginRight: '8px', color: '#7d5800' }}>📅</span>
                                <span>{checkOut.toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>

                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingTop: '12px',
                            borderTop: '1px solid rgba(199, 197, 208, 0.3)'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', color: '#46464e', fontSize: '14px' }}>
                              <span style={{ marginRight: '8px' }}>👥</span>
                              <span>{booking.number_of_guests} Guest{booking.number_of_guests !== 1 ? 's' : ''}</span>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <p style={{
                                fontSize: '11px',
                                fontWeight: '600',
                                textTransform: 'uppercase',
                                color: '#76767f',
                                marginBottom: '2px'
                              }}>
                                Booked on
                              </p>
                              <p style={{ fontSize: '14px', color: '#050b36' }}>{bookedOn.toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>

                        <div style={{
                          marginTop: '20px',
                          textAlign: 'right',
                          paddingTop: '12px',
                          borderTop: '1px solid rgba(199, 197, 208, 0.3)'
                        }}>
                          <span style={{
                            fontSize: '28px',
                            fontWeight: '600',
                            color: isCompleted ? '#76767f' : '#050b36'
                          }}>
                            {formatCurrency(booking.total_price)}
                          </span>
                        </div>
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