import { useEffect, useState } from 'react'
import StatCard from '../components/StatCard'
import {
  getUsers, getHotels, getGuides,
  getPackages, getBookings
} from '../utils/storage'
import type { Booking } from '../types'

export default function Dashboard() {
  const [bookings, setBookings] = useState<Booking[]>([])

  useEffect(() => {
    setBookings(getBookings())
  }, [])

  const users    = getUsers()
  const hotels   = getHotels()
  const guides   = getGuides()
  const packages = getPackages()

  const confirmed  = bookings.filter(b => b.status === 'confirmed').length
  const pending    = bookings.filter(b => b.status === 'pending').length
  const cancelled  = bookings.filter(b => b.status === 'cancelled').length
  const revenue    = bookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + b.totalPrice, 0)

  const recent = [...bookings]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  function statusBadge(status: string) {
    if (status === 'confirmed') return <span className="badge badge-green">{status}</span>
    if (status === 'pending')   return <span className="badge badge-yellow">{status}</span>
    return <span className="badge badge-red">{status}</span>
  }

  function typeBadge(type: string) {
    return <span className="badge badge-blue">{type}</span>
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Dashboard</h1>
        <span style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>
          Welcome back, Admin
        </span>
      </div>

      {/* Stats row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
        <StatCard label="Total Users"    value={users.length}    icon="👥" color="#3b82f6" />
        <StatCard label="Total Hotels"   value={hotels.length}   icon="🏨" color="#8b5cf6" />
        <StatCard label="Tour Guides"    value={guides.length}   icon="🧭" color="#06b6d4" />
        <StatCard label="Packages"       value={packages.length} icon="📦" color="#f59e0b" />
      </div>

      {/* Stats row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        <StatCard label="Total Bookings"    value={bookings.length} icon="📋" color="#3b82f6" />
        <StatCard label="Confirmed"         value={confirmed}       icon="✅" color="#22c55e" />
        <StatCard label="Pending"           value={pending}         icon="⏳" color="#f59e0b" />
        <StatCard label="Revenue (£)"       value={`£${revenue.toLocaleString()}`} icon="💰" color="#22c55e" />
      </div>

      {/* Recent bookings */}
      <div className="card">
        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>
          Recent Bookings
        </h2>
        <table>
          <thead>
            <tr>
              <th>Guest</th>
              <th>Item</th>
              <th>Type</th>
              <th>Date</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recent.map(b => (
              <tr key={b.id}>
                <td>{b.userName}</td>
                <td>{b.itemName}</td>
                <td>{typeBadge(b.type)}</td>
                <td>{b.date}</td>
                <td>£{b.totalPrice.toLocaleString()}</td>
                <td>{statusBadge(b.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cancelled warning */}
      {cancelled > 0 && (
        <div style={{
          marginTop: '1rem',
          background: 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.2)',
          borderRadius: '8px',
          padding: '0.75rem 1rem',
          color: 'var(--danger)',
          fontSize: '0.82rem',
        }}>
          ⚠ {cancelled} booking{cancelled > 1 ? 's' : ''} cancelled — review in Bookings tab.
        </div>
      )}
    </div>
  )
}