import { defineStore } from 'pinia'
import AuthService from '../services/AuthService'

export const useAuthenStore = defineStore('authen', {
  state: () => ({
    token: null,
    user: null,
  }),
  getters: {
    isUserLoggedIn: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin',
  },
  actions: {
    setToken(token) {
      this.token = token
    },
    setUser(user) {
      this.user = user
    },
    logout() {
      this.token = null
      this.user = null
    },

    async login(email, password) {
      const res = await AuthService.login({ email, password })
      this.setToken(res.data.token)
      this.setUser(res.data.user)
      return res.data
    },

    async register(payload) {
      const res = await AuthService.register(payload)
      this.setToken(res.data.token)
      this.setUser(res.data.user)
      return res.data
    },

    async fetchMe() {
      if (!this.token) return null
      const res = await AuthService.me()
      this.setUser(res.data.user)
      return res.data.user
    },
  },
  persist: true,
})