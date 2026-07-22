import { useAuthStore } from '@/store/authStore'

/**
 * useAuth — reads auth state from the Zustand store.
 * No Firebase. The backend uses email/password + JWT.
 * Login/signup mutations set the user and token directly.
 */
export function useAuth() {
  const { user, isAuthenticated, isLoading, setUser, setLoading, logout } =
    useAuthStore()

  return { user, isAuthenticated, isLoading, setUser, setLoading, logout }
}
