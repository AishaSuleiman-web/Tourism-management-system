import { supabase } from '../config/supabaseClient.js'
import { sendEmailViaNodemailer } from '../utils/emailService.js'
import { supabaseAdmin } from '../config/supabaseAdmin.js'
import { generateEmailToken, generatePasswordResetToken, verifyToken } from '../utils/jwt.js'


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

    // Try Supabase Auth first
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: 'http://localhost:5173/login'
      }
    })

    // Check for rate limit error
    if (error && error.message && error.message.toLowerCase().includes('rate limit')) {
      console.log('Supabase rate limit reached, falling back to admin API')
      
      try {
        // Use admin API to create user directly (bypasses rate limit)
        const { data: adminData, error: adminError } = await supabaseAdmin.auth.admin.createUser({
          email: email,
          password: password,
          email_confirm: false,
          user_metadata: { full_name: name }
        })

        if (adminError) {
          console.error('Admin create user error:', adminError)
          return res.status(400).json({ error: adminError.message })
        }

        const user = adminData.user
        
        // CREATE PROFILE IMMEDIATELY WITH EMAIL
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{ 
            id: user.id, 
            name: name, 
            email: email,
            is_admin: false 
          }])

        if (profileError) {
          console.error('Profile creation error in fallback:', profileError)
        }
        
        // Generate custom JWT token for email verification
        const token = generateEmailToken(user.id, email, name)
        const verificationLink = `http://localhost:5000/api/auth/verify-email?token=${token}&redirect=http://localhost:5173/login`

        const subject = 'Welcome to TourEase - Verify Your Email'
        const html = `
          <!DOCTYPE html>
          <html>
          <head><meta charset="utf-8"></head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 40px 0;">
              <tr>
                <td align="center">
                  <table width="500" cellpadding="0" cellspacing="0" style="background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    
                    <tr>
                      <td style="background-color: #3B82F6; padding: 30px 20px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 24px;">TourEase</h1>
                      </td>
                    </tr>
                    
                    <tr>
                      <td style="padding: 30px 25px;">
                        <p style="font-size: 18px; margin-top: 0;">Hello ${name},</p>
                        <p>Thank you for choosing <strong>TourEase</strong>! We're excited to have you on board.</p>
                        <p>Please confirm your email address by clicking the button below:</p>
                        
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                          <tr>
                            <td align="center">
                              <a href="${verificationLink}" style="background-color: #3B82F6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Confirm Email Address</a>
                            </td>
                          </tr>
                        </table>
                        
                        <p>If the button doesn't work, copy and paste this link into your browser:</p>
                        <p style="background-color: #f4f4f4; padding: 10px; border-radius: 4px; word-break: break-all; font-size: 12px;">${verificationLink}</p>
                        
                        <p>This link will expire in 24 hours.</p>
                        
                        <p>If you didn't create an account with us, you can safely ignore this email.</p>
                        
                        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                        
                        <p style="color: #999; font-size: 11px; text-align: center;">&copy; 2025 TourEase. All rights reserved.</p>
                      </td>
                    </tr>
                    
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `

        const emailResult = await sendEmailViaNodemailer(email, subject, html)
        
        if (emailResult.success) {
          console.log('Verification email sent via nodemailer to:', email)
        } else {
          console.error('Failed to send verification email:', emailResult.error)
        }

        return res.status(201).json({
          success: true,
          message: 'Registration successful. Please verify your email (sent via backup mail).'
        })
      } catch (adminErr) {
        console.error('Admin API fallback error:', adminErr)
        return res.status(500).json({ error: 'Registration failed due to rate limit. Please try again later.' })
      }
    }

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    // CREATE PROFILE FOR REGULAR SUPABASE REGISTRATION (WITH EMAIL)
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ 
          id: data.user.id, 
          name: name, 
          email: email,
          is_admin: false 
        }])

      if (profileError) {
        console.error('Profile creation error:', profileError)
      }
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please check your email for confirmation.'
    })
  } catch (err) {
    console.error('Registration error:', err)
    res.status(500).json({ error: 'Server error' })
  }
}

// VERIFY EMAIL - Creates profile ONLY after email is verified (if not already exists)
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query
    const redirectUrl = req.query.redirect || 'http://localhost:5173/login'

    if (!token) {
      return res.redirect(`${redirectUrl}?error=Invalid verification link`)
    }

    const decoded = verifyToken(token)

    if (!decoded || decoded.type !== 'email_confirmation') {
      return res.redirect(`${redirectUrl}?error=Invalid or expired verification link`)
    }

    // Check if profile already exists (to avoid duplicate)
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', decoded.id)
      .maybeSingle()

    // Update user's email confirmation status in auth.users
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(decoded.id, {
      email_confirm: true
    })

    if (updateError) {
      console.error('Error confirming email:', updateError)
      return res.redirect(`${redirectUrl}?error=Verification failed. Please try again.`)
    }

    // Create profile ONLY AFTER email is verified (if not already exists)
    if (!existingProfile) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ 
          id: decoded.id, 
          name: decoded.name, 
          email: decoded.email,
          is_admin: false 
        }])

      if (profileError) {
        console.error('Profile creation error after verification:', profileError)
      }
    }

    res.redirect(`${redirectUrl}?verified=true`)
  } catch (err) {
    console.error('Verification error:', err)
    res.redirect(`${redirectUrl}?error=Server error. Please try again.`)
  }
}

