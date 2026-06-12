import express from 'express'
import { 
  getAllGuides, 
  getGuideById, 
  bookGuide, 
  getUserGuideBookings 
} from '../controllers/guideController.js'
import { verifyToken } from '../middleware/authMiddleware.js'

const router = express.Router()

// Public routes
router.get('/', getAllGuides)
router.get('/:id', getGuideById)

// Protected routes (use your existing verifyToken)
router.post('/book', verifyToken, bookGuide)
router.get('/user/bookings', verifyToken, getUserGuideBookings)

export default router