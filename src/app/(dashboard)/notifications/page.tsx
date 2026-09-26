import { NotificationList } from '@/components/notifications/NotificationList'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Notifications — BrainHealth',
  description: 'Appointment updates and alerts.',
}

export default function NotificationsPage() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontFamily: "'Epilogue', sans-serif",
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 900, letterSpacing: '-1.5px',
            color: 'var(--color-dark)', lineHeight: 1, marginBottom: 10,
          }}
        >
          Notifications
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontFamily: "'DM Sans', sans-serif", fontSize: '1rem' }}>
          Appointment updates and alerts that need your attention
        </p>
      </div>
      <NotificationList />
    </div>
  )
}
