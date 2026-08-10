import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import { listWorkOrders } from '../services/workorders'

export default function WorkOrders(){
  const [items, setItems] = useState<any[]>([])

  async function load(){
    const r = await listWorkOrders()
    setItems(r)
  }
  useEffect(()=>{ load() }, [])

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="content">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Órdenes de Trabajo</h1>
        </div>
        <div className="table-card">
          <table className="w-full">
            <thead>
              <tr>
                <th>Número OT</th>
                <th>AF</th>
                <th>Técnico</th>
                <th>Fecha programada</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {items.map(i=> (
                <tr key={i.id} className="border-t border-slate-800 hover:bg-white/5 transition">
                  <td className="p-3 text-slate-100">{i.NumeroOT}</td>
                  <td className="p-3 text-slate-100">{i.AF?.AF || i.AF}</td>
                  <td className="p-3 text-slate-100">{i.Tecnico?.fullName || i.Tecnico}</td>
                  <td className="p-3 text-slate-100">{i.FechaProgramada ? new Date(i.FechaProgramada).toLocaleDateString() : '-'}</td>
                  <td className="p-3 text-slate-100">{i.Estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
