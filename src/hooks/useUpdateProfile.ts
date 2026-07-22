import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import type { User } from '@/types'
import { profileKeys } from './useProfile'
import { useAuthStore } from '@/store/authStore'

interface UpdateProfilePayload {
  name?: string
  phone?: string
  profileImage?: string
}

interface GuardianPayload {
  guardianEmail: string
  guardianName?: string
  guardianPhone?: string
  relationship?: string
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  const { setUser, user } = useAuthStore()

  return useMutation({
    mutationFn: async (dto: UpdateProfilePayload): Promise<User> => {
      const response = await api.patch<User>('/user/profile', dto)
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: profileKeys.me() })
      // Also update the auth store so Navbar picks up new name immediately
      if (user) {
        setUser({ ...user, name: data.name, profileImage: data.profileImage })
      }
    },
  })
}

export function useAddGuardian() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (dto: GuardianPayload) => {
      const response = await api.post('/user/guardian', dto)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.me() })
    },
  })
}
