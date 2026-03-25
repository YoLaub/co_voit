import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AuthUser {
  accountId: number
  email: string
  role: string
  hasCompletedProfile: boolean
}

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 < Date.now()
  } catch {
    return true
  }
}

interface AuthState {
  token: string | null
  user: AuthUser | null
  login: (token: string, user: AuthUser) => void
  logout: () => void
  isAuthenticated: () => boolean
  updateUser: (patch: Partial<AuthUser>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      login: (token, user) => set({ token, user }),
      logout: () => {
        set({ token: null, user: null })
        window.location.href = '/login'
      },
      isAuthenticated: () => {
        const token = get().token
        if (!token || isTokenExpired(token)) {
          if (token) set({ token: null, user: null })
          return false
        }
        return true
      },
      updateUser: (patch) => {
        const current = get().user
        if (current) set({ user: { ...current, ...patch } })
      },
    }),
    { name: 'auth-storage' },
  ),
)
