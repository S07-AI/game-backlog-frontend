import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { getToken, setToken, clearToken } from '../api/client'
import { loginRequest, registerRequest, meRequest, confirmEmailRequest } from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  // Undecided until we've checked for an existing token, so ProtectedRoute
  // doesn't flash-redirect to /login while that check is in flight.
  const [status, setStatus] = useState('loading') // 'loading' | 'authenticated' | 'guest'

  const logout = useCallback(() => {
    clearToken()
    setUser(null)
    setStatus('guest')
  }, [])

  useEffect(() => {
    const token = getToken()
    if (!token) {
      setStatus('guest')
      return
    }

    meRequest()
      .then(({ data }) => {
        setUser({ id: data.userId, email: data.email, displayName: data.displayName })
        setStatus('authenticated')
      })
      .catch(() => {
        clearToken()
        setStatus('guest')
      })
  }, [])

  useEffect(() => {
    window.addEventListener('auth:unauthorized', logout)
    return () => window.removeEventListener('auth:unauthorized', logout)
  }, [logout])

  const login = async (email, password) => {
    const { data } = await loginRequest({ email, password })
    setToken(data.token)
    setUser({ id: data.userId, email: data.email, displayName: data.displayName })
    setStatus('authenticated')
  }

  // Register no longer logs the user in — the account isn't usable until they
  // click the confirmation link in their email. Returns { message, email }.
  const register = async (email, displayName, password) => {
    const { data } = await registerRequest({ email, displayName, password })
    return data
  }

  const confirmEmail = async (token) => {
    const { data } = await confirmEmailRequest(token)
    setToken(data.token)
    setUser({ id: data.userId, email: data.email, displayName: data.displayName })
    setStatus('authenticated')
  }

  return (
    <AuthContext.Provider value={{ user, status, login, register, confirmEmail, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
