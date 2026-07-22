import Link from 'next/link'
import { Plus, BookOpen, TrendingUp, Flame } from 'lucide-react'
import { JournalList } from '@/components/journal/JournalList'
import { ROUTES } from '@/constants/routes'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Journal — BrainHealth',
  description: 'Your private mental health journal. Write freely and let our AI detect your emotional state.',
}

const quickStats = [
  { icon: BookOpen, label: 'Total Entries', value: '—', color: '#4f7cff', bg: 'rgba(79,124,255,0.1)' },
  { icon: Flame, label: 'Day Streak', value: '—', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)' },
  { icon: TrendingUp, label: 'This Week', value: '—', color: '#29725f', bg: 'rgba(41,114,95,0.1)' },
]

export default function JournalPage() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>


        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'flex-start',
          justifyContent: 'space-between', marginBottom: 40,
          flexWrap: 'wrap', gap: 16,
        }}>
          <div>
            <div style={{
              display: 'inline-block',
              background: 'rgba(41,114,95,0.1)',
              border: '1px solid rgba(41,114,95,0.2)',
              borderRadius: 50, padding: '4px 14px',
              fontSize: '0.8rem', fontWeight: 600,
              color: 'var(--color-mint)',
              marginBottom: 12,
              letterSpacing: '0.5px',
              textTransform: 'uppercase' as const,
              fontFamily: "'Epilogue', sans-serif",
            }}>
              Private & secure
            </div>
            <h1 style={{
              fontFamily: "'Epilogue', sans-serif",
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 900, letterSpacing: '-1.5px',
              color: 'var(--color-dark)', lineHeight: 1, marginBottom: 10,
            }}>
              Your Journal
            </h1>
            <p style={{
              color: 'var(--color-text-muted)',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '1rem',
            }}>
              Write freely — our AI gently detects your emotional state
            </p>
          </div>

          <Link
            href={ROUTES.JOURNAL_NEW}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'var(--color-dark)',
              color: '#fff', border: 'none',
              borderRadius: 14, padding: '14px 24px',
              fontFamily: "'Epilogue', sans-serif",
              fontWeight: 800, fontSize: '1rem',
              textDecoration: 'none',
              transition: 'background 0.2s, transform 0.2s',
              whiteSpace: 'nowrap' as const,
            }}
          >
            <Plus style={{ width: 18, height: 18 }} />
            New Entry
          </Link>
        </div>

        {/* Quick stat cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 12, marginBottom: 40,
        }}>
          {quickStats.map(({ icon: Icon, label, value, color, bg }) => (
            <div key={label} style={{
              background: '#fff',
              border: '1px solid rgba(0,0,0,0.05)',
              borderRadius: 16, padding: '20px 24px',
              display: 'flex', alignItems: 'center', gap: 14,
              boxShadow: '0 8px 30px rgba(0,0,0,0.03)'
            }}>
              <div style={{
                width: 44, height: 44, background: bg,
                borderRadius: 12, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon style={{ width: 20, height: 20, color }} />
              </div>
              <div>
                <div style={{
                  fontFamily: "'Epilogue', sans-serif",
                  fontWeight: 900, fontSize: '1.5rem',
                  color: 'var(--color-dark)', letterSpacing: '-0.5px',
                }}>{value}</div>
                <div style={{
                  color: 'var(--color-text-muted)',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '0.8rem', marginTop: 2, fontWeight: 500
                }}>{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Section heading */}
        <div style={{
          display: 'flex', alignItems: 'center',
          gap: 12, marginBottom: 20,
        }}>
          <h2 style={{
            fontFamily: "'Epilogue', sans-serif",
            fontSize: '1.1rem', fontWeight: 800,
            color: 'var(--color-dark)', letterSpacing: '-0.3px',
          }}>
            Recent entries
          </h2>
          <div style={{
            flex: 1, height: 1,
            background: 'rgba(0,0,0,0.1)',
          }} />
        </div>

        {/* Journal list */}
        <JournalList />
    </div>
  )
}
