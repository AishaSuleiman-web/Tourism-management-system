import { useEffect, useState } from 'react'
import { getPackages, deletePackage, addPackage } from '../utils/storage'
import type { Package } from '../types'

const empty: Omit<Package, 'id'> = {
  destination: '', duration: '', price: 0,
  inclusions: [], image: '', description: '',
}

export default function Packages() {
  const [packages, setPackages]   = useState<Package[]>([])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm]           = useState(empty)
  const [search, setSearch]       = useState('')

  useEffect(() => { setPackages(getPackages()) }, [])

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const pkg: Package = {
      ...form,
      id: `p${Date.now()}`,
      inclusions: typeof form.inclusions === 'string'
        ? (form.inclusions as unknown as string).split(',').map(s => s.trim())
        : form.inclusions,
    }
    addPackage(pkg)
    setPackages(getPackages())
    setForm(empty)
    setShowModal(false)
  }

  function handleDelete(id: string) {
    if (!confirm('Delete this package?')) return
    deletePackage(id)
    setPackages(getPackages())
  }

  const filtered = packages.filter(p =>
    p.destination.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="page">
      <div className="page-header">
        <h1>Travel Packages</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Add Package
        </button>
      </div>

      <input
        placeholder="Search packages..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ maxWidth: 300, marginBottom: '1.25rem' }}
      />

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Destination</th>
              <th>Duration</th>
              <th>Price</th>
              <th>Inclusions</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: 'var(--muted)', padding: '2rem' }}>
                  No packages found.
                </td>
              </tr>
            ) : filtered.map(p => (
              <tr key={p.id}>
                <td style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {p.image && (
                    <img
                      src={p.image}
                      alt={p.destination}
                      style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover' }}
                    />
                  )}
                  {p.destination}
                </td>
                <td>{p.duration}</td>
                <td>£{p.price.toLocaleString()}</td>
                <td style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
                  {p.inclusions.join(' · ')}
                </td>
                <td>
                  <button className="btn btn-danger" onClick={() => handleDelete(p.id)}>
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
            <h2>Add New Package</h2>
            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div className="form-group">
                <label>Destination</label>
                <input required value={form.destination} onChange={e => setForm({ ...form, destination: e.target.value })} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label>Duration</label>
                  <input required value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} placeholder="7 days" />
                </div>
                <div className="form-group">
                  <label>Price (£)</label>
                  <input type="number" required value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} />
                </div>
              </div>
              <div className="form-group">
                <label>Inclusions (comma separated)</label>
                <input
                  value={Array.isArray(form.inclusions) ? form.inclusions.join(', ') : form.inclusions}
                  onChange={e => setForm({ ...form, inclusions: e.target.value as unknown as string[] })}
                  placeholder="Flights, Hotels, Meals"
                />
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Package</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}