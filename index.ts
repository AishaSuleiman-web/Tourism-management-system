export interface User {
  id: string
  name: string
  email: string
  password: string
  role: 'admin' | 'user'
  createdAt: string
}

export interface Hotel {
  id: string
  name: string
  location: string
  pricePerNight: number
  rating: number
  image: string
  description: string
  amenities: string[]
}

export interface Guide {
  id: string
  name: string
  specialty: string
  language: string
  pricePerDay: number
  photo: string
  description: string
}

export interface Package {
  id: string
  destination: string
  duration: string
  price: number
  inclusions: string[]
  image: string
  description: string
}

export interface Booking {
  id: string
  userId: string
  userName: string
  type: 'hotel' | 'guide' | 'package'
  itemId: string
  itemName: string
  date: string
  status: 'confirmed' | 'pending' | 'cancelled'
  totalPrice: number
}