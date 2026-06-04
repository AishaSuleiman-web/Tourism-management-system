import { useState, useEffect } from 'react'
import { supabase } from '../config/supabaseClient'
import { formatCurrency } from '../utils/formatCurrency'

function MyBookings() {
  const [allBookings, setAllBookings] = useState([])
  const [filteredBookings, setFilteredBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')

  useEffect(() => {
    loadAllBookings()
  }, [])

  useEffect(() => {
    filterBookings()
  }, [typeFilter, allBookings])

  const loadAllBookings = async () => {
    setLoading(true)
    setError('')
    
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      const userId = user.id
      
      if (!userId) {
        setError('Please login to view bookings')
        setLoading(false)
        return
      }

      // Fetch Hotel Bookings
      const { data: hotelBookings, error: hotelError } = await supabase
        .from('bookings')
        .select(`
          *,
          hotels (name, location, image_url)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (hotelError) throw hotelError

      const hotelBookingsWithType = (hotelBookings || []).map(booking => ({
        ...booking,
        booking_type: 'hotel',
        item_name: booking.hotels?.name || 'Unknown Hotel',
        item_location: booking.hotels?.location || '',
        item_image: booking.hotels?.image_url,
        start_date: booking.check_in,
        end_date: booking.check_out,
        guests: booking.number_of_guests,
        detail_link: `/hotels/${booking.hotel_id}`
      }))

      // Fetch Guide Bookings
      const { data: guideBookings, error: guideError } = await supabase
        .from('guide_bookings')
        .select(`
          *,
          guides (name, location, image_url, price_per_day)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (guideError) throw guideError

      const guideBookingsWithType = (guideBookings || []).map(booking => ({
        ...booking,
        booking_type: 'guide',
        item_name: booking.guides?.name || 'Unknown Guide',
        item_location: booking.guides?.location || '',
        item_image: booking.guides?.image_url,
        start_date: booking.tour_date,
        end_date: booking.tour_date,
        guests: booking.group_size,
        duration_days: booking.duration_days,
        detail_link: `/guide/${booking.guide_id}`
      }))

      // Fetch Package Bookings
      const { data: packageBookings, error: packageError } = await supabase
        .from('package_bookings')
        .select(`
          *,
          travel_packages (destination, duration, price, image_url)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (packageError) throw packageError

      const packageBookingsWithType = (packageBookings || []).map(booking => ({
        ...booking,
        booking_type: 'package',
        item_name: booking.travel_packages?.destination || 'Unknown Package',
        item_location: '',
        item_image: booking.travel_packages?.image_url,
        start_date: booking.booking_date,
        end_date: booking.booking_date,
        guests: booking.number_of_people,
        detail_link: `/packages/${booking.package_id}`
      }))

      // Combine all bookings
      const all = [...hotelBookingsWithType, ...guideBookingsWithType, ...packageBookingsWithType]
      all.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      
      setAllBookings(all)
      
    } catch (err) {
      console.error('Error loading bookings:', err)
      setError('Failed to load your bookings. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const filterBookings = () => {
    let filtered = [...allBookings]
    if (typeFilter !== 'all') {
      filtered = filtered.filter(booking => booking.booking_type === typeFilter)
    }
    setFilteredBookings(filtered)
  }

  const getBookingStatus = (booking) => {
    const endDate = new Date(booking.end_date)
    const isCompleted = endDate < new Date()
    
    if (booking.status === 'cancelled') {
      return { text: 'Cancelled', class: 'status-cancelled' }
    }
    if (isCompleted) {
      return { text: 'Completed', class: 'status-completed' }
    }
    if (booking.status === 'confirmed') {
      return { text: 'Confirmed', class: 'status-confirmed' }
    }
    return { text: booking.status || 'Pending', class: 'status-pending' }
  }

  const stats = {
    all: allBookings.length,
    hotel: allBookings.filter(b => b.booking_type === 'hotel').length,
    guide: allBookings.filter(b => b.booking_type === 'guide').length,
    package: allBookings.filter(b => b.booking_type === 'package').length
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

        {/* Type Filter Buttons */}
        {allBookings.length > 0 && (
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
            <button 
              onClick={() => setTypeFilter('all')}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: typeFilter === 'all' ? '2px solid #f0bf65' : '1px solid #e5e7eb',
                background: typeFilter === 'all' ? '#f0bf65' : 'white',
                color: typeFilter === 'all' ? '#050b36' : '#4b5563',
                fontWeight: '500',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              All ({stats.all})
            </button>
            <button 
              onClick={() => setTypeFilter('hotel')}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: typeFilter === 'hotel' ? '2px solid #f0bf65' : '1px solid #e5e7eb',
                background: typeFilter === 'hotel' ? '#f0bf65' : 'white',
                color: typeFilter === 'hotel' ? '#050b36' : '#4b5563',
                fontWeight: '500',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Hotels ({stats.hotel})
            </button>
            <button 
              onClick={() => setTypeFilter('guide')}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: typeFilter === 'guide' ? '2px solid #f0bf65' : '1px solid #e5e7eb',
                background: typeFilter === 'guide' ? '#f0bf65' : 'white',
                color: typeFilter === 'guide' ? '#050b36' : '#4b5563',
                fontWeight: '500',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Tour Guides ({stats.guide})
            </button>
            <button 
              onClick={() => setTypeFilter('package')}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: typeFilter === 'package' ? '2px solid #f0bf65' : '1px solid #e5e7eb',
                background: typeFilter === 'package' ? '#f0bf65' : 'white',
                color: typeFilter === 'package' ? '#050b36' : '#4b5563',
                fontWeight: '500',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Packages ({stats.package})
            </button>
          </div>
        )}

        {error && (
          <div className="bookings-error">
            {error}
          </div>
        )}
        
        {filteredBookings.length === 0 ? (
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
            {filteredBookings.map((booking) => {
              const status = getBookingStatus(booking)
              const bookedOn = new Date(booking.created_at || booking.booking_date)
              
              let dateDisplay = ''
              if (booking.booking_type === 'hotel') {
                dateDisplay = `${new Date(booking.start_date).toLocaleDateString()} - ${new Date(booking.end_date).toLocaleDateString()}`
              } else if (booking.booking_type === 'guide') {
                dateDisplay = `${new Date(booking.start_date).toLocaleDateString()} (${booking.duration_days} day(s))`
              } else {
                dateDisplay = new Date(booking.start_date).toLocaleDateString()
              }

              return (
                <a 
                  key={`${booking.booking_type}-${booking.id}`}
                  href={booking.detail_link}
                  className="booking-card"
                >
                  <div className="booking-card-inner">
                    
                    <div className="booking-image">
                      <img 
                        src={booking.item_image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'} 
                        alt={booking.item_name}
                      />
                      <div className={`booking-status ${status.class}`}>
                        {status.text}
                      </div>
                    </div>

                    <div className="booking-content">
                      <div>
                        <h3 className="booking-hotel-name">{booking.item_name}</h3>
                        {booking.item_location && (
                          <div className="booking-location">
                            <span style={{ marginRight: '4px' }}>📍</span>
                            <span>{booking.item_location}</span>
                          </div>
                        )}

                        <div className="booking-dates">
                          <div>
                            <p className="date-label">
                              {booking.booking_type === 'hotel' ? 'Check-in' : 'Tour Date'}
                            </p>
                            <div className="date-value">
                              <span>📅</span>
                              <span>{dateDisplay}</span>
                            </div>
                          </div>
                          {booking.booking_type === 'hotel' && (
                            <div>
                              <p className="date-label">Check-out</p>
                              <div className="date-value">
                                <span>📅</span>
                                <span>{new Date(booking.end_date).toLocaleDateString()}</span>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="booking-meta">
                          <div className="booking-guests">
                            <span style={{ marginRight: '8px' }}>👥</span>
                            <span>{booking.guests} Guest{booking.guests !== 1 ? 's' : ''}</span>
                          </div>
                          <div className="booking-date">
                            <p className="booking-date-label">Booked on</p>
                            <p className="booking-date-value">{bookedOn.toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>

                      <div className="booking-price">
                        <span className={`booking-price-value ${status.text === 'Completed' ? 'completed' : ''}`}>
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