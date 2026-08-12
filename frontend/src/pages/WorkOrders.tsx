import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import { getUser } from '../services/auth'
import ConfirmDialog from '../components/ConfirmDialog'
import { createWorkOrder, deleteWorkOrder, listWorkOrders, updateWorkOrder } from '../services/workorders'

interface WorkOrder {
  id: string | number
  numeroOT: string
  fecha: string
  maquina: string
  ubicacion: string
  tipoTrabajo: string
  prioridad: string
  estado: string
  responsable: string
  descripcion: string
  lubricante: string
  cantidad: string
  codigoMaquina?: string
  area?: string
  supervisor?: string
  unidad?: string
}

interface WorkOrderForm {
  numeroOT: string
  fecha: string
  estado: string
  codigoMaquina: string
  maquina: string
  ubicacion: string
  area: string
  tipoTrabajo: string
  prioridad: string
  descripcion: string
  responsable: string
  supervisor: string
  lubricante: string
  cantidad: string
  unidad: string
}

const initialForm: WorkOrderForm = {
  numeroOT: '',
  fecha: new Date().toISOString().slice(0, 10),
  estado: 'Pendiente',
  codigoMaquina: '',
  maquina: '',
  ubicacion: '',
  area: '',
  tipoTrabajo: 'Lubricación',
  prioridad: 'Media',
  descripcion: '',
  responsable: '',
  supervisor: '',
  lubricante: '',
  cantidad: '',
  unidad: 'L',
}

