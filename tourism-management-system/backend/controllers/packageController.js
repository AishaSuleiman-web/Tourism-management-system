import { supabase } from '../config/supabaseClient.js'

export const getAllPackages = async (req, res) => {
  try {
    console.log('Fetching packages from Supabase...')
    
    const { data, error } = await supabase
      .from('travel_packages')
      .select('*')
      .order('destination')

    if (error) throw error

    res.json({ success: true, packages: data || [] })
  } catch (err) {
    console.error('getAllPackages error:', err)
    res.status(500).json({ error: 'Failed to fetch packages' })
  }
}

export const getPackageById = async (req, res) => {
  try {
    const { id } = req.params
    const { data, error } = await supabase
      .from('travel_packages')
      .select('*')
      .eq('id', id)
      .single()
      
    if (error) return res.status(404).json({ error: 'Package not found' })
    res.json({ success: true, package: data })
  } catch (err) {
    console.error('getPackageById error:', err)
    res.status(500).json({ error: 'Failed to fetch package' })
  }
}

// BOOK A PACKAGE
export const bookPackage = async (req, res) => {
  try {
    const { package_id, booking_date, number_of_people, total_price } = req.body
    const user_id = req.user.id

    if (new Date(booking_date) < new Date()) {
      return res.status(400).json({ error: 'Booking date cannot be in the past' })
    }

    const { data: packageData, error: packageError } = await supabase
      .from('travel_packages')
      .select('*')
      .eq('id', package_id)
      .single()

    if (packageError || !packageData) {
      return res.status(404).json({ error: 'Package not found' })
    }

    const { data: booking, error: bookingError } = await supabase
      .from('package_bookings')
      .insert([{
        user_id,
        package_id,
        booking_date,
        number_of_people,
        total_price,
        status: 'pending'
      }])
      .select()

    if (bookingError) throw bookingError

    res.json({
      success: true,
      message: 'Package booking confirmed!',
      booking: booking[0],
      package: packageData
    })
  } catch (err) {
    console.error('Booking error:', err)
    res.status(500).json({ error: 'Failed to create booking' })
  }
}

export const getUserPackageBookings = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('package_bookings')
      .select('*, travel_packages(*)')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    res.json({ success: true, bookings: data || [] })
  } catch (err) {
    console.error('getUserPackageBookings error:', err)
    res.status(500).json({ error: 'Failed to fetch package bookings' })
  }
}