import { useCallback, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  fetchNotifications,
  fetchUnreadNotificationCount,
  markNotificationRead as markNotificationReadRequest,
  markAllNotificationsRead as markAllNotificationsReadRequest,
} from '../services/notifications'
import { useAuth } from './useAuth'
import { connectSocket, disconnectSocket } from '../lib/socket'
import { unwrap } from '../lib/queryClient'
import { queryKeys } from '../lib/queryKeys'

export default function useNotifications({ auto = true } = {}) {
  const { isAuthenticated } = useAuth()
  const queryClient = useQueryClient()

  const listQuery = useQuery({
    queryKey: queryKeys.notifications.list,
    queryFn: () => unwrap(fetchNotifications({ limit: 20 })),
    select: (data) => data.notifications,
    enabled: auto && isAuthenticated,
  })

  const unreadQuery = useQuery({
    queryKey: queryKeys.notifications.unreadCount,
    queryFn: () => unwrap(fetchUnreadNotificationCount()),
    select: (data) => data.count,
    enabled: auto && isAuthenticated,
  })

  useEffect(() => {
    if (!auto || !isAuthenticated) return

    const socket = connectSocket()

    function handleNew(notification) {
      queryClient.setQueryData(queryKeys.notifications.list, prev =>
        prev ? { ...prev, notifications: [notification, ...prev.notifications] } : prev
      )
      queryClient.setQueryData(queryKeys.notifications.unreadCount, prev =>
        prev ? { ...prev, count: (prev.count ?? 0) + 1 } : prev
      )
    }

    socket.on('notification:new', handleNew)

    return () => {
      socket.off('notification:new', handleNew)
      disconnectSocket()
    }
  }, [auto, isAuthenticated, queryClient])

  const markReadMutation = useMutation({
    mutationFn: (id) => unwrap(markNotificationReadRequest(id)),
    onSuccess: (_, id) => {
      queryClient.setQueryData(queryKeys.notifications.list, prev =>
        prev ? {
          ...prev,
          notifications: prev.notifications.map(n =>
            n.id === id ? { ...n, read_at: n.read_at ?? new Date().toISOString() } : n
          ),
        } : prev
      )
      queryClient.setQueryData(queryKeys.notifications.unreadCount, prev =>
        prev ? { ...prev, count: Math.max(0, (prev.count ?? 0) - 1) } : prev
      )
    },
  })

  const markAllReadMutation = useMutation({
    mutationFn: () => unwrap(markAllNotificationsReadRequest()),
    onSuccess: () => {
      queryClient.setQueryData(queryKeys.notifications.list, prev =>
        prev ? {
          ...prev,
          notifications: prev.notifications.map(n => ({ ...n, read_at: n.read_at ?? new Date().toISOString() })),
        } : prev
      )
      queryClient.setQueryData(queryKeys.notifications.unreadCount, prev => prev ? { ...prev, count: 0 } : prev)
    },
  })

  const markRead = useCallback(
    (id) => markReadMutation.mutateAsync(id).catch(() => {}),
    [markReadMutation]
  )

  const markAllRead = useCallback(
    () => markAllReadMutation.mutateAsync().catch(() => {}),
    [markAllReadMutation]
  )

  return {
    notifications: listQuery.data ?? [],
    unreadCount: unreadQuery.data ?? 0,
    loading: listQuery.isLoading,
    markRead,
    markAllRead,
  }
}
