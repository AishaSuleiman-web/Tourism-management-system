import { useEffect, useState } from 'react'
import { getGuides, deleteGuide, addGuide } from '../utils/storage'
import type { Guide } from '../types'

const empty: Omit<Guide, 'id'> = {
  name: '', specialty: '', language: '',
  pricePerDay: 0, photo: '', description: '',
}

export default function Guides() {
  const [guides, setGuides]       = useState<Guide[]>([])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm]           = useState(empty)
  const [search, setSearch]       = useState('')

  useEffect(() => { setGuides(getGuides()) }, [])

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const guide: Guide = { ...form, id: `g${Date.now()}` }
    addGuide(guide)
    setGuides(getGuides())
    setForm(empty)
    setShowModal(false)
  }

  function handleDelete(id: string) {
    if (!confirm('Delete this guide?')) return
    deleteGuide(id)
    setGuides(getGuides())
  }

  const filtered = guides.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.specialty.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="page">
      <div className="page-header">
        <h1>Tour Guides</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Add Guide
        </button>
      </div>

      <input
        placeholder="Search guides..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ maxWidth: 300, marginBottom: '1.25rem' }}
      />

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Guide</th>
              <th>Specialty</th>
              <th>Language</th>
              <th>Price/Day</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: 'var(--muted)', padding: '2rem' }}>
                  No guides found.
                </td>
              </tr>
            ) : filtered.map(g => (
              <tr key={g.id}>
                <td style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {g.photo && (
                    <img
                      src={g.photo}
                      alt={g.name}
                      style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }}
                    />
                  )}
                  {g.name}
                </td>
                <td>{g.specialty}</td>
                <td>{g.language}</td>
                <td>£{g.pricePerDay}/day</td>
                <td>
                  <button className="btn btn-danger" onClick={() => handleDelete(g.id)}>
                    🗑 Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Add New Guide</h2>
            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div className="form-group">
                <label>Full Name</label>
                <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Specialty</label>
                <input required value={form.specialty} onChange={e => setForm({ ...form, specialty: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Language(s)</label>
                <input required value={form.language} onChange={e => setForm({ ...form, language: e.target.value })} placeholder="English, French" />
              </div>
              <div className="form-group">
                <label>Price Per Day (£)</label>
                <input type="number" required value={form.pricePerDay} onChange={e => setForm({ ...form, pricePerDay: Number(e.target.value) })} />
              </div>
              <div className="form-group">
                <label>Photo URL</label>
                <input value={form.photo} onChange={e => setForm({ ...form, photo: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Guide</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}