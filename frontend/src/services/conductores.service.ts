import api from './api'
export const conductoresService = {
  getAll: async (params: any = {}) => { const {data} = await api.get('/conductores', {params}); return data },
  getById: async (id:number) => { const {data} = await api.get(`/conductores/${id}`); return data },
  create: async (conductor:any) => { const {data} = await api.post('/conductores', conductor); return data },
  update: async (id:number, conductor:any) => { const {data} = await api.put(`/conductores/${id}`, conductor); return data },
  delete: async (id:number) => { const {data} = await api.delete(`/conductores/${id}`); return data }
}
