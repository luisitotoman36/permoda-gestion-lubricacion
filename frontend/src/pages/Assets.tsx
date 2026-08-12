import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import api from '../services/api'
import { getUser } from '../services/auth'
import ConfirmDialog from '../components/ConfirmDialog'

type Asset = {
  id: string; AF: string; NombreEquipo: string; TipoEquipo: string; Area: string; Estado: string; Criticidad: string; Observaciones?: string
}

export default function Assets(){
  const [items, setItems] = useState<Asset[]>([])
  const [q, setQ] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [newAsset, setNewAsset] = useState<any>({ AF: '', NombreEquipo: '', TipoEquipo: '', Area: '' })
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  const isAdmin = getUser()?.role === 'Administrador'

  async function load(){
    const r = await api.get('/activos', { params: { q }})
    setItems(r.data)
  }

  async function handleDelete(id: string) {
    setPendingDeleteId(id)
    setConfirmOpen(true)
  }

  async function confirmDelete() {
    if (!pendingDeleteId) return
    await api.delete(`/activos/${pendingDeleteId}`)
    setConfirmOpen(false)
    setPendingDeleteId(null)
    await load()
  }

  useEffect(()=>{ load() }, [])

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="content">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Activos</h1>
          <div className="flex gap-2">
            <input placeholder="Buscar..." value={q} onChange={e=>setQ(e.target.value)} className="p-2 rounded border" />
            <button onClick={load} className="bg-blue-600 text-white p-2 rounded">Buscar</button>
          </div>
        </div>
        <div className="flex items-center justify-between mb-3">
          <div />
          <div>
            <button onClick={() => setShowNew(true)} className="bg-green-600 text-white p-2 rounded">+ Agregar máquina</button>
          </div>
        </div>

        <div className="table-card">
          <table className="w-full">
            <thead>
              <tr>
                <th>AF</th>
                <th>Equipo</th>
                <th>Tipo</th>
                <th>Área</th>
                <th>Estado</th>
                <th>Criticidad</th>
              </tr>
            </thead>
            <tbody>
              {items.map(i=> (
                <tr key={i.id}>
                  <td>{i.AF}</td>
                  <td>{i.NombreEquipo}</td>
                  <td>{i.TipoEquipo}</td>
                  <td>{i.Area}</td>
                  <td>{i.Estado}</td>
                  <td>{i.Criticidad}</td>
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
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white rounded p-6 w-full max-w-lg">
              <h3 className="text-lg font-semibold mb-4">Agregar máquina</h3>
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="AF" value={newAsset.AF} onChange={e=>setNewAsset({...newAsset, AF: e.target.value})} className="p-2 border rounded" />
                <input placeholder="Nombre" value={newAsset.NombreEquipo} onChange={e=>setNewAsset({...newAsset, NombreEquipo: e.target.value})} className="p-2 border rounded" />
                <input placeholder="Tipo" value={newAsset.TipoEquipo} onChange={e=>setNewAsset({...newAsset, TipoEquipo: e.target.value})} className="p-2 border rounded" />
                <input placeholder="Area" value={newAsset.Area} onChange={e=>setNewAsset({...newAsset, Area: e.target.value})} className="p-2 border rounded" />
              </div>
              <div className="mt-4 flex gap-2 justify-end">
                <button onClick={()=>setShowNew(false)} className="p-2 rounded border">Cancelar</button>
                <button onClick={async ()=>{
                  try { await api.post('/activos', newAsset); setShowNew(false); load(); } catch(err){ alert('Error creando activo') }
                }} className="p-2 rounded bg-blue-600 text-white">Crear</button>
              </div>
            </div>
          </div>
        )}

        <ConfirmDialog
          open={confirmOpen}
          title="Eliminar activo"
          message="¿Seguro que quieres eliminar este activo?"
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
