import { ApplicationForm } from '@/components/therapist/ApplicationForm'
import { AuthGuard } from '@/components/layout/AuthGuard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Therapist profile — BrainHealth',
  description: 'Submit your CV and profile for review.',
}

export default function TherapistApplicationPage() {
  return (
    <AuthGuard allowedRoles={['THERAPIST']}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <div style={{ marginBottom: 32 }}>
          <h1
            style={{
              fontFamily: "'Epilogue', sans-serif",
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 900, letterSpacing: '-1.5px',
              color: 'var(--color-dark)', lineHeight: 1, marginBottom: 10,
            }}
          >
            Your therapist profile
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontFamily: "'DM Sans', sans-serif", fontSize: '1rem' }}>
            Share your CV and a photo so our team can verify you before patients see your profile
          </p>
        </div>
        <ApplicationForm />
      </div>
    </AuthGuard>
  )
}
