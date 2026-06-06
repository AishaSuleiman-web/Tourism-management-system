import { useEffect, useState } from 'react'
import { getBookings, deleteBooking } from '../utils/storage'
import type { Booking } from '../types'

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filter, setFilter] = useState<'all' | 'hotel' | 'guide' | 'package'>('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    setBookings(getBookings())
  }, [])

  function handleDelete(id: string) {
    if (!confirm('Delete this booking?')) return
    deleteBooking(id)
    setBookings(getBookings())
  }

  const filtered = bookings
    .filter(b => filter === 'all' || b.type === filter)
    .filter(b =>
      b.userName.toLowerCase().includes(search.toLowerCase()) ||
      b.itemName.toLowerCase().includes(search.toLowerCase())
    )

  function statusBadge(status: string) {
    if (status === 'confirmed') return <span className="badge badge-green">{status}</span>
    if (status === 'pending')   return <span className="badge badge-yellow">{status}</span>
    return <span className="badge badge-red">{status}</span>
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Bookings</h1>
        <span style={{ color: 'var(--muted)' }}>{filtered.length} records</span>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <input
          placeholder="Search guest or item..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 260 }}
        />
        {(['all', 'hotel', 'guide', 'package'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`btn ${filter === f ? 'btn-primary' : 'btn-ghost'}`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Guest</th>
              <th>Item</th>
              <th>Type</th>
              <th>Date</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', color: 'var(--muted)', padding: '2rem' }}>
                  No bookings found.
                </td>
              </tr>
            ) : filtered.map(b => (
              <tr key={b.id}>
                <td>{b.userName}</td>
                <td>{b.itemName}</td>
                <td><span className="badge badge-blue">{b.type}</span></td>
                <td>{b.date}</td>
                <td>£{b.totalPrice.toLocaleString()}</td>
                <td>{statusBadge(b.status)}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(b.id)}
                  >
                    🗑 Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}