import type { User, Hotel, Guide, Package, Booking } from '../types'

export const mockUsers: User[] = [
  { id: 'u1', name: 'Emmanuel Oladimeji', email: 'admin@travel.com', password: 'admin123', role: 'admin', createdAt: '2026-01-01' },
  { id: 'u2', name: 'John Doe', email: 'john@email.com', password: 'user123', role: 'user', createdAt: '2026-02-10' },
  { id: 'u3', name: 'Jane Smith', email: 'jane@email.com', password: 'user123', role: 'user', createdAt: '2026-03-05' },
  { id: 'u4', name: 'Carlos Rivera', email: 'carlos@email.com', password: 'user123', role: 'user', createdAt: '2026-03-20' },
]

export const mockHotels: Hotel[] = [
  { id: 'h1', name: 'Grand Azure Hotel', location: 'Paris, France', pricePerNight: 250, rating: 4.8, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400', description: 'Luxury hotel in the heart of Paris.', amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant'] },
  { id: 'h2', name: 'Ocean Breeze Resort', location: 'Bali, Indonesia', pricePerNight: 180, rating: 4.6, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400', description: 'Beautiful beachfront resort.', amenities: ['WiFi', 'Beach Access', 'Pool', 'Bar'] },
  { id: 'h3', name: 'Mountain View Lodge', location: 'Swiss Alps', pricePerNight: 320, rating: 4.9, image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400', description: 'Stunning alpine lodge.', amenities: ['WiFi', 'Ski Access', 'Fireplace', 'Restaurant'] },
  { id: 'h4', name: 'Desert Rose Hotel', location: 'Dubai, UAE', pricePerNight: 400, rating: 4.7, image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400', description: 'Ultra-luxury desert experience.', amenities: ['WiFi', 'Pool', 'Gym', 'Concierge'] },
]

export const mockGuides: Guide[] = [
  { id: 'g1', name: 'Sofia Martini', specialty: 'Historical Tours', language: 'English, Italian', pricePerDay: 120, photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400', description: 'Expert in European history and culture.' },
  { id: 'g2', name: 'Ahmed Hassan', specialty: 'Desert Adventures', language: 'English, Arabic', pricePerDay: 100, photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', description: 'Specialist in Middle Eastern desert tours.' },
  { id: 'g3', name: 'Yuki Tanaka', specialty: 'Cultural Immersion', language: 'English, Japanese', pricePerDay: 90, photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400', description: 'Deep cultural experiences across Asia.' },
]

export const mockPackages: Package[] = [
  { id: 'p1', destination: 'Paris & Rome', duration: '7 days', price: 2500, inclusions: ['Flights', 'Hotels', 'Tours', 'Meals'], image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400', description: 'The ultimate European city break.' },
  { id: 'p2', destination: 'Bali Explorer', duration: '10 days', price: 1800, inclusions: ['Flights', 'Resort', 'Activities', 'Breakfast'], image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400', description: 'Discover the magic of Bali.' },
  { id: 'p3', destination: 'Safari Kenya', duration: '8 days', price: 3200, inclusions: ['Flights', 'Lodge', 'Game Drives', 'All Meals'], image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400', description: 'Unforgettable African wildlife experience.' },
]

export const mockBookings: Booking[] = [
  { id: 'b1', userId: 'u2', userName: 'John Doe', type: 'hotel', itemId: 'h1', itemName: 'Grand Azure Hotel', date: '2026-05-15', status: 'confirmed', totalPrice: 750 },
  { id: 'b2', userId: 'u3', userName: 'Jane Smith', type: 'package', itemId: 'p1', itemName: 'Paris & Rome', date: '2026-06-01', status: 'confirmed', totalPrice: 2500 },
  { id: 'b3', userId: 'u4', userName: 'Carlos Rivera', type: 'guide', itemId: 'g1', itemName: 'Sofia Martini', date: '2026-05-20', status: 'pending', totalPrice: 360 },
  { id: 'b4', userId: 'u2', userName: 'John Doe', type: 'package', itemId: 'p3', itemName: 'Safari Kenya', date: '2026-07-10', status: 'pending', totalPrice: 3200 },
  { id: 'b5', userId: 'u3', userName: 'Jane Smith', type: 'hotel', itemId: 'h2', itemName: 'Ocean Breeze Resort', date: '2026-06-15', status: 'cancelled', totalPrice: 540 },
]