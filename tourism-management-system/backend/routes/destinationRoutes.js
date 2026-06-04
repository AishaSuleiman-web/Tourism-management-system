import express from 'express'
import { getAllDestinations, getAllGuides } from '../controllers/destinationController.js'

const router = express.Router()

router.get('/', getAllDestinations)
router.get('/guides', getAllGuides)

export default router