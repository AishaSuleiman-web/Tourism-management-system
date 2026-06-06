import type { User, Hotel, Guide, Package, Booking } from '../types'
import { mockUsers, mockHotels, mockGuides, mockPackages, mockBookings } from '../data/mockData'

// ── seed localStorage with mock data if empty ──────────────────────────────
export function seedStorage() {
  if (!localStorage.getItem('users'))    localStorage.setItem('users',    JSON.stringify(mockUsers))
  if (!localStorage.getItem('hotels'))   localStorage.setItem('hotels',   JSON.stringify(mockHotels))
  if (!localStorage.getItem('guides'))   localStorage.setItem('guides',   JSON.stringify(mockGuides))
  if (!localStorage.getItem('packages')) localStorage.setItem('packages', JSON.stringify(mockPackages))
  if (!localStorage.getItem('bookings')) localStorage.setItem('bookings', JSON.stringify(mockBookings))
}

// ── generic helpers ────────────────────────────────────────────────────────
function getItem<T>(key: string): T[] {
  return JSON.parse(localStorage.getItem(key) || '[]')
}

function setItem<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data))
}

function deleteById(key: string, id: string) {
  const items = getItem<{ id: string }>(key)
  setItem(key, items.filter(i => i.id !== id))
}

// ── users ──────────────────────────────────────────────────────────────────
export const getUsers  = (): User[]       => getItem<User>('users')
export const saveUsers = (users: User[])  => setItem('users', users)
export const deleteUser = (id: string)    => deleteById('users', id)

export function getUserByEmail(email: string): User | undefined {
  return getUsers().find(u => u.email === email)
}

// ── hotels ─────────────────────────────────────────────────────────────────
export const getHotels   = (): Hotel[]        => getItem<Hotel>('hotels')
export const saveHotels  = (h: Hotel[])       => setItem('hotels', h)
export const deleteHotel = (id: string)       => deleteById('hotels', id)
export function addHotel(hotel: Hotel) {
  const hotels = getHotels()
  setItem('hotels', [...hotels, hotel])
}

// ── guides ─────────────────────────────────────────────────────────────────
export const getGuides   = (): Guide[]        => getItem<Guide>('guides')
export const saveGuides  = (g: Guide[])       => setItem('guides', g)
export const deleteGuide = (id: string)       => deleteById('guides', id)
export function addGuide(guide: Guide) {
  const guides = getGuides()
  setItem('guides', [...guides, guide])
}

// ── packages ───────────────────────────────────────────────────────────────
export const getPackages   = (): Package[]      => getItem<Package>('packages')
export const savePackages  = (p: Package[])     => setItem('packages', p)
export const deletePackage = (id: string)       => deleteById('packages', id)
export function addPackage(pkg: Package) {
  const packages = getPackages()
  setItem('packages', [...packages, pkg])
}

// ── bookings ───────────────────────────────────────────────────────────────
export const getBookings   = (): Booking[]      => getItem<Booking>('bookings')
export const saveBookings  = (b: Booking[])     => setItem('bookings', b)
export const deleteBooking = (id: string)       => deleteById('bookings', id)

// ── session ────────────────────────────────────────────────────────────────
export function getCurrentUser(): User | null {
  return JSON.parse(localStorage.getItem('currentUser') || 'null')
}

export function loginUser(email: string, password: string): User | null {
  const user = getUsers().find(u => u.email === email && u.password === password)
  if (user) localStorage.setItem('currentUser', JSON.stringify(user))
  return user ?? null
}

export function logoutUser() {
  localStorage.removeItem('currentUser')
}