import React, { useState } from 'react'
import { register } from '../services/auth'
import Sidebar from '../components/Sidebar'

export default function Usuarios() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [roleName, setRoleName] = useState('Lubricador')
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Error creando usuario'
      setError(message)
    } finally {
      setLoading(false)
    }
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
      </main>
    </div>
  )
}
