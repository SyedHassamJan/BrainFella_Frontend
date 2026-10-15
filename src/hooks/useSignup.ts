import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import api from '@/lib/api'
import type { SignupFormValues } from '@/schemas/signupSchema'
import type { AuthResponse } from '@/types'
import { ROUTES } from '@/constants/routes'

export function useSignup() {
  const router = useRouter()
  const { setUser, setAccessToken, setRefreshToken } = useAuthStore()

  return useMutation({
    mutationFn: async (values: SignupFormValues): Promise<AuthResponse> => {
      // Step 1: Register user
      await api.post('/auth/signup', {
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
      })

      // Step 2: Sign in to get tokens
      const response = await api.post<AuthResponse>('/auth/signin', {
        email: values.email,
        password: values.password,
      })
      return response.data
    },
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
      // A new therapist goes straight to uploading their CV for review.
      router.push(data.role === 'THERAPIST' ? ROUTES.THERAPIST_APPLICATION : ROUTES.JOURNAL)
    },
  })
}