// LOGIN - Only allows verified users
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' })
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      if (error.message && error.message.toLowerCase().includes('email not confirmed')) {
        return res.status(401).json({ error: 'Please verify your email before logging in. Check your inbox.' })
      }
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    if (!data.user.email_confirmed_at) {
      return res.status(401).json({ error: 'Please verify your email before logging in. Check your inbox.' })
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
    console.error('Login error:', err)
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

// FORGOT PASSWORD - Uses email column in profiles table
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ error: 'Email required' })

    console.log('Looking up user with email:', email)

    let userId = null
    let userName = null
    
    try {
      // Query profiles table using email column
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, name')
        .eq('email', email)
        .maybeSingle()
      
      if (!profileError && profileData) {
        userId = profileData.id
        userName = profileData.name || 'User'
        console.log('User found in profiles:', userId)
      }
    } catch (dbError) {
      console.log('Profiles lookup error:', dbError.message)
    }

    if (!userId) {
      console.log('No user found for email:', email)
      return res.json({ 
        success: true, 
        message: 'If an account exists with this email, you will receive a password reset link.' 
      })
    }

    const token = generatePasswordResetToken(userId, email)
    const resetLink = `http://localhost:5173/reset-password?token=${token}`

    const subject = 'Reset Your Password - TourEase'
    const html = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 40px 0;">
          <tr>
            <td align="center">
              <table width="500" cellpadding="0" cellspacing="0" style="background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                
                <tr>
                  <td style="background-color: #3B82F6; padding: 30px 20px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">TourEase</h1>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 30px 25px;">
                    <p style="font-size: 18px; margin-top: 0;">Hello ${userName},</p>
                    <p>We received a request to reset the password for your <strong>TourEase</strong> account.</p>
                    <p>Click the button below to create a new password:</p>
                    
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                      <tr>
                        <td align="center">
                          <a href="${resetLink}" style="background-color: #3B82F6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
                        </td>
                      </tr>
                    </tr>
                    
                    <p>If the button doesn't work, copy and paste this link into your browser:</p>
                    <p style="background-color: #f4f4f4; padding: 10px; border-radius: 4px; word-break: break-all; font-size: 12px;">${resetLink}</p>
                    
                    <p>This link will expire in 1 hour.</p>
                    
                    <p>If you didn't request this, please ignore this email. Your password will remain unchanged.</p>
                    
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                    
                    <p style="color: #999; font-size: 11px; text-align: center;">&copy; 2025 TourEase. All rights reserved.</p>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `

    const result = await sendEmailViaNodemailer(email, subject, html)

    if (result.success) {
      return res.json({ 
        success: true, 
        message: 'Password reset email sent. Check your inbox.' 
      })
    } else {
      return res.status(500).json({ error: 'Failed to send reset email. Please try again.' })
    }
  } catch (err) {
    console.error('Forgot password error:', err)
    res.status(500).json({ error: 'Server error. Please try again.' })
  }
}

// RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const { password, token } = req.body
    if (!password || !token) return res.status(400).json({ error: 'Password and token required' })

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' })
    }

    // Try custom JWT token first (from nodemailer fallback)
    const decoded = verifyToken(token)
    if (decoded && decoded.type === 'password_reset') {
      console.log('Updating password via admin API for user:', decoded.id)
      
      const { error } = await supabaseAdmin.auth.admin.updateUserById(decoded.id, {
        password: password
      })

      if (error) {
        console.error('Admin update error:', error)
        return res.status(400).json({ error: error.message })
      }

      return res.json({ success: true, message: 'Password updated successfully' })
    }

    // Try Supabase session token (from Supabase email link)
    const { error: sessionError } = await supabase.auth.setSession({
      access_token: token,
      refresh_token: token
    })

    if (sessionError) {
      console.error('Session error:', sessionError)
      return res.status(401).json({ error: 'Invalid or expired token' })
    }

    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      console.error('Update user error:', error)
      return res.status(400).json({ error: error.message })
    }

    res.json({ success: true, message: 'Password updated successfully' })
  } catch (err) {
    console.error('Reset password error:', err)
    res.status(500).json({ error: 'Server error. Please try again.' })
  }
}