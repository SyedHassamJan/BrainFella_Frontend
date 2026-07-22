import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import type { CreateJournalDTO, JournalResponse } from '@/types'
import { journalKeys } from './useJournals'
import { ROUTES } from '@/constants/routes'

export function useCreateJournal() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: async (dto: CreateJournalDTO): Promise<JournalResponse> => {
      const response = await api.post<JournalResponse>('/journal', dto)
      return response.data
    },
    onSuccess: () => {
      // Invalidate journal list so it refetches
      queryClient.invalidateQueries({ queryKey: journalKeys.list() })
      router.push(ROUTES.JOURNAL)
    },
  })
}
