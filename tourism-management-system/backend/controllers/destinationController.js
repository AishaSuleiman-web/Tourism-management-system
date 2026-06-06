import { supabase } from '../config/supabaseClient.js'

export const getAllDestinations = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .order('name')

    if (error) throw error
    res.json({ success: true, destinations: data || [] })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch destinations' })
  }
}

export const getAllGuides = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tour_guide')
      .select('*')
      .order('name')

    console.log('Guides data:', data)
    console.log('Guides error:', error)

    if (error) throw error
    res.json({ success: true, guides: data || [] })
  } catch (err) {
    console.error('getAllGuides error:', err)
    res.status(500).json({ error: 'Failed to fetch tour guides' })
  }
}