export default function WorkOrders() {
  const [orders, setOrders] = useState<WorkOrder[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingOrderId, setEditingOrderId] = useState<string | number | null>(null)
  const [form, setForm] = useState<WorkOrderForm>(initialForm)
  const [errors, setErrors] = useState<Partial<Record<keyof WorkOrderForm, string>>>({})
  const [success, setSuccess] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | number | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<WorkOrder | null>(null)
  const isAdmin = getUser()?.role === 'Administrador'

  async function loadOrders() {
    try {
      const result = await listWorkOrders()
      const mapped = (result || []).map((item: any) => ({
        id: item.id,
        numeroOT: item.NumeroOT || item.numeroOT || 'Sin OT',
        fecha: item.FechaProgramada ? new Date(item.FechaProgramada).toISOString().slice(0, 10) : (item.fecha || new Date().toISOString().slice(0, 10)),
        maquina: item.maquina || item.AF?.AF || item.AF || 'Sin máquina',
        ubicacion: item.ubicacion || item.PuntoLubricacion || 'Sin ubicación',
        tipoTrabajo: item.tipoTrabajo || item.Observaciones || 'Lubricación',
        prioridad: item.prioridad || 'Media',
        estado: item.Estado || item.estado || 'Pendiente',
        responsable: item.responsable || item.Tecnico?.fullName || item.Tecnico || 'Sin responsable',
        descripcion: item.descripcion || item.Observaciones || 'Sin descripción',
        lubricante: item.lubricante || 'No definido',
        cantidad: item.cantidad || '0',
        codigoMaquina: item.codigoMaquina || '',
        area: item.area || '',
        supervisor: item.supervisor || '',
        unidad: item.unidad || 'L',
      }))
      setOrders(mapped)
    } catch (error) {
      console.error('No se pudo cargar las órdenes', error)
      setOrders([])
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  useEffect(() => {
    setSuccess('')
  }, [showModal])

  function generateOTNumber() {
    const next = (orders.length + 1).toString().padStart(4, '0')
    return `OT-${next}`
  }

  function openCreateModal() {
    setEditingOrderId(null)
    setSelectedOrder(null)
    setErrors({})
    setForm({
      ...initialForm,
      numeroOT: generateOTNumber(),
      fecha: new Date().toISOString().slice(0, 10),
    })
    setShowModal(true)
  }

  function openEditModal(order: WorkOrder) {
    setEditingOrderId(order.id)
    setSelectedOrder(order)
    setErrors({})
    setForm({
      numeroOT: order.numeroOT,
      fecha: order.fecha,
      estado: order.estado,
      codigoMaquina: order.codigoMaquina || '',
      maquina: order.maquina,
      ubicacion: order.ubicacion,
      area: order.area || '',
      tipoTrabajo: order.tipoTrabajo,
      prioridad: order.prioridad,
      descripcion: order.descripcion,
      responsable: order.responsable,
      supervisor: order.supervisor || '',
      lubricante: order.lubricante,
      cantidad: order.cantidad,
      unidad: order.unidad || 'L',
    })
    setShowModal(true)
  }

  function closeModal() {
    setShowModal(false)
    setErrors({})
    setSelectedOrder(null)
    setEditingOrderId(null)
  }

  function handleFieldChange(field: keyof WorkOrderForm, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: '' }))
  }

  function validateForm() {
    const nextErrors: Partial<Record<keyof WorkOrderForm, string>> = {}

    if (!form.numeroOT.trim()) nextErrors.numeroOT = 'El número de OT es obligatorio.'
    if (!form.fecha) nextErrors.fecha = 'La fecha es obligatoria.'
    if (!form.maquina.trim()) nextErrors.maquina = 'La máquina es obligatoria.'
    if (!form.ubicacion.trim()) nextErrors.ubicacion = 'La ubicación es obligatoria.'
    if (!form.tipoTrabajo.trim()) nextErrors.tipoTrabajo = 'El tipo de trabajo es obligatorio.'
    if (!form.prioridad.trim()) nextErrors.prioridad = 'La prioridad es obligatoria.'
    if (!form.descripcion.trim()) nextErrors.descripcion = 'La descripción es obligatoria.'
    if (!form.responsable.trim()) nextErrors.responsable = 'El técnico responsable es obligatorio.'
    if (!form.lubricante.trim()) nextErrors.lubricante = 'El lubricante es obligatorio.'
    if (!form.cantidad.trim()) nextErrors.cantidad = 'La cantidad es obligatoria.'

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!validateForm()) return

    const payload = {
      NumeroOT: form.numeroOT.trim(),
      FechaProgramada: form.fecha,
      Estado: form.estado,
      codigoMaquina: form.codigoMaquina.trim(),
      maquina: form.maquina.trim(),
      ubicacion: form.ubicacion.trim(),
      area: form.area.trim(),
      tipoTrabajo: form.tipoTrabajo,
      prioridad: form.prioridad,
      descripcion: form.descripcion.trim(),
      responsable: form.responsable.trim(),
      supervisor: form.supervisor.trim(),
      lubricante: form.lubricante.trim(),
      cantidad: form.cantidad.trim(),
      unidad: form.unidad,
      Observaciones: form.descripcion.trim(),
    }

    try {
      if (editingOrderId) {
        const updated = await updateWorkOrder(String(editingOrderId), payload)
        setOrders(prev =>
          prev.map(order =>
            String(order.id) === String(editingOrderId)
              ? {
                  id: updated.id || order.id,
                  numeroOT: updated.NumeroOT || updated.numeroOT || order.numeroOT,
                  fecha: updated.FechaProgramada ? new Date(updated.FechaProgramada).toISOString().slice(0, 10) : order.fecha,
                  maquina: updated.maquina || order.maquina,
                  ubicacion: updated.ubicacion || order.ubicacion,
                  tipoTrabajo: updated.tipoTrabajo || order.tipoTrabajo,
                  prioridad: updated.prioridad || order.prioridad,
                  estado: updated.Estado || updated.estado || order.estado,
                  responsable: updated.responsable || order.responsable,
                  descripcion: updated.descripcion || updated.Observaciones || order.descripcion,
                  lubricante: updated.lubricante || order.lubricante,
                  cantidad: updated.cantidad || order.cantidad,
                  codigoMaquina: updated.codigoMaquina || order.codigoMaquina,
                  area: updated.area || order.area,
                  supervisor: updated.supervisor || order.supervisor,
                  unidad: updated.unidad || order.unidad,
                }
              : order,
          ),
        )
        setSuccess(`La OT ${updated.NumeroOT || form.numeroOT} se actualizó correctamente.`)
      } else {
        const created = await createWorkOrder(payload)
        setOrders(prev => [{
          id: created.id,
          numeroOT: created.NumeroOT || created.numeroOT || form.numeroOT,
          fecha: created.FechaProgramada ? new Date(created.FechaProgramada).toISOString().slice(0, 10) : form.fecha,
          maquina: created.maquina || form.maquina,
          ubicacion: created.ubicacion || form.ubicacion,
          tipoTrabajo: created.tipoTrabajo || form.tipoTrabajo,
          prioridad: created.prioridad || form.prioridad,
          estado: created.Estado || created.estado || form.estado,
          responsable: created.responsable || form.responsable,
          descripcion: created.descripcion || created.Observaciones || form.descripcion,
          lubricante: created.lubricante || form.lubricante,
          cantidad: created.cantidad || form.cantidad,
          codigoMaquina: created.codigoMaquina || form.codigoMaquina,
          area: created.area || form.area,
          supervisor: created.supervisor || form.supervisor,
          unidad: created.unidad || form.unidad,
        }, ...prev])
        setSuccess(`La OT ${created.NumeroOT || form.numeroOT} se creó correctamente.`)
      }
      closeModal()
      await loadOrders()
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'No se pudo guardar la OT.'
      setErrors({ numeroOT: message })
    }
  }

  function handleDelete(id: string | number) {
    setPendingDeleteId(id)
    setConfirmOpen(true)
  }

  async function confirmDelete() {
    if (pendingDeleteId === null) return

    try {
      await deleteWorkOrder(String(pendingDeleteId))
      setOrders(prev => prev.filter(order => String(order.id) !== String(pendingDeleteId)))
      setSuccess('La OT se eliminó correctamente.')
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'No se pudo eliminar la OT.'
      setSuccess(message)
    } finally {
      setConfirmOpen(false)
      setPendingDeleteId(null)
    }
  }

  return (
    <div className="app-shell">
      <Sidebar />

      <main className="content">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-cyan-300/70">Gestión</p>
            <h1 className="text-3xl font-bold text-white">Órdenes de Trabajo</h1>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 transition hover:scale-[1.01] hover:shadow-cyan-400/40"
          >
            <span className="text-xl leading-none">+</span>
            Crear OT
          </button>
        </div>

        {success && (
          <div className="mb-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200 shadow-lg shadow-emerald-500/10">
            {success}
          </div>
        )}

        <div className="table-card workorders-table overflow-hidden">
          <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="text-xl font-semibold text-white">Listado de órdenes</h2>
            <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-sm text-cyan-200">
              {orders.length} OT
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px]">
              <thead>
                <tr>
                  <th>Número OT</th>
                  <th>Fecha</th>
                  <th>Máquina</th>
                  <th>Tipo de trabajo</th>
                  <th>Prioridad</th>
                  <th>Estado</th>
                  <th>Responsable</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-10 text-center text-slate-300">
                      <span className="block text-[16px] font-medium leading-relaxed tracking-[-0.02em] text-slate-200">
                        No hay órdenes registradas. Haz clic en <span className="font-semibold text-cyan-300">Crear OT</span> para registrar la primera.
                      </span>
                    </td>
                  </tr>
                ) : orders.map(order => (
                  <tr key={String(order.id)} className="border-t border-slate-800/80 hover:bg-white/5 transition">
                    <td className="p-3 text-slate-100">{order.numeroOT}</td>
                    <td className="p-3 text-slate-100">{new Date(order.fecha).toLocaleDateString()}</td>
                    <td className="p-3 text-slate-100">{order.maquina}</td>
                    <td className="p-3 text-slate-100">{order.tipoTrabajo}</td>
                    <td className="p-3">
                      <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-xs font-medium text-cyan-200">
                        {order.prioridad}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-200">
                        {order.estado}
                      </span>
                    </td>
                    <td className="p-3 text-slate-100">{order.responsable}</td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="rounded-xl border border-sky-500/30 bg-sky-500/10 px-3 py-1.5 text-xs font-medium text-sky-200 transition hover:bg-sky-500/20"
                        >
                          Ver
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditModal(order)}
                          className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-200 transition hover:bg-amber-500/20"
                        >
                          Editar
                        </button>
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={() => handleDelete(order.id)}
                            className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-medium text-rose-200 transition hover:bg-rose-500/20"
                          >
                            Eliminar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm">
            <div className="w-full max-w-2xl rounded-[28px] border border-white/10 bg-slate-950/95 p-6 shadow-2xl shadow-slate-900/60">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-300/70">Detalle</p>
                  <h3 className="text-2xl font-semibold text-white">{selectedOrder.numeroOT}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="text-xl text-slate-300 hover:text-white"
                >
                  ×
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Máquina</p>
                  <p className="mt-2 text-lg text-white">{selectedOrder.maquina}</p>
                  <p className="mt-1 text-sm text-slate-300">{selectedOrder.codigoMaquina || 'Sin código'} · {selectedOrder.area || 'Sin área'}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Responsable</p>
                  <p className="mt-2 text-lg text-white">{selectedOrder.responsable}</p>
                  <p className="mt-1 text-sm text-slate-300">Supervisor: {selectedOrder.supervisor || 'No definido'}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Trabajo</p>
                  <p className="mt-2 text-lg text-white">{selectedOrder.tipoTrabajo}</p>
                  <p className="mt-1 text-sm text-slate-300">{selectedOrder.prioridad} · {selectedOrder.estado}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Lubricación</p>
                  <p className="mt-2 text-lg text-white">{selectedOrder.lubricante}</p>
                  <p className="mt-1 text-sm text-slate-300">{selectedOrder.cantidad} {selectedOrder.unidad || 'L'}</p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Descripción</p>
                <p className="mt-2 text-sm leading-6 text-slate-200">{selectedOrder.descripcion}</p>
              </div>
            </div>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 px-4 py-6 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-[30px] border border-white/10 bg-slate-950/95 p-6 shadow-[0_25px_80px_rgba(14,116,144,0.35)]">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-300/70">Orden de trabajo</p>
                  <h3 className="text-2xl font-semibold text-white">
                    {editingOrderId ? 'Editar OT' : 'Crear nueva OT'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xl text-slate-200 hover:bg-white/10"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <div>
                    <label className="mb-2 block text-sm text-slate-300">Número de OT</label>
                    <input
                      value={form.numeroOT}
                      onChange={e => handleFieldChange('numeroOT', e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-2.5 text-white outline-none ring-0 placeholder:text-slate-500 focus:border-cyan-400"
                    />
                    {errors.numeroOT && <p className="mt-1 text-xs text-rose-300">{errors.numeroOT}</p>}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-slate-300">Fecha de creación</label>
                    <input
                      type="date"
                      value={form.fecha}
                      onChange={e => handleFieldChange('fecha', e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-2.5 text-white outline-none focus:border-cyan-400"
                    />
                    {errors.fecha && <p className="mt-1 text-xs text-rose-300">{errors.fecha}</p>}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-slate-300">Estado</label>
                    <select
                      value={form.estado}
                      onChange={e => handleFieldChange('estado', e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-2.5 text-white outline-none focus:border-cyan-400"
                    >
                      <option>Pendiente</option>
                      <option>En Proceso</option>
                      <option>Completada</option>
                      <option>Cancelada</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-slate-300">Código de máquina</label>
                    <input
                      value={form.codigoMaquina}
                      onChange={e => handleFieldChange('codigoMaquina', e.target.value)}
                      placeholder="CMP-02"
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-2.5 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <h4 className="mb-4 text-lg font-semibold text-white">Máquina</h4>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div>
                      <label className="mb-2 block text-sm text-slate-300">Nombre de máquina</label>
                      <input
                        value={form.maquina}
                        onChange={e => handleFieldChange('maquina', e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-2.5 text-white outline-none focus:border-cyan-400"
                      />
                      {errors.maquina && <p className="mt-1 text-xs text-rose-300">{errors.maquina}</p>}
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-slate-300">Ubicación</label>
                      <input
                        value={form.ubicacion}
                        onChange={e => handleFieldChange('ubicacion', e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-2.5 text-white outline-none focus:border-cyan-400"
                      />
                      {errors.ubicacion && <p className="mt-1 text-xs text-rose-300">{errors.ubicacion}</p>}
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-slate-300">Área</label>
                      <input
                        value={form.area}
                        onChange={e => handleFieldChange('area', e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-2.5 text-white outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-slate-300">Supervisor</label>
                      <input
                        value={form.supervisor}
                        onChange={e => handleFieldChange('supervisor', e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-2.5 text-white outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <h4 className="mb-4 text-lg font-semibold text-white">Trabajo</h4>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <div>
                      <label className="mb-2 block text-sm text-slate-300">Tipo de trabajo</label>
                      <select
                        value={form.tipoTrabajo}
                        onChange={e => handleFieldChange('tipoTrabajo', e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-2.5 text-white outline-none focus:border-cyan-400"
                      >
                        <option>Lubricación</option>
                        <option>Inspección</option>
                        <option>Correctivo</option>
                        <option>Preventivo</option>
                        <option>Limpieza</option>
                      </select>
                      {errors.tipoTrabajo && <p className="mt-1 text-xs text-rose-300">{errors.tipoTrabajo}</p>}
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-slate-300">Prioridad</label>
                      <select
                        value={form.prioridad}
                        onChange={e => handleFieldChange('prioridad', e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-2.5 text-white outline-none focus:border-cyan-400"
                      >
                        <option>Baja</option>
                        <option>Media</option>
                        <option>Alta</option>
                        <option>Crítica</option>
                      </select>
                      {errors.prioridad && <p className="mt-1 text-xs text-rose-300">{errors.prioridad}</p>}
                    </div>

                    <div className="md:col-span-2 xl:col-span-1">
                      <label className="mb-2 block text-sm text-slate-300">Responsable</label>
                      <input
                        value={form.responsable}
                        onChange={e => handleFieldChange('responsable', e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-2.5 text-white outline-none focus:border-cyan-400"
                      />
                      {errors.responsable && <p className="mt-1 text-xs text-rose-300">{errors.responsable}</p>}
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="mb-2 block text-sm text-slate-300">Descripción detallada</label>
                    <textarea
                      value={form.descripcion}
                      onChange={e => handleFieldChange('descripcion', e.target.value)}
                      rows={4}
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-2.5 text-white outline-none focus:border-cyan-400"
                    />
                    {errors.descripcion && <p className="mt-1 text-xs text-rose-300">{errors.descripcion}</p>}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <h4 className="mb-4 text-lg font-semibold text-white">Lubricación</h4>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <label className="mb-2 block text-sm text-slate-300">Lubricante utilizado</label>
                      <input
                        value={form.lubricante}
                        onChange={e => handleFieldChange('lubricante', e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-2.5 text-white outline-none focus:border-cyan-400"
                      />
                      {errors.lubricante && <p className="mt-1 text-xs text-rose-300">{errors.lubricante}</p>}
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-slate-300">Cantidad</label>
                      <input
                        value={form.cantidad}
                        onChange={e => handleFieldChange('cantidad', e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-2.5 text-white outline-none focus:border-cyan-400"
                      />
                      {errors.cantidad && <p className="mt-1 text-xs text-rose-300">{errors.cantidad}</p>}
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-slate-300">Unidad</label>
                      <select
                        value={form.unidad}
                        onChange={e => handleFieldChange('unidad', e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-2.5 text-white outline-none focus:border-cyan-400"
                      >
                        <option>L</option>
                        <option>ml</option>
                        <option>kg</option>
                        <option>g</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="secondary-action"
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="primary-action">
                    Guardar OT
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <ConfirmDialog
          open={confirmOpen}
          title="Eliminar orden"
          message="¿Seguro que quieres eliminar esta orden de trabajo? Esta acción no se puede deshacer."
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
