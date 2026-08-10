import React, { useEffect, useMemo, useState } from 'react'
import Sidebar from '../components/Sidebar'
import { listPoints, createPoint } from '../services/points'

const knownBearings = [
  { reference: '6203', dimensions: '17 x 40 x 12 mm', recommendedPulses: 6 },
  { reference: '6204', dimensions: '20 x 47 x 14 mm', recommendedPulses: 7 },
  { reference: '6205', dimensions: '25 x 52 x 15 mm', recommendedPulses: 8 },
  { reference: '6206', dimensions: '30 x 62 x 16 mm', recommendedPulses: 9 },
  { reference: '6305', dimensions: '25 x 62 x 17 mm', recommendedPulses: 8 },
  { reference: '6310', dimensions: '50 x 90 x 20 mm', recommendedPulses: 12 },
]

export default function Rodamientos(){
  const [points, setPoints] = useState<any[]>([])
  const [bearingRef, setBearingRef] = useState('')
  const [pulses, setPulses] = useState('')
  const [showNewPoint, setShowNewPoint] = useState(false)
  const [newPoint, setNewPoint] = useState({ AF: '', Maquina: '', Componente: '', Lubricante: '', Rodamiento: '', CantidadGramos: '' })
  const [newPointNote, setNewPointNote] = useState('')
  const [saveError, setSaveError] = useState('')
  const [saveSuccess, setSaveSuccess] = useState('')

  async function load(){
    const p = await listPoints()
    setPoints(p)
  }

  useEffect(() => { load() }, [])

  const normalizedRef = bearingRef.trim().toLowerCase()
  const selectedBearing = useMemo(
    () => knownBearings.find(b => b.reference.toLowerCase() === normalizedRef),
    [normalizedRef]
  )

  useEffect(() => {
    if (selectedBearing) {
      setPulses(String(selectedBearing.recommendedPulses))
    }
  }, [selectedBearing])

  const matchingPoints = useMemo(() => {
    if (!normalizedRef) return []
    return points.filter(point => point.Rodamiento?.toLowerCase().includes(normalizedRef))
  }, [normalizedRef, points])

  const pulseCount = selectedBearing ? selectedBearing.recommendedPulses : Number(pulses || 0)
  const greaseEstimate = Number((pulseCount * 0.8).toFixed(2))

  async function handleCopyResult() {
    try {
      await navigator.clipboard.writeText(`${greaseEstimate} g`)
      setSaveSuccess('Resultado copiado al portapapeles')
      setTimeout(() => setSaveSuccess(''), 2500)
    } catch (err) {
      setSaveError('No se pudo copiar el resultado')
    }
  }

  async function handleOpenNewPoint() {
    setSaveError('')
    setSaveSuccess('')
    const basePoint = matchingPoints[0]
    setNewPoint({
      AF: basePoint?.AF || basePoint?.asset?.AF || basePoint?.CodigoPunto || '',
      Maquina: basePoint?.Descripcion || '',
      Componente: basePoint?.Componente || '',
      Lubricante: basePoint?.Lubricante || '',
      Rodamiento: bearingRef,
      CantidadGramos: greaseEstimate.toString()
    })
    setNewPointNote(basePoint ? `Usando el punto ${basePoint.CodigoPunto || basePoint.AF || 'existente'} como base.` : '')
    setShowNewPoint(true)
  }

  async function handleUsePoint(point: any) {
    setSaveError('')
    setSaveSuccess('')
    setNewPoint({
      AF: point.AF || point.asset?.AF || point.CodigoPunto || '',
      Maquina: point.Descripcion || '',
      Componente: point.Componente || '',
      Lubricante: point.Lubricante || '',
      Rodamiento: point.Rodamiento || bearingRef,
      CantidadGramos: point.CantidadGramos ? String(point.CantidadGramos) : greaseEstimate.toString()
    })
    setNewPointNote(`Usando el punto ${point.CodigoPunto || point.AF || 'existente'} como base.`)
    setShowNewPoint(true)
  }

  async function handleCreatePoint() {
    setSaveError('')
    setSaveSuccess('')
    if (!newPoint.AF || !newPoint.Maquina || !newPoint.Componente || !newPoint.Lubricante || !newPoint.Rodamiento || !newPoint.CantidadGramos) {
      setSaveError('Todos los campos son obligatorios')
      return
    }
    try {
      await createPoint({
        CodigoPunto: newPoint.AF,
        AF: newPoint.AF,
        Descripcion: newPoint.Maquina,
        Componente: newPoint.Componente,
        Lubricante: newPoint.Lubricante,
        Rodamiento: newPoint.Rodamiento,
        CantidadGramos: Number(newPoint.CantidadGramos)
      })
      setSaveSuccess('Punto creado correctamente')
      setShowNewPoint(false)
      await load()
    } catch (err: any) {
      setSaveError(err?.response?.data?.message || err?.message || 'Error creando punto')
    }
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="content">
        <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Cálculo de grasa por rodamiento</h1>
            <p className="text-slate-400 mt-1">Consulta la grasa estimada según referencia y pulso.</p>
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr] mb-6">
          <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 shadow-xl">
            <div className="space-y-4">
              <div>
                <label className="form-label">Referencia de rodamiento</label>
                <input
                  value={bearingRef}
                  onChange={e => setBearingRef(e.target.value)}
                  placeholder="Ej: 6205"
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Pulsos estimados</label>
                <input
                  type="number"
                  min="0"
                  value={pulses}
                  onChange={e => setPulses(e.target.value)}
                  className="form-input"
                  disabled={Boolean(selectedBearing)}
                />
                {selectedBearing && <p className="text-sm text-slate-400 mt-2">Pulsos establecidos según la referencia del rodamiento.</p>}
              </div>
            </div>
          </div>
          <div className="metric-card">
            <h3 className="text-lg font-semibold text-white mb-3">Grasa estimada</h3>
            <div className="text-3xl font-bold text-white">{greaseEstimate} g</div>
            <p className="text-sm text-slate-400 mt-2">Asume 0.8 g por pulso de inyector.</p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button onClick={handleCopyResult} className="secondary-action w-full sm:w-auto">Copiar resultado</button>
              <button onClick={handleOpenNewPoint} className="primary-action w-full sm:w-auto">Guardar como punto</button>
            </div>
            {saveSuccess && <div className="mt-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/20 p-3 text-emerald-200">{saveSuccess}</div>}
            {saveError && <div className="mt-3 rounded-2xl bg-red-950/60 border border-red-500/20 p-3 text-red-200">{saveError}</div>}
          </div>
        </div>

        {bearingRef && (
          <>
            <div className="grid gap-4 mb-6 xl:grid-cols-2">
              <div className="metric-card text-center">
                <h3 className="text-lg font-semibold text-white mb-3">Detalles de la referencia</h3>
                {selectedBearing ? (
                  <div className="space-y-3 text-slate-200">
                    <div className="text-base">Referencia: <span className="font-semibold text-white">{selectedBearing.reference}</span></div>
                    <div className="text-base">Dimensiones: <span className="font-semibold text-white">{selectedBearing.dimensions}</span></div>
                    <div className="text-base">Pulsos estándar: <span className="font-semibold text-white">{selectedBearing.recommendedPulses}</span></div>
                    <div className="text-base">Grasa estándar: <span className="font-semibold text-white">{(selectedBearing.recommendedPulses * 0.8).toFixed(2)} g</span></div>
                  </div>
                ) : (
                  <div className="text-slate-300">Referencia no reconocida en los datos de ejemplo.</div>
                )}
              </div>
              <div className="metric-card text-center">
                <h3 className="text-lg font-semibold text-white mb-3">Puntos relacionados</h3>
                <div className="text-3xl font-bold text-white">{matchingPoints.length}</div>
                <p className="text-sm text-slate-400 mt-2">Puntos de lubricación con esta referencia</p>
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 shadow-xl">
              <h3 className="text-lg font-semibold text-white mb-4">Puntos que contienen esta referencia</h3>
              {matchingPoints.length ? (
                <div className="grid gap-4">
                  {matchingPoints.map(point => (
                    <div key={point.id} className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
                      <div className="text-sm text-slate-400">AF: {point.asset?.AF || point.AF || point.CodigoPunto}</div>
                      <div className="text-sm text-slate-100">Máquina: {point.Descripcion || 'N/A'}</div>
                      <div className="text-sm text-slate-100">Componente: {point.Componente || 'N/A'}</div>
                      <div className="text-sm text-slate-100">Lubricante: {point.Lubricante || 'N/A'}</div>
                      <div className="text-sm text-slate-100">Rodamiento: {point.Rodamiento || 'N/A'}</div>
                      <div className="text-sm text-slate-100">Cantidad grasa: {point.CantidadGramos ?? 'N/A'} g</div>
                      <button
                        onClick={() => handleUsePoint(point)}
                        className="mt-3 rounded-2xl bg-indigo-500 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
                      >
                        Usar como base
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-slate-300">No se encontraron puntos con esta referencia.</div>
              )}
            </div>
          </>
        )}

        {showNewPoint && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8">
            <div className="w-full max-w-2xl rounded-[32px] border border-white/10 bg-slate-950/95 p-6 shadow-2xl shadow-slate-950/60 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-6 gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">Guardar rodamiento como punto</h2>
                  <p className="text-sm text-slate-400">Completa los datos y guarda el punto en el sistema.</p>
                </div>
                <button onClick={() => { setShowNewPoint(false); setSaveError(''); setSaveSuccess('') }} className="rounded-full border border-white/10 px-4 py-2 text-sm text-white hover:bg-white/5">Cerrar</button>
              </div>
              <div className="grid gap-4">
                <div>
                  <label className="form-label">AF</label>
                  <input
                    value={newPoint.AF}
                    onChange={e => setNewPoint({ ...newPoint, AF: e.target.value })}
                    className="form-input"
                    placeholder="Código AF"
                  />
                </div>
                <div>
                  <label className="form-label">Máquina</label>
                  <input
                    value={newPoint.Maquina}
                    onChange={e => setNewPoint({ ...newPoint, Maquina: e.target.value })}
                    className="form-input"
                    placeholder="Nombre de la máquina"
                  />
                </div>
                <div>
                  <label className="form-label">Componente</label>
                  <input
                    value={newPoint.Componente}
                    onChange={e => setNewPoint({ ...newPoint, Componente: e.target.value })}
                    className="form-input"
                    placeholder="Componente"
                  />
                </div>
                <div>
                  <label className="form-label">Lubricante</label>
                  <input
                    value={newPoint.Lubricante}
                    onChange={e => setNewPoint({ ...newPoint, Lubricante: e.target.value })}
                    className="form-input"
                    placeholder="Lubricante"
                  />
                </div>
                <div>
                  <label className="form-label">Rodamiento</label>
                  <input
                    value={newPoint.Rodamiento}
                    onChange={e => setNewPoint({ ...newPoint, Rodamiento: e.target.value })}
                    className="form-input"
                    placeholder="Referencia del rodamiento"
                  />
                </div>
                {newPointNote && (
                  <div className="rounded-2xl border border-amber-500/30 bg-amber-950/50 p-3 text-sm text-amber-200">
                    {newPointNote}
                  </div>
                )}
                <div>
                  <label className="form-label">Cantidad grasa (g)</label>
                  <input
                    type="number"
                    min="0"
                    value={newPoint.CantidadGramos}
                    onChange={e => setNewPoint({ ...newPoint, CantidadGramos: e.target.value })}
                    className="form-input"
                    placeholder="Cantidad en gramos"
                  />
                </div>
                {saveError && <div className="rounded-2xl bg-red-950/60 border border-red-500/20 p-3 text-red-200">{saveError}</div>}
                <div className="flex justify-end gap-3">
                  <button onClick={() => { setShowNewPoint(false); setSaveError(''); setSaveSuccess(''); setNewPointNote('') }} className="secondary-action">Cancelar</button>
                  <button onClick={handleCreatePoint} className="primary-action">Guardar punto</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
