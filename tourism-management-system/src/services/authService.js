import API_URL from '../config/api';

const API_ENDPOINT = `${API_URL}/api/auth`;

// Register user
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    })

    const data = await response.json()

    if (!response.ok) throw data

    return { success: true, data }
  } catch (error) {
    return { success: false, error: error.error || 'Registration failed' }
  }
}

export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    const data = await response.json()

    if (!response.ok) throw data

    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))

    return { success: true, data }
  } catch (error) {
    return { success: false, error: error.error || 'Login failed' }
  }
}

export const getProfile = async () => {
  const token = localStorage.getItem('token')
  if (!token) return { success: false, error: 'No token' }

  try {
    const response = await fetch(`${API_ENDPOINT}/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    const data = await response.json()
    if (!response.ok) throw data
    return { success: true, user: data.user }
  } catch (error) {
    return { success: false, error: error.error || 'Failed to get profile' }
  }
}

export const forgotPassword = async (email) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
    const data = await response.json()
    if (!response.ok) throw data
    return { success: true, message: data.message }
  } catch (error) {
    return { success: false, error: error.error || 'Failed to send reset email' }
  }
}

export const updatePassword = async (password, token) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, token })
    })
    const data = await response.json()
    if (!response.ok) throw data
    return { success: true, message: data.message }
  } catch (error) {
    return { success: false, error: error.error || 'Failed to update password' }
  }
}

export const logoutUser = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

export const getCurrentUser = () => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}