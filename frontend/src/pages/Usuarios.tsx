import React, { useEffect, useState } from 'react'
import { deleteUser as deleteUserService, getUser, listUsers, register, toggleUserStatus } from '../services/auth'
import Sidebar from '../components/Sidebar'
import ConfirmDialog from '../components/ConfirmDialog'

type UserRow = {
  id: string
  email: string
  fullName: string
  role: string
  active: boolean
}

export default function Usuarios() {
  const currentUser = getUser()
  const isAdmin = currentUser?.role === 'Administrador'

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [roleName, setRoleName] = useState('Lubricador')
  const [users, setUsers] = useState<UserRow[]>([])
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  async function loadUsers() {
    if (!isAdmin) return
    const rows = await listUsers()
    setUsers(rows)
  }

  useEffect(() => {
    if (isAdmin) {
      loadUsers()
    }
  }, [isAdmin])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      await register({ email, password, fullName, roleName })
      setSuccess('Usuario creado correctamente')
      setEmail('')
      setPassword('')
      setFullName('')
      setRoleName('Lubricador')
      await loadUsers()
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Error creando usuario'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  async function handleToggleUser(id: string, currentActive: boolean) {
    try {
      const result = await toggleUserStatus(id)
      setUsers(prev => prev.map(user => user.id === id ? { ...user, active: result.active } : user))
      setSuccess(currentActive ? 'Usuario bloqueado correctamente' : 'Usuario activado correctamente')
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'No se pudo cambiar el estado'
      setError(message)
    }
  }

  async function handleDeleteUser(id: string) {
    setPendingDeleteId(id)
    setConfirmOpen(true)
  }

  async function confirmDeleteUser() {
    if (!pendingDeleteId) return
    try {
      await deleteUserService(pendingDeleteId)
      setUsers(prev => prev.filter(user => user.id !== pendingDeleteId))
      setSuccess('Usuario eliminado correctamente')
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'No se pudo eliminar el usuario'
      setError(message)
    } finally {
      setConfirmOpen(false)
      setPendingDeleteId(null)
    }
  }

  if (!isAdmin) {
    return (
      <div className="app-shell">
        <Sidebar />
        <main className="content">
          <div className="rounded-[32px] border border-red-500/20 bg-red-950/30 p-8 text-red-100">
            <h1 className="text-3xl font-bold mb-2">Acceso restringido</h1>
            <p>Solo el administrador puede crear y gestionar usuarios del sistema.</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="content">
        <div className="mb-8 rounded-[32px] border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-slate-900/30 backdrop-blur-xl">
          <h1 className="text-3xl font-bold text-white mb-2">Usuarios</h1>
          <p className="text-slate-400 mb-6">Crea cuentas de usuario con contraseña y rol para acceso al sistema.</p>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div>
              <label className="form-label">Nombre completo</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="form-input"
                placeholder="Nombre completo"
                required
              />
            </div>
            <div>
              <label className="form-label">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="form-input"
                placeholder="usuario@empresa.local"
                required
              />
            </div>
            <div>
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="form-input"
                placeholder="Contraseña segura"
                required
              />
            </div>
            <div>
              <label className="form-label">Rol</label>
              <select
                value={roleName}
                onChange={e => setRoleName(e.target.value)}
                className="form-input text-white bg-slate-900/90"
              >
                <option className="text-slate-900" value="Lubricador">Lubricador</option>
                <option className="text-slate-900" value="Administrador">Administrador</option>
              </select>
            </div>
            {error && <div className="error-card text-red-100">{error}</div>}
            {success && <div className="metric-card text-green-200">{success}</div>}
            <button type="submit" disabled={loading} className="primary-action">
              {loading ? 'Creando usuario...' : 'Crear usuario'}
            </button>
          </form>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-slate-900/30 backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Usuarios registrados</h2>
            <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-sm text-cyan-200">{users.length}</span>
          </div>

          <div className="table-card">
            <table className="w-full">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-slate-400">No hay usuarios registrados.</td>
                  </tr>
                ) : users.map(user => (
                  <tr key={user.id}>
                    <td>{user.fullName}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{user.active ? 'Activo' : 'Bloqueado'}</td>
                    <td>
                      <div className="flex gap-2">
                        <button onClick={() => handleToggleUser(user.id, user.active)} className="secondary-action text-xs px-3 py-2">
                          {user.active ? 'Bloquear' : 'Activar'}
                        </button>
                        <button onClick={() => handleDeleteUser(user.id)} className="danger-action">
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <ConfirmDialog
          open={confirmOpen}
          title="Eliminar usuario"
          message="¿Seguro que quieres eliminar este usuario? Esta acción no se puede deshacer."
          confirmLabel="Eliminar"
          onConfirm={confirmDeleteUser}
          onCancel={() => {
            setConfirmOpen(false)
            setPendingDeleteId(null)
          }}
        />
      </main>
    </div>
  )
}
