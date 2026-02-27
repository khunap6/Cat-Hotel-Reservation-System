import axios from 'axios'
import { useAuthenStore } from '../stores/authen'

const api = axios.create({
  baseURL: 'http://localhost:8081/',
})

api.interceptors.request.use((config) => {
  const auth = useAuthenStore()
  if (auth.token) config.headers.Authorization = `Bearer ${auth.token}`
  else delete config.headers.Authorization
  return config
})

export default () => api