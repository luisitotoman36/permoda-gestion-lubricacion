import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import { listPoints, createPoint, deletePoint } from '../services/points'
import { getUser } from '../services/auth'
import ConfirmDialog from '../components/ConfirmDialog'

export default function Points(){
  const [items, setItems] = useState<any[]>([])
  const [showNew, setShowNew] = useState(false)
  const [newPoint, setNewPoint] = useState({ AF: '', Maquina: '', Componente: '', Lubricante: '', Rodamiento: '', CantidadGramos: '' })
  const [error, setError] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  const isAdmin = getUser()?.role === 'Administrador'

  async function load(){
    const r = await listPoints()
    setItems(r)
  }

  async function handleDelete(id: string) {
    setPendingDeleteId(id)
    setConfirmOpen(true)
  }

  async function confirmDelete() {
    if (!pendingDeleteId) return
    await deletePoint(pendingDeleteId)
    setConfirmOpen(false)
    setPendingDeleteId(null)
    await load()
  }
  useEffect(()=>{ load() }, [])

  async function handleCreatePoint() {
    setError('')
    if (!newPoint.AF || !newPoint.Maquina || !newPoint.Componente || !newPoint.Lubricante || !newPoint.Rodamiento || !newPoint.CantidadGramos) {
      setError('Todos los campos son obligatorios')
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
      setNewPoint({ AF: '', Maquina: '', Componente: '', Lubricante: '', Rodamiento: '', CantidadGramos: '' })
      setShowNew(false)
      await load()
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Error creando punto')
    }
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="content">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Puntos de Lubricación</h1>
            <p className="text-slate-400">Registra puntos con AF, máquina, componente y lubricante.</p>
          </div>
          <button onClick={() => setShowNew(true)} className="primary-action">+ Agregar punto</button>
        </div>
        <div className="table-card">
          <table className="w-full">
            <thead>
              <tr>
                <th className="p-2">AF</th>
                <th className="p-2">Máquina</th>
                <th className="p-2">Componente</th>
                <th className="p-2">Lubricante</th>
                <th className="p-2">Rodamiento</th>
                <th className="p-2">Cantidad grasa</th>
              </tr>
            </thead>
            <tbody>
              {items.map(i=> (
                <tr key={i.id} className="border-t">
                  <td className="p-2">{i.AF || i.CodigoPunto}</td>
                  <td className="p-2">{i.Descripcion}</td>
                  <td className="p-2">{i.Componente}</td>
                  <td className="p-2">{i.Lubricante}</td>
                  <td className="p-2">{i.Rodamiento}</td>
                  <td className="p-2">{i.CantidadGramos}</td>
                  <td className="p-2">
                    {isAdmin && (
                      <button onClick={() => handleDelete(i.id)} className="danger-action">
                        Eliminar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showNew && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8">
            <div className="w-full max-w-2xl rounded-[32px] border border-white/10 bg-slate-950/95 p-6 shadow-2xl shadow-slate-950/60 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">Agregar punto de lubricación</h2>
                  <p className="text-sm text-slate-400">Ingresa AF, máquina, componente y lubricante.</p>
                </div>
                <button onClick={() => { setShowNew(false); setError('') }} className="rounded-full border border-white/10 px-4 py-2 text-sm text-white hover:bg-white/5">Cerrar</button>
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
                    placeholder="Referencia de rodamiento"
                  />
                </div>
                <div>
                  <label className="form-label">Cantidad grasa</label>
                  <input
                    type="number"
                    min="0"
                    value={newPoint.CantidadGramos}
                    onChange={e => setNewPoint({ ...newPoint, CantidadGramos: e.target.value })}
                    className="form-input"
                    placeholder="Cantidad en gramos"
                  />
                </div>
                {error && <div className="rounded-2xl bg-red-950/60 border border-red-500/20 p-3 text-red-200">{error}</div>}
                <div className="flex justify-end gap-3">
                  <button onClick={() => { setShowNew(false); setError('') }} className="secondary-action">Cancelar</button>
                  <button onClick={handleCreatePoint} className="primary-action">Guardar punto</button>
                </div>
              </div>
            </div>
          </div>
        )}

        <ConfirmDialog
          open={confirmOpen}
          title="Eliminar punto"
          message="¿Seguro que quieres eliminar este punto de lubricación?"
          confirmLabel="Eliminar"
          onConfirm={confirmDelete}
          onCancel={() => {
            setConfirmOpen(false)
            setPendingDeleteId(null)
          }}
        />
      </main>
    </div>
  )
}
