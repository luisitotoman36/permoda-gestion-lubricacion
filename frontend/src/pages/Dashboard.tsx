import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import api from '../services/api'
import { BarChart, DonutChart, LineChart } from '../components/Charts'

export default function Dashboard(){
  const [metrics, setMetrics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  // load(initial = true) will show full loading UI only on initial load or explicit retry
  const load = useCallback(async (initial = false) => {
    if (initial) {
      setLoading(true)
    }
    setError(null)
    try {
      const r = await api.get('/dashboard/metrics')
      const newData = r.data
      setMetrics(prev => {
        try {
          const a = JSON.stringify(prev)
          const b = JSON.stringify(newData)
          if (a === b) return prev
        } catch (e) {
          // ignore stringify errors
        }
        return newData
      })
    } catch (err: any) {
      console.error('Error loading metrics', err)
      setError(err.response?.data?.message || 'Error cargando métricas')
    } finally {
      if (initial) setLoading(false)
    }
  }, [])

  useEffect(() => {
    // initial load should show full loading state
    load(true)
    // periodic refreshes should not show the full loading UI
    const interval = window.setInterval(() => load(false), 5000)
    const onFocus = () => load(false)
    window.addEventListener('focus', onFocus)
    return () => {
      window.clearInterval(interval)
      window.removeEventListener('focus', onFocus)
    }
  }, [load])

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="content">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between mb-8">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-cyan-300/70 mb-2">Resumen de lubricación</p>
            <h1 className="text-4xl font-bold text-white">Dashboard</h1>
            <p className="max-w-xl text-sm text-slate-400 mt-2">Estado de equipos, órdenes y consumos en una sola vista.</p>
          </div>
          <button onClick={() => navigate('/activos')} className="primary-action">+ Crear activo</button>
        </div>
        {loading ? (
          <div className="metric-card">Cargando métricas...</div>
        ) : error ? (
          <div className="error-card">
            <div className="text-lg font-semibold text-red-200 mb-3">Error cargando métricas</div>
            <div className="text-sm text-red-100 mb-4">{error}</div>
            <button onClick={load} className="secondary-action">Reintentar</button>
          </div>
        ) : metrics ? (
          <>
            <div className="grid gap-4 xl:grid-cols-4 mb-6">
              <div className="metric-card">
                <div className="metric-label">Total equipos</div>
                <div className="metric-value">{metrics.totalAssets}</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Equipos críticos</div>
                <div className="metric-value">{metrics.criticalAssets}</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Lubricaciones pendientes</div>
                <div className="metric-value">{metrics.pendingLub}</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Órdenes abiertas</div>
                <div className="metric-value">{metrics.openOTs}</div>
              </div>
            </div>
            <div className="grid gap-6 xl:grid-cols-3 mb-6">
              <div className="chart-card xl:col-span-2">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">Consumo por lubricante</h2>
                  <span className="text-xs uppercase tracking-[0.24em] text-slate-400">Últimos datos</span>
                </div>
                <DonutChart labels={metrics.consumoByLub.map((x:any)=>x.lub||'N/A')} data={metrics.consumoByLub.map((x:any)=>Number(x.consumo)||0)} />
              </div>
              <div className="chart-card">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">Consumo por área</h2>
                  <span className="text-xs uppercase tracking-[0.24em] text-slate-400">Base histórica</span>
                </div>
                <BarChart labels={metrics.consumoByArea.map((x:any)=>x.area||'N/A')} data={metrics.consumoByArea.map((x:any)=>Number(x.consumo)||0)} />
              </div>
            </div>
            <div className="chart-card">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Pulsos ejecutados</h2>
                <span className="text-xs uppercase tracking-[0.24em] text-slate-400">Total</span>
              </div>
              <LineChart labels={[new Date().toLocaleDateString()]} data={[metrics.totalPulses]} />
            </div>
          </>
        ) : (
          <div className="metric-card">No hay métricas disponibles</div>
        )}
      </main>
    </div>
  )
}
