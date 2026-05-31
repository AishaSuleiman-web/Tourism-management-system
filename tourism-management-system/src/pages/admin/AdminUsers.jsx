import { useState, useEffect } from "react"
import { supabase } from "../../config/supabaseClient"

function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Direct fetch from profiles
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      //console.log('Raw profiles data:', data)
      setUsers(data || [])
    } catch (err) {
      console.error('Error fetching users:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleAdminStatus = async (user) => {
    const newAdminStatus = !user.is_admin
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: newAdminStatus })
        .eq('id', user.id)

      if (error) throw error
      
      alert(`${user.name || 'User'} is now ${newAdminStatus ? 'an ADMIN' : 'a regular user'}`)
      fetchUsers()
    } catch (err) {
      alert('Error updating admin status: ' + err.message)
    }
  }

  const deleteUser = async (user) => {
    if (!confirm(`Delete ${user.name || 'User'}? Removes profile. Cannot undo.`)) {
      return
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id)

      if (error) throw error
      
      alert('User deleted successfully')
      fetchUsers()
    } catch (err) {
      alert('Error deleting user: ' + err.message)
    }
  }

  const filteredUsers = users.filter(user =>
    (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <div className="admin-loading">Loading users...</div>
  }

  if (error) {
    return (
      <div className="admin-error">
        Error: {error}
        <button onClick={fetchUsers} className="admin-retry-btn">Try Again</button>
      </div>
    )
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>User Management</h1>
          <p>Manage user roles and permissions</p>
        </div>
      </div>

      <div className="admin-search-bar">
        <input
          type="text"
          className="admin-search-input"
          placeholder="Search users by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="admin-table-card">
        <div className="admin-table-header">
          <h4>All Users ({filteredUsers.length})</h4>
        </div>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Joined</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="admin-user-info">
                      <div className="admin-user-avatar">
                        {user.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <div className="admin-user-name">{user.name || 'No name'}</div>
                        <div className="admin-user-id">ID: {user.id?.slice(0, 8)}...</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {user.is_admin ? (
                      <span className="admin-status-confirmed">Admin</span>
                    ) : (
                      <span className="admin-status-pending">User</span>
                    )}
                  </td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                  <td className="admin-actions">
                    <button className="admin-action-edit" onClick={() => toggleAdminStatus(user)} title={user.is_admin ? 'Remove admin' : 'Make admin'}>
                      <span className="material-symbols-outlined">{user.is_admin ? 'admin_panel_settings' : 'person_add'}</span>
                    </button>
                    <button className="admin-action-delete" onClick={() => deleteUser(user)} title="Delete user">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredUsers.length === 0 && (
        <div className="admin-empty-state">No users found</div>
      )}
    </div>
  )
}

export default AdminUsers