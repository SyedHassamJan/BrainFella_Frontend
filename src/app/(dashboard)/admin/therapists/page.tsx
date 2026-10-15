import { ApplicationReview } from '@/components/admin/ApplicationReview'
import { AuthGuard } from '@/components/layout/AuthGuard'
import { ROUTES } from '@/constants/routes'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Therapist applications — BrainHealth',
  description: 'Review therapist CVs and approve profiles.',
}

export default function AdminTherapistsPage() {
  return (
    <AuthGuard allowedRoles={['ADMIN']} loginRoute={ROUTES.ADMIN_LOGIN}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: 28 }}>
          <h1
            style={{
              fontFamily: "'Epilogue', sans-serif",
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 900, letterSpacing: '-1.5px',
              color: 'var(--color-dark)', lineHeight: 1, marginBottom: 10,
            }}
          >
            Therapist applications
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontFamily: "'DM Sans', sans-serif", fontSize: '1rem' }}>
            Check each therapist&apos;s CV, photo and profile before they become visible to patients
          </p>
        </div>
        <ApplicationReview />
      </div>
    </AuthGuard>
  )
}
