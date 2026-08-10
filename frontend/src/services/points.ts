import api from './api'

export async function listPoints(q?: string){
  const r = await api.get('/puntos', { params: { q } })
  return r.data
}

export async function createPoint(data: any){
  const r = await api.post('/puntos', data)
  return r.data
}

export async function updatePoint(id: string, data: any){
  const r = await api.put(`/puntos/${id}`, data)
  return r.data
}

export async function deletePoint(id: string){
  const r = await api.delete(`/puntos/${id}`)
  return r.data
}
