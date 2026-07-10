import api from './api'
export const mototaxisService = {
  getAll: async (params:any={}) => { const {data} = await api.get('/mototaxis', {params}); return data },
  getById: async (id:number) => { const {data} = await api.get(`/mototaxis/${id}`); return data },
  create: async (m:any) => { const {data} = await api.post('/mototaxis', m); return data },
  update: async (id:number, m:any) => { const {data} = await api.put(`/mototaxis/${id}`, m); return data },
  delete: async (id:number) => { const {data} = await api.delete(`/mototaxis/${id}`); return data }
}
