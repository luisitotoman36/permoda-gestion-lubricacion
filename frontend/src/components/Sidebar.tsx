import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { logout, getUser } from '../services/auth'

export default function Sidebar(){
  const nav = useNavigate()
  const [user, setUser] = React.useState(() => getUser())
  const [dark, setDark] = React.useState<boolean>(() => document.documentElement.classList.contains('dark'))
  function toggleDark(){
    setDark(v => { const nv = !v; if(nv) document.documentElement.classList.add('dark'); else document.documentElement.classList.remove('dark'); return nv });
  }
  return (
    <aside className="sidebar" aria-label="Main navigation">
      <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-xl shadow-[0_20px_60px_-30px_rgba(0,0,0,0.8)]">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-sm font-bold text-cyan-200 flex-shrink-0">P</div>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-white truncate">PERMODA</h2>
            <div className="text-xs text-slate-300 truncate">{user?.fullName || user?.email}</div>
          </div>
        </div>
        <div className="mt-3 rounded-lg bg-slate-950/60 p-2 text-xs uppercase tracking-[0.15em] text-cyan-200 text-center">{`${(user?.fullName || user?.email?.split('@')[0] || 'Usuario').substring(0, 10)}`}</div>
      </div>
      <nav className="flex flex-col gap-1" role="navigation">
        <Link to="/" className="rounded-xl px-3 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/10">Dashboard</Link>
        <Link to="/activos" className="rounded-xl px-3 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/10">Activos</Link>
        <Link to="/puntos" className="rounded-xl px-3 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/10">Puntos</Link>
        <Link to="/lubricantes" className="rounded-xl px-3 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/10">Lubricantes</Link>
        <Link to="/rodamientos" className="rounded-xl px-3 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/10">Rodamientos</Link>
        <Link to="/ordenes" className="rounded-xl px-3 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/10">Órdenes</Link>
        <Link to="/usuarios" className="rounded-xl px-3 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/10">Usuarios</Link>
      </nav>
      <div className="mt-auto pt-6 flex flex-col gap-2">
        <button onClick={() => { logout(); nav('/login'); }} className="w-full rounded-xl bg-red-600 px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-red-700/20 transition hover:bg-red-500">Cerrar sesión</button>
        <button onClick={toggleDark} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white transition hover:bg-white/10">{dark ? '☀️' : '🌙'}</button>
      </div>
    </aside>
  )
}
