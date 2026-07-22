import { QueryClient } from '@tanstack/react-query'
import type { ApiError } from '@/types'
import { AxiosError } from 'axios'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,        // 5 minutes
      gcTime: 1000 * 60 * 10,           // 10 minutes
      retry: (failureCount, error) => {
        const axiosError = error as AxiosError<ApiError>
        // Do not retry on 401, 403, 404
        const noRetryStatuses = [401, 403, 404]
        if (noRetryStatuses.includes(axiosError.response?.status ?? 0)) {
          return false
        }
        return failureCount < 2
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
})
