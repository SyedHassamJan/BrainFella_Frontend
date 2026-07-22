import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import type { JournalEntry } from '@/types'
import { journalKeys } from './useJournals'

export function useJournalDetail(id: string) {
  return useQuery({
    queryKey: journalKeys.detail(id),
    queryFn: async (): Promise<JournalEntry> => {
      const response = await api.get<JournalEntry>(`/journal/${id}`)
      return response.data
    },
    enabled: !!id,
  })
}
