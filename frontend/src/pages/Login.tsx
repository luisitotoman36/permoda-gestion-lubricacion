import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../services/auth'
import logo from '../assets/logo.svg'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const nav = useNavigate()

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberEmail')
    if (savedEmail) {
      setEmail(savedEmail)
      setRemember(true)
    }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      await login(email, password)
      if (remember) {
        localStorage.setItem('rememberEmail', email)
      } else {
        localStorage.removeItem('rememberEmail')
      }
      nav('/')
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Error de inicio de sesión'
      setError(message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-login-gradient text-white px-4">
      <div className="relative w-full max-w-md">
        <div className="overflow-visible rounded-[36px] border border-white/10 bg-slate-950/90 p-8 pt-24 shadow-[0_40px_100px_-60px_rgba(0,0,0,0.8)] backdrop-blur-xl">
          <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2">
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-slate-900/60 ring-2 ring-cyan-400/30 shadow-lg shadow-cyan-500/20 animate-zoom-in">
              <img src={logo} alt="PERMODA" className="h-24 w-24" />
            </div>
          </div>
          <h1 className="text-center text-3xl font-bold tracking-[0.18em] mb-6 text-cyan-200">PERMODA</h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-slate-200 mb-2">Email</label>
              <div className="relative rounded-xl bg-slate-950/20 border border-white/10 p-2">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">📧</span>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-transparent pl-10 text-white placeholder:text-slate-500 outline-none"
                  placeholder="admin@permoda.local"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-200 mb-2">Contraseña</label>
              <div className="relative rounded-xl bg-slate-950/20 border border-white/10 p-2">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔒</span>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-transparent pl-10 text-white placeholder:text-slate-500 outline-none"
                  placeholder="Contraseña"
                  required
                />
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-300">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-500 bg-slate-900 text-blue-500"
                />
                Recordarme
              </label>
              <Link to="/forgot-password" className="text-slate-200 hover:text-white">Restablecer contraseña</Link>
            </div>
            {error && <div className="rounded-xl bg-red-500/15 p-3 text-red-200">{error}</div>}
            <button type="submit" className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-base font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-500">
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
