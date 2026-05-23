import { supabase } from '../config/supabaseClient.js'
import { sendBookingConfirmation } from '../utils/emailService.js'

export const getAllHotels = async (req, res) => {
  try {
    console.log('Fetching hotels from Supabase...')
    
    const { data, error } = await supabase
      .from('hotels')
      .select('*')
      .order('name')

    console.log('Supabase response:', { data, error })

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    res.json({ success: true, hotels: data || [] })
  } catch (err) {
    console.error('getAllHotels error:', err)
    res.status(500).json({ error: 'Failed to fetch hotels' })
  }
}

export const getHotelById = async (req, res) => {
  try {
    const { id } = req.params
    const { data, error } = await supabase.from('hotels').select('*').eq('id', id).single()
    if (error) return res.status(404).json({ error: 'Hotel not found' })
    res.json({ success: true, hotel: data })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch hotel' })
  }
}

export const createBooking = async (req, res) => {
  try {
    const { hotel_id, check_in, check_out, number_of_guests, total_price } = req.body
    const user_id = req.user.id
    const userEmail = req.user.email
    const userName = req.user.user_metadata?.full_name || 'Guest'

    if (new Date(check_in) >= new Date(check_out)) {
      return res.status(400).json({ error: 'Check-out date must be after check-in date' })
    }

    const { data: hotel, error: hotelError } = await supabase
      .from('hotels')
      .select('*')
      .eq('id', hotel_id)
      .single()

    if (hotelError || !hotel) {
      return res.status(404).json({ error: 'Hotel not found' })
    }

    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert([{
        user_id,
        hotel_id,
        check_in,
        check_out,
        number_of_guests,
        total_price,
        status: 'confirmed'
      }])
      .select()

    if (bookingError) throw bookingError

    sendBookingConfirmation(userEmail, userName, {
      check_in,
      check_out,
      number_of_guests,
      total_price
    }, hotel).catch(err => console.error('Email error:', err))

    res.json({
      success: true,
      message: 'Booking confirmed! Check your email for details.',
      booking: booking[0],
      hotel
    })
  } catch (err) {
    console.error('Booking error:', err)
    res.status(500).json({ error: 'Failed to create booking' })
  }
}

export const getUserBookings = async (req, res) => {
  try {
    console.log('Getting bookings for user:', req.user?.id)
    
    const { data, error } = await supabase
      .from('bookings')
      .select('*, hotels(*)')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })

    console.log('Bookings query result:', { data, error })

    if (error) throw error
    res.json({ success: true, bookings: data || [] })
  } catch (err) {
    console.error('getUserBookings error:', err)
    res.status(500).json({ error: 'Failed to fetch bookings' })
  }
}