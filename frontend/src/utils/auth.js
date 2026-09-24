// Single source of truth for persisting the auth session.
// Every read/write/clear of the token and user goes through here so that
// login, register, logout, the axios interceptors and the router guard
// can never drift out of sync with each other.

const TOKEN_KEY = 'token'
const USER_KEY = 'user'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getUser() {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

// A restorable session requires both the token and the user.
export function getSession() {
  const token = getToken()
  const user = getUser()
  return token && user ? { token, user } : null
}

// The only place a session is saved.
export function saveSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

// The only place a session is removed (logout / expiry).
export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}
