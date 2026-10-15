import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import api from '@/lib/api'
import type { LoginFormValues } from '@/schemas/loginSchema'
import type { AuthResponse } from '@/types'
import { ROUTES } from '@/constants/routes'

/** Admin sign-in: the API only issues tokens here to ADMIN accounts (403 for everyone else). */
export function useAdminLogin() {
  const router = useRouter()
  const { setUser, setAccessToken, setRefreshToken } = useAuthStore()

  return useMutation({
    mutationFn: async (values: LoginFormValues): Promise<AuthResponse> =>
      (await api.post<AuthResponse>('/auth/admin/signin', { email: values.email, password: values.password })).data,
    onSuccess: (data) => {
      setAccessToken(data.accessToken)
      setRefreshToken(data.refreshToken)
      setUser({
        id: data.id,
        name: data.name,
        role: data.role,
        email: '',
        isActive: true,
        createdAt: new Date().toISOString(),
      })
      router.push(ROUTES.ADMIN_THERAPISTS)
    },
  })
}
