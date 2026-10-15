import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import api from '@/lib/api'
import type { LoginFormValues } from '@/schemas/loginSchema'
import type { AuthResponse } from '@/types'
import { ROUTES } from '@/constants/routes'
import type { AxiosError } from 'axios'

  export function useLogin() {
    const router = useRouter()
    const { setUser, setAccessToken, setRefreshToken } = useAuthStore()
  
    const loginMutation = useMutation({
      mutationFn: async (values: LoginFormValues): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/signin', {
          email: values.email,
          password: values.password,
        })
        return response.data
      },
      onSuccess: (data) => {
        // Persist token so the axios interceptor can use it
        setAccessToken(data.accessToken)
        setRefreshToken(data.refreshToken)
        // Build a User object from the auth response
      setUser({
        id: data.id,
        name: data.name,
        role: data.role,
        email: '',          // not returned by signin — will be fetched if needed
        isActive: true,
        createdAt: new Date().toISOString(),
      })
      // Role-based redirect
      const redirectMap: Record<string, string> = {
        PATIENT: ROUTES.JOURNAL,
        THERAPIST: ROUTES.NOTIFICATIONS,
        ADMIN: ROUTES.ADMIN_THERAPISTS, // not reachable: the API sends admins to the admin login page
        GUARDIAN: ROUTES.HOME,
      }
      router.push(redirectMap[data.role] ?? ROUTES.HOME)
    },
  })

  return { loginMutation }
}
