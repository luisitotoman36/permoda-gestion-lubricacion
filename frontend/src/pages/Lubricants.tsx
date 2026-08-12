import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import { listLubricants, createLubricant, deleteLubricant } from '../services/lubricants'
import { getUser } from '../services/auth'
import ConfirmDialog from '../components/ConfirmDialog'

export default function Lubricants(){
  const [items, setItems] = useState<any[]>([])
  const [showNew, setShowNew] = useState(false)
  const [newLub, setNewLub] = useState({ Codigo: '', Nombre: '', Referencia: '', Tipo: '' })
  const [error, setError] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  const isAdmin = getUser()?.role === 'Administrador'

  async function load(){
    const r = await listLubricants()
    setItems(r)
  }

  async function handleDelete(id: string) {
    setPendingDeleteId(id)
    setConfirmOpen(true)
  }

  async function confirmDelete() {
    if (!pendingDeleteId) return
    await deleteLubricant(pendingDeleteId)
    setConfirmOpen(false)
    setPendingDeleteId(null)
    await load()
  }

  useEffect(() => { load() }, [])

  async function handleCreateLubricant() {
    setError('')
    if (!newLub.Codigo || !newLub.Nombre || !newLub.Referencia || !newLub.Tipo) {
      setError('Todos los campos son obligatorios')
      return
    }
    try {
      await createLubricant({ Codigo: newLub.Codigo, Nombre: newLub.Nombre, Marca: newLub.Referencia, Tipo: newLub.Tipo })
      setShowNew(false)
      setNewLub({ Codigo: '', Nombre: '', Referencia: '', Tipo: '' })
      await load()
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Error creando lubricante')
    }
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="content">
        <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Lubricantes</h1>
            <p className="text-slate-400 mt-1">Gestiona tus lubricantes con código, nombre, referencia y tipo.</p>
          </div>
          <button onClick={() => setShowNew(true)} className="primary-action">+ Agregar lubricante</button>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="text-xl font-semibold text-white">Listado de lubricantes</div>
        </div>
        <div className="table-card">
          <table className="w-full">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Referencia</th>
                <th>Tipo</th>
              </tr>
            </thead>
            <tbody>
              {items.map(i=> (
                <tr key={i.id}>
                  <td>{i.Codigo}</td>
                  <td>{i.Nombre}</td>
                  <td>{i.Referencia || i.Marca}</td>
                  <td>{i.Tipo}</td>
                  <td>
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
            <div className="w-full max-w-xl rounded-[32px] border border-white/10 bg-slate-950/95 p-6 shadow-2xl shadow-slate-950/60 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">Agregar lubricante</h2>
                  <p className="text-sm text-slate-400">Ingrese código, nombre, referencia y tipo.</p>
                </div>
                <button onClick={() => { setShowNew(false); setError('') }} className="rounded-full border border-white/10 px-4 py-2 text-sm text-white hover:bg-white/5">Cerrar</button>
              </div>
              <div className="grid gap-4">
                <div>
                  <label className="form-label">Código</label>
                  <input
                    value={newLub.Codigo}
                    onChange={e => setNewLub({ ...newLub, Codigo: e.target.value })}
                    className="form-input"
                    placeholder="Código"
                  />
                </div>
                <div>
                  <label className="form-label">Nombre</label>
                  <input
                    value={newLub.Nombre}
                    onChange={e => setNewLub({ ...newLub, Nombre: e.target.value })}
                    className="form-input"
                    placeholder="Nombre"
                  />
                </div>
                <div>
                  <label className="form-label">Referencia</label>
                  <input
                    value={newLub.Referencia}
                    onChange={e => setNewLub({ ...newLub, Referencia: e.target.value })}
                    className="form-input"
                    placeholder="Referencia"
                  />
                </div>
                <div>
                  <label className="form-label">Tipo</label>
                  <input
                    value={newLub.Tipo}
                    onChange={e => setNewLub({ ...newLub, Tipo: e.target.value })}
                    className="form-input"
                    placeholder="Tipo"
                  />
                </div>
                {error && <div className="rounded-2xl bg-red-950/60 border border-red-500/20 p-3 text-red-200">{error}</div>}
                <div className="flex justify-end gap-3">
                  <button onClick={() => { setShowNew(false); setError('') }} className="secondary-action">Cancelar</button>
                  <button onClick={handleCreateLubricant} className="primary-action">Guardar lubricante</button>
                </div>
              </div>
            </div>
          </div>
        )}

        <ConfirmDialog
          open={confirmOpen}
          title="Eliminar lubricante"
          message="¿Seguro que quieres eliminar este lubricante?"
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
