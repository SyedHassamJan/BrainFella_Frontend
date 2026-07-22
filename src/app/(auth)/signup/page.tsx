import { SignupForm } from '@/components/auth/SignupForm'
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton'
import Link from 'next/link'
import { ROUTES } from '@/constants/routes'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create account — BrainHealth',
  description: 'Create your free BrainHealth account and start your mental health journey today.',
}

const stats = [
  { value: '500+', label: 'Active students' },
  { value: '15+', label: 'Therapists' },
  { value: '10k+', label: 'Sessions done' },
  { value: '98%', label: 'Satisfaction' },
]

export default function SignupPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-bg)',
      display: 'flex',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient orbs */}
      <div style={{
        position: 'absolute', top: '-15%', right: '-5%',
        width: 700, height: 700, borderRadius: '50%',
        background: 'radial-gradient(circle, var(--color-lightgreen) 0%, transparent 70%)',
        opacity: 0.5, pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-20%', left: '-10%',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, var(--color-blue) 0%, transparent 70%)',
        opacity: 0.15, pointerEvents: 'none',
      }} />

      {/* Left branding panel */}
      <div style={{
        display: 'none',
        flex: '0 0 45%',
        background: 'var(--color-lightgreen)',
        padding: '48px',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
      }}
        className="auth-left-panel"
      >
        <div style={{
          position: 'absolute', bottom: '-60px', right: '-60px',
          width: 400, height: 400, borderRadius: '50%',
          border: '1px solid rgba(0,0,0,0.05)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-100px', right: '-100px',
          width: 550, height: 550, borderRadius: '50%',
          border: '1px solid rgba(0,0,0,0.03)',
        }} />

        <Link
          href={ROUTES.HOME}
          style={{
            fontFamily: "'Epilogue', sans-serif",
            fontWeight: 900, fontSize: '1.6rem',
            letterSpacing: '-0.5px', color: 'var(--color-dark)',
            textDecoration: 'none', display: 'flex',
            alignItems: 'center', gap: 10,
          }}
        >
          <div style={{
            width: 38, height: 38,
            background: 'var(--color-dark)',
            color: '#fff',
            borderRadius: 10, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: '1.1rem', fontWeight: 900,
          }}>B</div>
          BrainHealth
        </Link>

        <div>
          <h2 style={{
            fontFamily: "'Epilogue', sans-serif",
            fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
            fontWeight: 900, letterSpacing: '-1.5px',
            color: 'var(--color-dark)', lineHeight: 1.1, marginBottom: 16,
          }}>
            Your mental health<br />journey starts today
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', lineHeight: 1.6, fontWeight: 500 }}>
            Join thousands of Pakistani students who are taking control of their mental wellbeing.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 32 }}>
            {stats.map(({ value, label }) => (
              <div key={label} style={{
                background: 'rgba(255,255,255,0.4)',
                border: '1px solid rgba(255,255,255,0.6)',
                borderRadius: 16, padding: '18px 20px',
              }}>
                <div style={{
                  fontFamily: "'Epilogue', sans-serif",
                  fontSize: '1.8rem', fontWeight: 900,
                  color: 'var(--color-dark)', letterSpacing: '-1px',
                }}>{value}</div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginTop: 2, fontWeight: 600 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        <p style={{ color: 'rgba(0,0,0,0.3)', fontSize: '0.85rem', fontWeight: 600 }}>
          Crisis support: 0317-4288665
        </p>
      </div>

      {/* Right — form panel */}
      <div style={{
        flex: 1, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        padding: '40px 24px', overflowY: 'auto',
      }}>
        <div style={{ width: '100%', maxWidth: 480, paddingBottom: 40 }}>
          <Link
            href={ROUTES.HOME}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              color: 'var(--color-text-muted)',
              fontFamily: "'Epilogue', sans-serif",
              fontSize: '0.9rem', fontWeight: 500,
              textDecoration: 'none', marginBottom: 40,
            }}
          >
            ← Back to home
          </Link>

          <div style={{ marginBottom: 36 }}>
            <h1 style={{
              fontFamily: "'Epilogue', sans-serif",
              fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
              fontWeight: 900, letterSpacing: '-1.5px',
              color: 'var(--color-dark)', marginBottom: 10,
            }}>
              Create your account
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem' }}>
              Free forever —{' '}
              <span style={{ color: 'var(--color-blue)', fontWeight: 700 }}>no credit card needed</span>
            </p>
          </div>

          <div className="auth-card" style={{ padding: '36px 32px', background: '#fff', borderRadius: '24px', boxShadow: '0 8px 30px rgba(0,0,0,0.05)' }}>
            <SignupForm />

            <div style={{
              display: 'flex', alignItems: 'center', gap: 16,
              margin: '24px 0',
            }}>
              <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
              <span style={{ color: 'var(--color-text-dim)', fontSize: '0.85rem', fontWeight: 500 }}>or</span>
              <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
            </div>

            <GoogleAuthButton />
          </div>

          <p style={{
            textAlign: 'center', marginTop: 24,
            color: 'var(--color-text-muted)',
            fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem',
          }}>
            Already have an account?{' '}
            <Link href={ROUTES.LOGIN} style={{ color: 'var(--color-blue)', fontWeight: 700, textDecoration: 'none' }}>
              Sign in →
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .auth-left-panel { display: flex !important; }
        }
      `}</style>
    </div>
  )
}
