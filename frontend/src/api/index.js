import axios from 'axios'
import { getToken, clearSession } from '../auth/session.js'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
})

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 responses globally: token 缺失或已过期，统一走清理逻辑后回到登录页
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      clearSession()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth
export const authApi = {
  register: (username, password) => api.post('/auth/register', { username, password }),
  login: (username, password) => api.post('/auth/login', { username, password })
}

// Boards
export const boardApi = {
  list: () => api.get('/boards'),
  create: (name, description) => api.post('/boards', { name, description }),
  delete: (id) => api.delete(`/boards/${id}`)
}

// Columns
export const columnApi = {
  list: (boardId) => api.get(`/boards/${boardId}/columns`),
  create: (boardId, name) => api.post(`/boards/${boardId}/columns`, { name }),
  update: (id, data) => api.put(`/columns/${id}`, data),
  delete: (id) => api.delete(`/columns/${id}`)
}

// Cards
export const cardApi = {
  list: (columnId) => api.get(`/columns/${columnId}/cards`),
  create: (columnId, data) => api.post(`/columns/${columnId}/cards`, data),
  update: (id, data) => api.put(`/cards/${id}`, data),
  delete: (id) => api.delete(`/cards/${id}`),
  move: (id, columnId, position) => api.put(`/cards/${id}/move`, { columnId, position })
}

export default api
