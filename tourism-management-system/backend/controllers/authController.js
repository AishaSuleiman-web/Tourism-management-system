import { supabase } from '../config/supabaseClient.js'

// REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    console.log("Received:", { name, email, password })

    if (!name || !email || !password) {
      console.log("Missing fields")
      return res.status(400).json({ error: 'All fields are required' })
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' })
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: 'http://localhost:5173/login'
      }
    })

    if (error) return res.status(400).json({ error: error.message })

    // Create profile entry for the new user
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ id: data.user.id, name: name, is_admin: false }])

      if (profileError) {
        console.error('Profile creation error:', profileError)
      }
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please check your email for confirmation.'
    })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}

// LOGIN (includes is_admin)
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' })
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) return res.status(401).json({ error: 'Invalid email or password' })

    if (!data.user.email_confirmed_at) {
      return res.status(401).json({ error: 'Please verify your email before logging in' })
    }

    // Fetch is_admin from profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', data.user.id)
      .maybeSingle()

    const isAdmin = profile?.is_admin === true

    res.json({
      success: true,
      token: data.session.access_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.full_name,
        is_admin: isAdmin
      }
    })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}

// GET PROFILE (includes is_admin)
export const getProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ error: 'No token' })

    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) return res.status(401).json({ error: 'Invalid token' })

    // Fetch is_admin from profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .maybeSingle()

    const isAdmin = profile?.is_admin === true

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name,
        is_admin: isAdmin
      }
    })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}

// FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ error: 'Email required' })

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:5173/reset-password'
    })

    if (error) return res.status(400).json({ error: error.message })

    res.json({ success: true, message: 'Password reset email sent' })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}

// RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const { password, token } = req.body
    if (!password || !token) return res.status(400).json({ error: 'Password and token required' })

    const { error: sessionError } = await supabase.auth.setSession({
      access_token: token,
      refresh_token: token
    })

    if (sessionError) return res.status(401).json({ error: 'Invalid or expired token' })

    const { error } = await supabase.auth.updateUser({ password })
    if (error) return res.status(400).json({ error: error.message })

    res.json({ success: true, message: 'Password updated successfully' })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}