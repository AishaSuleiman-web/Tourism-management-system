import { useEffect, useState } from 'react'
import { getUsers, deleteUser } from '../utils/storage'
import type { User } from '../types'

export default function Users() {
  const [users, setUsers]   = useState<User[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => { setUsers(getUsers()) }, [])

  function handleDelete(id: string, role: string) {
    if (role === 'admin') {
      alert('Cannot delete admin account.')
      return
    }
    if (!confirm('Delete this user?')) return
    deleteUser(id)
    setUsers(getUsers())
  }

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="page">
      <div className="page-header">
        <h1>Users</h1>
        <span style={{ color: 'var(--muted)' }}>{filtered.length} accounts</span>
      </div>

      <input
        placeholder="Search users..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ maxWidth: 300, marginBottom: '1.25rem' }}
      />

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: 'var(--muted)', padding: '2rem' }}>
                  No users found.
                </td>
              </tr>
            ) : filtered.map(u => (
              <tr key={u.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{
                      width: 32, height: 32,
                      borderRadius: '50%',
                      background: u.role === 'admin' ? 'rgba(59,130,246,0.2)' : 'rgba(148,163,184,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.8rem', fontWeight: 700,
                      color: u.role === 'admin' ? 'var(--accent2)' : 'var(--muted)',
                      flexShrink: 0,
                    }}>
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    {u.name}
                  </div>
                </td>
                <td style={{ color: 'var(--muted)' }}>{u.email}</td>
                <td>
                  <span className={`badge ${u.role === 'admin' ? 'badge-blue' : 'badge-green'}`}>
                    {u.role}
                  </span>
                </td>
                <td style={{ color: 'var(--muted)' }}>{u.createdAt}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(u.id, u.role)}
                    disabled={u.role === 'admin'}
                    style={{ opacity: u.role === 'admin' ? 0.4 : 1 }}
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