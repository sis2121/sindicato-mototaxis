import api from './api'
export const authService = {
  login: async (credentials: {email:string,password:string}) => {
    const {data} = await api.post('/auth/login', credentials)
    localStorage.setItem('access_token', data.access_token)
    localStorage.setItem('usuario', JSON.stringify(data.usuario))
    return data
  },
  logout: () => { localStorage.removeItem('access_token'); localStorage.removeItem('usuario') },
  getUsuario: () => { const u = localStorage.getItem('usuario'); return u ? JSON.parse(u) : null },
  isAuthenticated: () => !!localStorage.getItem('access_token')
}
