import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes.js'
import hotelRoutes from './routes/hotelRoutes.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/hotels', hotelRoutes)
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`)
})