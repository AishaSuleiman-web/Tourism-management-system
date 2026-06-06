import { useEffect, useState } from 'react'
import { getHotels, deleteHotel, addHotel } from '../utils/storage'
import type { Hotel } from '../types'

const empty: Omit<Hotel, 'id'> = {
  name: '', location: '', pricePerNight: 0,
  rating: 5, image: '', description: '', amenities: [],
}

export default function Hotels() {
  const [hotels, setHotels]     = useState<Hotel[]>([])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm]          = useState(empty)
  const [search, setSearch]      = useState('')

  useEffect(() => { setHotels(getHotels()) }, [])

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const hotel: Hotel = {
      ...form,
      id: `h${Date.now()}`,
      amenities: typeof form.amenities === 'string'
        ? (form.amenities as unknown as string).split(',').map(s => s.trim())
        : form.amenities,
    }
    addHotel(hotel)
    setHotels(getHotels())
    setForm(empty)
    setShowModal(false)
  }

  function handleDelete(id: string) {
    if (!confirm('Delete this hotel?')) return
    deleteHotel(id)
    setHotels(getHotels())
  }

  const filtered = hotels.filter(h =>
    h.name.toLowerCase().includes(search.toLowerCase()) ||
    h.location.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="page">
      <div className="page-header">
        <h1>Hotels</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Add Hotel
        </button>
      </div>

      <input
        placeholder="Search hotels..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ maxWidth: 300, marginBottom: '1.25rem' }}
      />

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
              <th>Price/Night</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: 'var(--muted)', padding: '2rem' }}>
                  No hotels found.
                </td>
              </tr>
            ) : filtered.map(h => (
              <tr key={h.id}>
                <td style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {h.image && (
                    <img
                      src={h.image}
                      alt={h.name}
                      style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover' }}
                    />
                  )}
                  {h.name}
                </td>
                <td>{h.location}</td>
                <td>£{h.pricePerNight}/night</td>
                <td>⭐ {h.rating}</td>
                <td>
                  <button className="btn btn-danger" onClick={() => handleDelete(h.id)}>
                    🗑 Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Hotel Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Add New Hotel</h2>
            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div className="form-group">
                <label>Name</label>
                <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input required value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label>Price/Night (£)</label>
                  <input type="number" required value={form.pricePerNight} onChange={e => setForm({ ...form, pricePerNight: Number(e.target.value) })} />
                </div>
                <div className="form-group">
                  <label>Rating (1-5)</label>
                  <input type="number" min={1} max={5} step={0.1} required value={form.rating} onChange={e => setForm({ ...form, rating: Number(e.target.value) })} />
                </div>
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Amenities (comma separated)</label>
                <input
                  value={Array.isArray(form.amenities) ? form.amenities.join(', ') : form.amenities}
                  onChange={e => setForm({ ...form, amenities: e.target.value as unknown as string[] })}
                  placeholder="WiFi, Pool, Spa"
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Hotel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}