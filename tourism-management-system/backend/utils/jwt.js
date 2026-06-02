import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_change_this'

export const generateEmailToken = (userId, email, name) => {
  return jwt.sign(
    { 
      id: userId, 
      email: email,
      name: name,
      type: 'email_confirmation'
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  )
}

export const generatePasswordResetToken = (userId, email) => {
  return jwt.sign(
    { 
      id: userId, 
      email: email,
      type: 'password_reset'
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  )
}

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}