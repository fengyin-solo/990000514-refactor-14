import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '../api/index.js'
import { getSession, saveSession, clearSession, onSessionChange } from '../auth/session.js'

export const useAuthStore = defineStore('auth', () => {
  // 初始状态直接来自共用的会话读取逻辑，刷新后守卫与界面在第一时间即为正确登录态
  const initial = getSession()
  const user = ref(initial.user)
  const token = ref(initial.token)

  const isLoggedIn = computed(() => !!token.value)

  function applySession(session) {
    token.value = session.token
    user.value = session.user
  }

  // 会话一旦在共用层发生变化（登录、注册、退出、401 过期、其他标签页改动），
  // 内存态统一跟随存储同步，界面与实际登录态保持一致
  onSessionChange((session) => {
    applySession(session)
  })

  // 登录与注册共用同一份保存写法
  async function login(username, password) {
    const res = await authApi.login(username, password)
    saveSession(res.data.token, res.data.user)
    return res.data
  }

  async function register(username, password) {
    const res = await authApi.register(username, password)
    saveSession(res.data.token, res.data.user)
    return res.data
  }

  function logout() {
    clearSession()
  }

  return { user, token, isLoggedIn, login, register, logout }
})
