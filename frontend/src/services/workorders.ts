import api from './api'

export async function listWorkOrders(q?: string){
  const r = await api.get('/ordenes', { params: { q } })
  return r.data
}

export async function createWorkOrder(data: any){
  const r = await api.post('/ordenes', data)
  return r.data
}

export async function updateWorkOrder(id: string, data: any){
  const r = await api.put(`/ordenes/${id}`, data)
  return r.data
}

export async function deleteWorkOrder(id: string){
  const r = await api.delete(`/ordenes/${id}`)
  return r.data
}
