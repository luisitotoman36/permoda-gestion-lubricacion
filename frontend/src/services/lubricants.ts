import api from './api'

export async function listLubricants(q?: string){
  const r = await api.get('/lubricantes', { params: { q } })
  return r.data
}

export async function createLubricant(data: any){
  const r = await api.post('/lubricantes', data)
  return r.data
}

export async function updateLubricant(id: string, data: any){
  const r = await api.put(`/lubricantes/${id}`, data)
  return r.data
}

export async function deleteLubricant(id: string){
  const r = await api.delete(`/lubricantes/${id}`)
  return r.data
}
