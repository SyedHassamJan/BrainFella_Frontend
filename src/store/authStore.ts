import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { User } from '@/types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  _hasHydrated: boolean
  accessToken: string | null
  refreshToken: string | null
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setAccessToken: (token: string | null) => void
  setRefreshToken: (token: string | null) => void
  setHasHydrated: (v: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      _hasHydrated: false,
      accessToken: null,
      refreshToken: null,

      setUser: (user) =>
        set({ user, isAuthenticated: !!user, isLoading: false }),

      setLoading: (isLoading) => set({ isLoading }),

      setAccessToken: (accessToken) => set({ accessToken }),

      setRefreshToken: (refreshToken) => set({ refreshToken }),

      setHasHydrated: (v) => set({ _hasHydrated: v }),

      logout: () =>
        set({ user: null, isAuthenticated: false, isLoading: false, accessToken: null, refreshToken: null }),
    }),
    {
      name: 'brainhealth-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setLoading(false)
          state.setHasHydrated(true)
        }
      },
    }
  )
)
