import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import type { AppNotification } from '@/types'

export const notificationKeys = {
  all: ['notifications'] as const,
  mine: () => [...notificationKeys.all, 'mine'] as const,
}

/** The signed-in user's notifications, newest first. Refreshes once a minute while the app is open. */
export function useNotifications(enabled = true) {
  return useQuery({
    queryKey: notificationKeys.mine(),
    queryFn: async (): Promise<AppNotification[]> => {
      const response = await api.get<AppNotification[]>('/notification/my')
      return response.data
    },
    enabled,
    refetchInterval: 60_000,
  })
}

export function useUnreadNotificationCount(enabled = true) {
  const { data } = useNotifications(enabled)
  return data?.filter((n) => !n.isRead).length ?? 0
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.patch(`/notification/${id}/read`)
    },
    // Optimistic: the item reads as done immediately; rolled back if the request fails.
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.mine() })
      const previous = queryClient.getQueryData<AppNotification[]>(notificationKeys.mine())
      queryClient.setQueryData<AppNotification[]>(notificationKeys.mine(), (list) =>
        list?.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      )
      return { previous }
    },
    onError: (_error, _id, context) => {
      if (context?.previous) queryClient.setQueryData(notificationKeys.mine(), context.previous)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: notificationKeys.mine() }),
  })
}
