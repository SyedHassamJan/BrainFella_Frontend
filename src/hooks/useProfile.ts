import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import type { User } from '@/types'

export const profileKeys = {
  all: ['profile'] as const,
  me: () => [...profileKeys.all, 'me'] as const,
}

export function useProfile() {
  return useQuery({
    queryKey: profileKeys.me(),
    queryFn: async (): Promise<User> => {
      const response = await api.get<User>('/user/profile')
      return response.data
    },
  })
}
