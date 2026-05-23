const API_URL = 'http://localhost:5000/api/hotels'

export const getAllHotels = async () => {
  try {
    const response = await fetch(API_URL)
    const data = await response.json()
    
    console.log('Raw API response:', data)  // Debug line
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch hotels')
    }
    
    // Handle both response formats
    let hotels = []
    if (Array.isArray(data)) {
      hotels = data
    } else if (data.hotels && Array.isArray(data.hotels)) {
      hotels = data.hotels
    } else if (data.data && Array.isArray(data.data)) {
      hotels = data.data
    } else {
      console.error('Unexpected response format:', data)
      throw new Error('Invalid response format from server')
    }
    
    return { success: true, hotels: hotels }
  } catch (error) {
    console.error('Fetch hotels error:', error)
    return { success: false, error: error.message }
  }
}

export const getHotelById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`)
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Hotel not found')
    }
    
    // Handle both response formats
    let hotel = null
    if (data.hotel) {
      hotel = data.hotel
    } else if (data.data) {
      hotel = data.data
    } else {
      hotel = data
    }
    
    return { success: true, hotel: hotel }
  } catch (error) {
    console.error('Fetch hotel error:', error)
    return { success: false, error: error.message }
  }
}

export const bookHotel = async (bookingData) => {
  const token = localStorage.getItem('token')
  
  if (!token) {
    return { success: false, error: 'Please login to book' }
  }

  try {
    const response = await fetch(`${API_URL}/book`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(bookingData)
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Booking failed')
    }
    
    return { success: true, data }
  } catch (error) {
    console.error('Booking error:', error)
    return { success: false, error: error.message }
  }
}

export const getUserBookings = async () => {
  const token = localStorage.getItem('token')
  
  if (!token) {
    return { success: false, error: 'Please login' }
  }

  try {
    const response = await fetch(`${API_URL}/my-bookings`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to load bookings')
    }
    
    let bookings = []
    if (Array.isArray(data)) {
      bookings = data
    } else if (data.bookings && Array.isArray(data.bookings)) {
      bookings = data.bookings
    } else if (data.data && Array.isArray(data.data)) {
      bookings = data.data
    }
    
    return { success: true, bookings: bookings }
  } catch (error) {
    console.error('Fetch bookings error:', error)
    return { success: false, error: error.message }
  }
}