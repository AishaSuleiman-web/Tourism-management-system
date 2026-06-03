import express from 'express'
import { 
  getAllPackages, 
  getPackageById, 
  bookPackage, 
  getUserPackageBookings 
} from '../controllers/packageController.js'
import { verifyToken } from '../middleware/authMiddleware.js'

const router = express.Router()

// Public routes
router.get('/', getAllPackages)
router.get('/:id', getPackageById)

// Protected routes
router.post('/book', verifyToken, bookPackage)
router.get('/user/bookings', verifyToken, getUserPackageBookings)

export default router