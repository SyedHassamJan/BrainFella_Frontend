'use client'

import { Bell, Calendar, Check, HeartHandshake, Mail, TriangleAlert } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Spinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { useMarkNotificationRead, useNotifications } from '@/hooks/useNotifications'
import { sortNotifications, timeAgo } from '@/lib/notificationUtils'
import type { AppNotification } from '@/types'

const AMBER = '#d97706'

function iconFor(type: string): { Icon: LucideIcon; color: string; bg: string } {
  if (type === 'CRISIS_ALERT') return { Icon: TriangleAlert, color: AMBER, bg: 'rgba(245,158,11,0.14)' }
  if (type === 'CRISIS_DETECTED') return { Icon: HeartHandshake, color: '#c2410c', bg: 'rgba(234,88,12,0.10)' }
  if (type.startsWith('APPOINTMENT')) return { Icon: Calendar, color: '#4f7cff', bg: 'rgba(79,124,255,0.1)' }
  if (type === 'REPORT_SENT') return { Icon: Mail, color: '#29725f', bg: 'rgba(41,114,95,0.1)' }
  return { Icon: Bell, color: '#64748b', bg: 'rgba(100,116,139,0.1)' }
}

function NotificationCard({ n, onRead }: { n: AppNotification; onRead: (id: string) => void }) {
  const { Icon, color, bg } = iconFor(n.type)
  const urgent = n.type === 'CRISIS_ALERT' && !n.isRead

  return (
    <div
      style={{
        display: 'flex', gap: 16, alignItems: 'flex-start',
        background: urgent ? 'rgba(251,191,36,0.10)' : '#fff',
        border: '1px solid rgba(0,0,0,0.06)',
        borderLeft: urgent ? `4px solid ${AMBER}` : '1px solid rgba(0,0,0,0.06)',
        borderRadius: 16, padding: '18px 20px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.03)',
        opacity: n.isRead ? 0.78 : 1,
      }}
    >
      <div style={{ width: 42, height: 42, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon style={{ width: 20, height: 20, color }} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
          <span style={{ fontFamily: "'Epilogue', sans-serif", fontWeight: 800, fontSize: '1rem', color: 'var(--color-dark)' }}>
            {n.title}
          </span>
          {urgent ? (
            <span style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#92400e', background: 'rgba(245,158,11,0.22)', borderRadius: 999, padding: '3px 10px', fontFamily: "'Epilogue', sans-serif" }}>
              Needs attention
            </span>
          ) : null}
          {!n.isRead && !urgent ? <span aria-label="Unread" style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-blue)' }} /> : null}
        </div>
        <p style={{ color: 'var(--color-text-muted)', fontFamily: "'DM Sans', sans-serif", fontSize: '0.92rem', lineHeight: 1.5, margin: 0 }}>
          {n.message}
        </p>
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <span style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem', fontFamily: "'DM Sans', sans-serif" }}>{timeAgo(n.createdAt)}</span>
          {!n.isRead ? (
            <button
              onClick={() => onRead(n.id)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'transparent', border: '1px solid rgba(0,0,0,0.12)', borderRadius: 999, padding: '4px 12px', cursor: 'pointer', fontFamily: "'Epilogue', sans-serif", fontWeight: 700, fontSize: '0.78rem', color: 'var(--color-dark)' }}
            >
              <Check style={{ width: 13, height: 13 }} />
              Mark as read
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export function NotificationList() {
  const { data, isLoading, isError, error } = useNotifications()
  const markRead = useMarkNotificationRead()

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
        <Spinner size="lg" />
      </div>
    )
  }
  if (isError) return <ErrorMessage message={error?.message ?? 'Failed to load notifications'} />
  if (!data?.length) {
    return <EmptyState icon={Bell} title="You're all caught up" description="When there is something for you, such as an appointment update or a patient who may need support, it will appear here." />
  }

  const hasAlert = data.some((n) => n.type === 'CRISIS_ALERT')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {hasAlert ? (
        <p style={{ color: 'var(--color-text-muted)', fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem', lineHeight: 1.5, margin: '0 0 6px' }}>
          A crisis alert means a patient you work with may need support right now. It names them but never shares what
          they wrote. Please check in with them directly.
        </p>
      ) : null}
      {sortNotifications(data).map((n) => (
        <NotificationCard key={n.id} n={n} onRead={(id) => markRead.mutate(id)} />
      ))}
    </div>
  )
}
