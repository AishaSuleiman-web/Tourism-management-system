import express from 'express'
import { getAllDestinations, getAllGuides, getAllPackages } from '../controllers/destinationController.js'

const router = express.Router()

router.get('/', getAllDestinations)
router.get('/guides', getAllGuides)
router.get('/packages', getAllPackages)

export default router