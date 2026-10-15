import { PatientsDashboard } from '@/components/therapist/PatientsDashboard'
import { AuthGuard } from '@/components/layout/AuthGuard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Patients — BrainHealth',
  description: 'Your patients and the records they share with you.',
}

export default function TherapistPatientsPage() {
  return (
    <AuthGuard allowedRoles={['THERAPIST']}>
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
            Patients
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontFamily: "'DM Sans', sans-serif", fontSize: '1rem' }}>
            People who share their records with you or have a confirmed session, and those who reached out on WhatsApp
          </p>
        </div>
        <PatientsDashboard />
      </div>
    </AuthGuard>
  )
}
