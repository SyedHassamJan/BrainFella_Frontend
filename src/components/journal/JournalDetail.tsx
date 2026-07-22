'use client'

import { useJournalDetail } from '@/hooks/useJournalDetail'
import { Spinner } from '@/components/ui/Spinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { EmotionBadge } from './EmotionBadge'
import { AlertTriangle, ArrowLeft, Pencil, Calendar, Clock } from 'lucide-react'
import Link from 'next/link'
import { ROUTES } from '@/constants/routes'

interface JournalDetailProps {
  id: string
}

export function JournalDetail({ id }: JournalDetailProps) {
  const { data: entry, isLoading, isError, error } = useJournalDetail(id)

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
        <Spinner size="lg" />
      </div>
    )
  }

  if (isError || !entry) {
    return <ErrorMessage message={error?.message ?? 'Failed to load journal entry'} />
  }

  const dateObj = new Date(entry.createdAt)
  const dateStr = dateObj.toLocaleDateString('en-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  const timeStr = dateObj.toLocaleTimeString('en-PK', { hour: 'numeric', minute: '2-digit', hour12: true })

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      {/* Back + Edit */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <Link
          href={ROUTES.JOURNAL}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            color: 'rgba(0,0,0,0.45)',
            fontFamily: "'Epilogue', sans-serif",
            fontWeight: 700, fontSize: '0.9rem',
            textDecoration: 'none',
            padding: '8px 14px', borderRadius: 10,
            transition: 'background 0.2s',
            background: 'transparent',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.05)'; e.currentTarget.style.color = 'var(--color-dark)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(0,0,0,0.45)' }}
        >
          <ArrowLeft size={16} />
          Back to journal
        </Link>

        <Link
          href={ROUTES.JOURNAL_EDIT(entry.id)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'var(--color-dark)',
            color: '#fff',
            fontFamily: "'Epilogue', sans-serif",
            fontWeight: 700, fontSize: '0.875rem',
            textDecoration: 'none',
            padding: '9px 18px', borderRadius: 10,
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-blue)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--color-dark)' }}
        >
          <Pencil size={14} />
          Edit entry
        </Link>
      </div>

      {/* Article card */}
      <article style={{
        background: '#ffffff',
        border: '1.5px solid rgba(0,0,0,0.06)',
        borderRadius: 24,
        padding: '40px 48px',
        boxShadow: '0 4px 40px rgba(0,0,0,0.04)',
      }}>
        {/* Meta row */}
        <header style={{ marginBottom: 32, paddingBottom: 28, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 18 }}>
            {/* Date */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(0,0,0,0.03)',
              border: '1px solid rgba(0,0,0,0.06)',
              borderRadius: 999, padding: '5px 12px',
              color: 'rgba(0,0,0,0.5)',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.8rem', fontWeight: 500,
            }}>
              <Calendar size={12} />
              {dateStr}
            </div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(0,0,0,0.03)',
              border: '1px solid rgba(0,0,0,0.06)',
              borderRadius: 999, padding: '5px 12px',
              color: 'rgba(0,0,0,0.5)',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.8rem', fontWeight: 500,
            }}>
              <Clock size={12} />
              {timeStr}
            </div>

            {/* Emotion */}
            {entry.detectedEmotion && (
              <EmotionBadge emotion={entry.detectedEmotion} score={entry.emotionScore} />
            )}

            {/* Crisis */}
            {entry.isCrisis && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                background: 'rgba(225,29,72,0.08)',
                border: '1px solid rgba(225,29,72,0.2)',
                color: '#e11d48',
                fontFamily: "'Epilogue', sans-serif",
                fontSize: '0.75rem', fontWeight: 700,
                padding: '5px 12px', borderRadius: 999,
              }}>
                <AlertTriangle size={12} />
                Crisis flagged
              </span>
            )}
          </div>

          <h1 style={{
            fontFamily: "'Epilogue', sans-serif",
            fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
            fontWeight: 900,
            letterSpacing: '-1px',
            color: 'var(--color-dark)',
            lineHeight: 1.1,
            margin: 0,
          }}>
            {entry.title || 'Untitled Entry'}
          </h1>
        </header>

        {/* Content */}
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '1.05rem',
          lineHeight: 1.85,
          color: 'rgba(0,0,0,0.7)',
          whiteSpace: 'pre-wrap',
        }}>
          {entry.content}
        </div>

        {/* Therapist Comment */}
        {entry.therapistComment && (
          <div style={{
            marginTop: 40, paddingTop: 32,
            borderTop: '1px solid rgba(0,0,0,0.06)',
          }}>
            <div style={{
              background: 'rgba(75,105,240,0.05)',
              border: '1px solid rgba(75,105,240,0.12)',
              borderRadius: 16, padding: '20px 24px',
            }}>
              <h3 style={{
                fontFamily: "'Epilogue', sans-serif",
                fontWeight: 800, fontSize: '0.9rem',
                color: 'var(--color-blue)',
                margin: '0 0 10px 0',
                letterSpacing: '0.3px',
              }}>
                Therapist Note
              </h3>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.95rem',
                color: 'rgba(0,0,0,0.6)',
                lineHeight: 1.7,
                margin: 0,
              }}>
                {entry.therapistComment}
              </p>
            </div>
          </div>
        )}
      </article>
    </div>
  )
}
