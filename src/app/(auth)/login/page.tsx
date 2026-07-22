import { LoginForm } from '@/components/auth/LoginForm'
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton'
import Link from 'next/link'
import { ROUTES } from '@/constants/routes'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign in — BrainHealth',
  description: 'Sign in to your BrainHealth account and continue your mental health journey.',
}

export default function LoginPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-bg)',
      display: 'flex',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient background orbs */}
      <div style={{
        position: 'absolute',
        top: '-20%', left: '-10%',
        width: 600, height: 600,
        borderRadius: '50%',
        background: 'radial-gradient(circle, var(--color-pink) 0%, transparent 70%)',
        opacity: 0.3,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-20%', right: '-10%',
        width: 500, height: 500,
        borderRadius: '50%',
        background: 'radial-gradient(circle, var(--color-lightblue) 0%, transparent 70%)',
        opacity: 0.3,
        pointerEvents: 'none',
      }} />

      {/* Left branding panel (desktop only) */}
      <div style={{
        display: 'none',
        flex: '0 0 45%',
        background: 'var(--color-pink)',
        padding: '48px',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
      }}
        className="auth-left-panel"
      >
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', top: '20%', right: '-60px',
          width: 300, height: 300, borderRadius: '50%',
          border: '1px solid rgba(0,0,0,0.1)',
        }} />
        <div style={{
          position: 'absolute', top: '25%', right: '-100px',
          width: 400, height: 400, borderRadius: '50%',
          border: '1px solid rgba(0,0,0,0.05)',
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
          <blockquote style={{
            fontFamily: "'Epilogue', sans-serif",
            fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
            fontWeight: 700, lineHeight: 1.1,
            color: 'var(--color-dark)', marginBottom: 20,
            letterSpacing: '-1px'
          }}>
            &ldquo;Taking care of your mental health is an act of courage, not weakness.&rdquo;
          </blockquote>
          <p style={{ color: 'var(--color-dark)', opacity: 0.7, fontSize: '1rem' }}>
            Join thousands of students on their journey to better wellbeing
          </p>
        </div>

        <p style={{ color: 'var(--color-dark)', opacity: 0.5, fontSize: '0.85rem' }}>
          Crisis support: 0317-4288665
        </p>
      </div>

      {/* Right — form panel */}
      <div style={{
        flex: 1, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        padding: '40px 24px',
      }}>
        <div style={{ width: '100%', maxWidth: 460 }}>
          {/* Back to home */}
          <Link
            href={ROUTES.HOME}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              color: 'var(--color-text-muted)',
              fontFamily: "'Epilogue', sans-serif",
              fontSize: '0.9rem', fontWeight: 500,
              textDecoration: 'none', marginBottom: 40,
              transition: 'color 0.2s',
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
              Welcome back
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem' }}>
              Sign in to continue your <span style={{ color: 'var(--color-blue)', fontWeight: 700 }}>journey</span>
            </p>
          </div>

          <div className="auth-card" style={{ padding: '36px 32px', background: '#fff', borderRadius: '24px', boxShadow: '0 8px 30px rgba(0,0,0,0.05)' }}>
            <LoginForm />

            <div style={{
              display: 'flex', alignItems: 'center', gap: 16,
              margin: '24px 0',
            }}>
              <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
              <span style={{ color: 'var(--color-text-dim)', fontSize: '0.85rem', fontFamily: "'DM Sans', sans-serif" }}>or</span>
              <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
            </div>

            <GoogleAuthButton />
          </div>

          <p style={{
            textAlign: 'center', marginTop: 24,
            color: 'var(--color-text-muted)',
            fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem',
          }}>
            Don&apos;t have an account?{' '}
            <Link
              href={ROUTES.SIGNUP}
              style={{ color: 'var(--color-blue)', fontWeight: 700, textDecoration: 'none' }}
            >
              Create one free →
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
