// 会话（token + 用户信息）持久化的唯一入口。
// 登录、注册、退出、请求拦截器、路由守卫都只通过这里读写，
// 保证 localStorage 与内存中的登录态始终一致。

const TOKEN_KEY = 'token'
const USER_KEY = 'user'

function readUser() {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

// 读取当前会话；token 与 user 必须同时存在才算有效，二者成对保存、成对失效
export function getSession() {
  const token = localStorage.getItem(TOKEN_KEY)
  const user = readUser()
  if (!token || !user) return { token: null, user: null }
  return { token, user }
}

export function getToken() {
  return getSession().token
}

export function hasSession() {
  const { token, user } = getSession()
  return !!token && !!user
}

// ---- 保存 / 清理：区分写和删，成对操作后统一通知 ----

const listeners = new Set()

function sessionKey(session) {
  return `${session.token ?? ''}:${session.user?.id ?? ''}`
}

let currentKey = sessionKey(getSession())

function notify(session, source) {
  const nextKey = sessionKey(session)
  if (nextKey === currentKey) return
  currentKey = nextKey
  listeners.forEach((fn) => fn(session, source))
}

// 登录 / 注册成功后保存
export function saveSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
  notify(getSession(), 'local')
}

// 退出 / 令牌过期后清理
export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  notify({ token: null, user: null }, 'local')
}

// 订阅会话变化：
// - source === 'local'：本页保存或清理（登录、注册、退出、401 拦截器）
// - source === 'external'：其他标签页的 storage 改动
// 返回取消订阅函数
export function onSessionChange(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

window.addEventListener('storage', (event) => {
  if (event.key !== TOKEN_KEY && event.key !== USER_KEY) return
  notify(getSession(), 'external')
})
