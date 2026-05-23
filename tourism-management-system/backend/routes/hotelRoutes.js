import express from 'express'
import { verifyToken } from '../middleware/authMiddleware.js'
import {
  getAllHotels,
  getHotelById,
  createBooking,
  getUserBookings
} from '../controllers/hotelController.js'

const router = express.Router()

router.get('/', getAllHotels)
router.get('/my-bookings', verifyToken, getUserBookings)


router.get('/:id', getHotelById)
router.post('/book', verifyToken, createBooking)


export default router