import { supabase } from '../config/supabaseClient.js'

// GET ALL GUIDES
export const getAllGuides = async (req, res) => {
  try {
    console.log('Fetching guides from Supabase...')
    
    const { data, error } = await supabase
      .from('guides')
      .select('*')
      .order('name')

    console.log('Supabase response:', { data, error })

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    res.json({ success: true, guides: data || [] })
  } catch (err) {
    console.error('getAllGuides error:', err)
    res.status(500).json({ error: 'Failed to fetch guides' })
  }
}

// GET SINGLE GUIDE BY ID
export const getGuideById = async (req, res) => {
  try {
    const { id } = req.params
    const { data, error } = await supabase
      .from('guides')
      .select('*')
      .eq('id', id)
      .single()
      
    if (error) return res.status(404).json({ error: 'Guide not found' })
    res.json({ success: true, guide: data })
  } catch (err) {
    console.error('getGuideById error:', err)
    res.status(500).json({ error: 'Failed to fetch guide' })
  }
}

// BOOK A GUIDE
export const bookGuide = async (req, res) => {
  try {
    const { guide_id, tour_date, group_size, duration_days, total_price } = req.body
    const user_id = req.user.id

    if (new Date(tour_date) < new Date()) {
      return res.status(400).json({ error: 'Booking date cannot be in the past' })
    }

    // Check if guide exists
    const { data: guide, error: guideError } = await supabase
      .from('guides')
      .select('*')
      .eq('id', guide_id)
      .single()

    if (guideError || !guide) {
      return res.status(404).json({ error: 'Guide not found' })
    }

    // Create booking
    const { data: booking, error: bookingError } = await supabase
      .from('guide_bookings')
      .insert([{
        user_id,
        guide_id,
        tour_date,
        group_size: group_size || 1,
        duration_days: duration_days || 1,
        total_price,
        status: 'pending'
      }])
      .select()

    if (bookingError) throw bookingError

    res.json({
      success: true,
      message: 'Guide booking confirmed!',
      booking: booking[0],
      guide
    })
  } catch (err) {
    console.error('Booking error:', err)
    res.status(500).json({ error: 'Failed to create booking' })
  }
}

// GET USER'S GUIDE BOOKINGS
export const getUserGuideBookings = async (req, res) => {
  try {
    console.log('Getting guide bookings for user:', req.user?.id)
    
    const { data, error } = await supabase
      .from('guide_bookings')
      .select('*, guides(*)')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })

    console.log('Guide bookings query result:', { data, error })

    if (error) throw error
    res.json({ success: true, bookings: data || [] })
  } catch (err) {
    console.error('getUserGuideBookings error:', err)
    res.status(500).json({ error: 'Failed to fetch guide bookings' })
  }
}