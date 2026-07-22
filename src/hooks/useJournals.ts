import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import type { JournalEntry, PaginatedResponse } from '@/types'

export const journalKeys = {
  all: ['journals'] as const,
  list: () => [...journalKeys.all, 'list'] as const,
  detail: (id: string) => [...journalKeys.all, 'detail', id] as const,
}

export function useJournals() {
  return useQuery({
    queryKey: journalKeys.list(),
    queryFn: async (): Promise<PaginatedResponse<JournalEntry>> => {
      const response = await api.get<PaginatedResponse<JournalEntry>>('/journal/my')
      return response.data
    },
  })
}
