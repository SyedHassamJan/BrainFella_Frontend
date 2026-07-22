'use client'

import Link from 'next/link'
import { AlertTriangle, ChevronRight, Calendar, Clock } from 'lucide-react'
import type { JournalEntry } from '@/types'
import { EmotionBadge } from './EmotionBadge'
import { ROUTES } from '@/constants/routes'

interface JournalCardProps {
  entry: JournalEntry
}

export function JournalCard({ entry }: JournalCardProps) {
  const dateObj = new Date(entry.createdAt)
  const dateStr = dateObj.toLocaleDateString('en-PK', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const timeStr = dateObj.toLocaleTimeString('en-PK', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

  const preview = entry.content.slice(0, 150) + (entry.content.length > 150 ? '...' : '')

  return (
    <Link
      href={ROUTES.JOURNAL_DETAIL(entry.id)}
      style={{
        display: 'block',
        background: '#ffffff',
        border: '1.5px solid rgba(0, 0, 0, 0.05)',
        borderRadius: 20,
        padding: '24px 28px',
        marginBottom: 16,
        textDecoration: 'none',
        transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
      }}
      className="journal-card-hover-el"
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.12)'
        e.currentTarget.style.transform = 'translateY(-3px)'
        e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.05)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.05)'
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.02)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          
          {/* Header row: Title / Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10, flexWrap: 'wrap' }}>
            <h2 style={{
              fontFamily: "'Epilogue', sans-serif",
              fontSize: '1.25rem',
              fontWeight: 800,
              color: 'var(--color-dark)',
              margin: 0,
              letterSpacing: '-0.3px',
              lineHeight: 1.2,
            }}>
              {entry.title || 'Untitled Entry'}
            </h2>

            {entry.isCrisis && (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                background: 'rgba(225,29,72,0.1)',
                color: '#e11d48',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: 999,
                fontFamily: "'Epilogue', sans-serif",
              }}>
                <AlertTriangle size={12} />
                Crisis flagged
              </span>
            )}
          </div>

          {/* Body content preview */}
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.925rem',
            color: 'var(--color-text-muted)',
            lineHeight: 1.6,
            marginBottom: 16,
            margin: '0 0 16px 0',
          }}>
            {preview}
          </p>

          {/* Footer Metadata */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            {/* Date and Time */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: 'var(--color-text-dim)',
              fontSize: '0.8rem',
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
            }}>
              <Calendar size={13} style={{ opacity: 0.7 }} />
              <span>{dateStr}</span>
              <span style={{ opacity: 0.4 }}>•</span>
              <Clock size={13} style={{ opacity: 0.7 }} />
              <span>{timeStr}</span>
            </div>

            {/* Emotion Badge */}
            {entry.detectedEmotion && (
              <EmotionBadge emotion={entry.detectedEmotion} score={entry.emotionScore} />
            )}

            {/* Therapist notification */}
            {entry.therapistComment && (
              <span style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                background: 'rgba(75,105,240,0.08)',
                color: 'var(--color-blue)',
                padding: '4px 10px',
                borderRadius: 999,
                fontFamily: "'Epilogue', sans-serif",
              }}>
                Therapist commented
              </span>
            )}
          </div>

        </div>

        {/* Right Arrow icon */}
        <div style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.02)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginTop: 2,
          transition: 'background 0.2s',
        }}
        className="card-arrow-icon"
        >
          <ChevronRight size={18} style={{ color: 'var(--color-text-dim)' }} />
        </div>
      </div>
    </Link>
  )
}
