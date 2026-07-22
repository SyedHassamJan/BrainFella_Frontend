import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import type { JournalEntry } from '@/types'
import { journalKeys } from './useJournals'
import { ROUTES } from '@/constants/routes'

interface UpdateJournalPayload {
  id: string
  title?: string
  content?: string
}

export function useUpdateJournal() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: async ({ id, ...dto }: UpdateJournalPayload): Promise<JournalEntry> => {
      const response = await api.patch<JournalEntry>(`/journal/${id}`, dto)
      return response.data
    },
    onSuccess: (data) => {
      // Invalidate both the list and the specific detail cache
      queryClient.invalidateQueries({ queryKey: journalKeys.list() })
      queryClient.invalidateQueries({ queryKey: journalKeys.detail(data.id) })
      router.push(ROUTES.JOURNAL_DETAIL(data.id))
    },
  })
}
