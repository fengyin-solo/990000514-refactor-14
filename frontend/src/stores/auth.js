import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '../api/index.js'
import { getSession, saveSession, clearSession } from '../utils/auth.js'

export const useAuthStore = defineStore('auth', () => {
  // Restore once, at store creation, so refresh and direct navigation
  // are consistent without a separate loadFromStorage() call.
  const session = getSession()
  const user = ref(session ? session.user : null)
  const token = ref(session ? session.token : null)

  const isLoggedIn = computed(() => !!token.value)

  // Save both the reactive state and persistence layer together.
  function applySession(newToken, newUser) {
    token.value = newToken
    user.value = newUser
    saveSession(newToken, newUser)
  }

  // Clear both the reactive state and persistence layer together.
  function clearAuth() {
    token.value = null
    user.value = null
    clearSession()
  }

  async function login(username, password) {
    const res = await authApi.login(username, password)
    applySession(res.data.token, res.data.user)
    return res.data
  }

  async function register(username, password) {
    const res = await authApi.register(username, password)
    applySession(res.data.token, res.data.user)
    return res.data
  }

  function logout() {
    clearAuth()
  }

  return { user, token, isLoggedIn, login, register, logout }
})
