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
      <button aria-label="Toggle menu" className="md:hidden mb-4 p-3 rounded-full bg-white/10 text-white shadow-lg shadow-black/20" onClick={() => { document.documentElement.classList.toggle('sidebar-open') }}>
        ☰
      </button>
      <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl shadow-[0_20px_60px_-30px_rgba(0,0,0,0.8)]">
        <div className="flex items-center gap-3">
          <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center text-xl font-bold text-cyan-200">P</div>
          <div>
            <h2 className="text-xl font-semibold text-white">PERMODA</h2>
            <div className="text-sm text-slate-300">{user?.fullName || user?.email}</div>
          </div>
        </div>
        <div className="mt-4 rounded-2xl bg-slate-950/60 p-3 text-xs uppercase tracking-[0.2em] text-cyan-200">{`${user?.fullName || user?.email?.split('@')[0] || 'Usuario'} Permoda`}</div>
      </div>
      <nav className="space-y-3" role="navigation">
        <Link to="/" className="block rounded-3xl px-4 py-3 text-sm font-medium text-slate-100 transition hover:bg-white/10">Dashboard</Link>
        <Link to="/activos" className="block rounded-3xl px-4 py-3 text-sm font-medium text-slate-100 transition hover:bg-white/10">Activos</Link>
        <Link to="/puntos" className="block rounded-3xl px-4 py-3 text-sm font-medium text-slate-100 transition hover:bg-white/10">Puntos</Link>
        <Link to="/lubricantes" className="block rounded-3xl px-4 py-3 text-sm font-medium text-slate-100 transition hover:bg-white/10">Lubricantes</Link>
        <Link to="/rodamientos" className="block rounded-3xl px-4 py-3 text-sm font-medium text-slate-100 transition hover:bg-white/10">Rodamientos</Link>
        <Link to="/ordenes" className="block rounded-3xl px-4 py-3 text-sm font-medium text-slate-100 transition hover:bg-white/10">Órdenes</Link>
        <Link to="/usuarios" className="block rounded-3xl px-4 py-3 text-sm font-medium text-slate-100 transition hover:bg-white/10">Usuarios</Link>
      </nav>
      <div className="mt-auto space-y-3 pt-6">
        <button onClick={() => { logout(); nav('/login'); }} className="w-full rounded-3xl bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-red-700/20 transition hover:bg-red-500">Cerrar sesión</button>
        <button onClick={toggleDark} className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10">{dark ? 'Modo claro' : 'Modo oscuro'}</button>
      </div>
    </aside>
  )
}
