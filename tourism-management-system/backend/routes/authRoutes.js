import express from 'express'
import { register, login, getProfile, forgotPassword, resetPassword, verifyEmail } from '../controllers/authController.js'
import { verifyToken } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)
router.get('/verify-email', verifyEmail)
router.get('/profile', verifyToken, getProfile)


export default router