import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    setError(null)
    try {
      const r = await api.post('/auth/request-reset', { email })
      setMessage('Token de recuperación generado. Guarda el token o úsa la función de reset.')
      console.log('Reset token:', r.data.resetToken)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al solicitar recuperación')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-800 to-gray-900 text-white px-4">
      <div className="w-full max-w-md rounded-[32px] border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
        <h1 className="text-2xl font-semibold mb-4 text-center">Restablecer contraseña</h1>
        <p className="text-sm text-slate-300 mb-6">Ingresa tu email para recibir el token de recuperación.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-200 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950/20 p-3 text-white outline-none placeholder:text-slate-500"
              placeholder="admin@permoda.local"
              required
            />
          </div>
          {error && <div className="rounded-xl bg-red-500/10 px-3 py-2 text-red-200">{error}</div>}
          {message && <div className="rounded-xl bg-emerald-500/10 px-3 py-2 text-emerald-200">{message}</div>}
          <button className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-white transition hover:bg-blue-500">Solicitar token</button>
        </form>
        <div className="mt-4 text-center text-sm text-slate-300">
          <Link to="/login" className="text-white hover:underline">Volver al login</Link>
        </div>
      </div>
    </div>
  )
}
