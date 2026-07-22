'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { journalSchema, type JournalFormValues } from '@/schemas/journalSchema'
import { useCreateJournal } from '@/hooks/useCreateJournal'
import { CrisisAlert } from './CrisisAlert'
import { EmotionBadge } from './EmotionBadge'
import type { AxiosError } from 'axios'
import type { ApiError } from '@/types'
import { PenLine, Sparkles } from 'lucide-react'

export function JournalEditor() {
  const createJournal = useCreateJournal()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<JournalFormValues>({
    resolver: zodResolver(journalSchema),
  })

  const contentLength = watch('content', '').length

  const onSubmit = (values: JournalFormValues) => {
    createJournal.mutate(values)
  }

  const result = createJournal.data?.emotionResult
  const axiosError = createJournal.error as AxiosError<ApiError> | null
  const errorMessage = axiosError?.response?.data?.message ?? axiosError?.message

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(75,105,240,0.08)',
          border: '1px solid rgba(75,105,240,0.15)',
          borderRadius: 999, padding: '5px 14px',
          fontSize: '0.78rem', fontWeight: 700,
          color: 'var(--color-blue)',
          letterSpacing: '0.5px',
          textTransform: 'uppercase' as const,
          fontFamily: "'Epilogue', sans-serif",
          marginBottom: 14,
        }}>
          <PenLine size={12} /> Private entry
        </div>
        <h1 style={{
          fontFamily: "'Epilogue', sans-serif",
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          fontWeight: 900,
          letterSpacing: '-1.5px',
          color: 'var(--color-dark)',
          lineHeight: 1,
          marginBottom: 10,
        }}>
          New journal entry
        </h1>
        <p style={{
          color: 'var(--color-text-muted)',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '1rem',
        }}>
          Write whatever is on your mind — this is your safe space
        </p>
      </div>

      {/* Error */}
      {errorMessage && (
        <div style={{
          background: 'rgba(225,29,72,0.08)',
          border: '1px solid rgba(225,29,72,0.2)',
          borderRadius: 16, padding: '14px 18px', marginBottom: 24,
        }}>
          <p style={{ color: '#e11d48', fontSize: '0.875rem', fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
            {errorMessage}
          </p>
        </div>
      )}

      {/* Emotion result after save */}
      {result && !result.isCrisis && (
        <div style={{
          background: 'rgba(41,114,95,0.08)',
          border: '1px solid rgba(41,114,95,0.15)',
          borderRadius: 16, padding: '16px 20px', marginBottom: 24,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <Sparkles size={18} color="var(--color-mint)" />
          <div>
            <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-mint)', fontFamily: "'Epilogue', sans-serif", marginBottom: 4 }}>
              Entry saved ✓
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', fontFamily: "'DM Sans', sans-serif" }}>
                Detected emotion:
              </span>
              <EmotionBadge emotion={result.emotion} score={result.score} />
            </div>
          </div>
        </div>
      )}

      {/* Crisis alert */}
      {result?.isCrisis && <CrisisAlert />}

      <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Title card */}
        <div style={{
          background: '#fff',
          border: '1.5px solid rgba(0,0,0,0.06)',
          borderRadius: 20,
          padding: '20px 28px',
          boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
        }}>
          <label style={{
            display: 'block',
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.8px',
            textTransform: 'uppercase' as const,
            color: 'var(--color-text-dim)',
            fontFamily: "'Epilogue', sans-serif",
            marginBottom: 10,
          }}>Title</label>
          <input
            {...register('title')}
            type="text"
            placeholder="Give your entry a title (optional)"
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '1.4rem',
              fontWeight: 800,
              letterSpacing: '-0.5px',
              color: 'var(--color-dark)',
              fontFamily: "'Epilogue', sans-serif",
            }}
          />
        </div>

        {/* Content card */}
        <div style={{
          background: '#fff',
          border: '1.5px solid rgba(0,0,0,0.06)',
          borderRadius: 20,
          padding: '20px 28px',
          boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
        }}>
          <label style={{
            display: 'block',
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.8px',
            textTransform: 'uppercase' as const,
            color: 'var(--color-text-dim)',
            fontFamily: "'Epilogue', sans-serif",
            marginBottom: 10,
          }}>Your thoughts</label>
          <textarea
            {...register('content')}
            placeholder="What is on your mind today? Write freely — there is no right or wrong answer..."
            rows={14}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              resize: 'none',
              color: 'var(--color-dark)',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '1rem',
              lineHeight: 1.8,
            }}
            aria-describedby={errors.content ? 'content-error' : 'content-count'}
          />
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 12,
            marginTop: 8,
            borderTop: '1px solid rgba(0,0,0,0.06)',
          }}>
            {errors.content ? (
              <p id="content-error" style={{ color: '#e11d48', fontSize: '0.8rem', fontFamily: "'DM Sans', sans-serif" }}>
                {errors.content.message}
              </p>
            ) : (
              <span id="content-count" style={{
                color: 'var(--color-text-dim)',
                fontSize: '0.8rem',
                fontFamily: "'DM Sans', sans-serif",
              }}>
                {contentLength} / 5000 characters
              </span>
            )}
          </div>
        </div>

        {/* Submit */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 4 }}>
          <button
            type="submit"
            disabled={createJournal.isPending}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'var(--color-dark)',
              color: '#fff',
              border: 'none',
              borderRadius: 14,
              padding: '14px 32px',
              fontFamily: "'Epilogue', sans-serif",
              fontWeight: 800,
              fontSize: '1rem',
              cursor: createJournal.isPending ? 'not-allowed' : 'pointer',
              opacity: createJournal.isPending ? 0.6 : 1,
              transition: 'background 0.2s, transform 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!createJournal.isPending) {
                e.currentTarget.style.background = 'var(--color-blue)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--color-dark)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            {createJournal.isPending ? (
              <>Saving…</>
            ) : (
              <><Sparkles size={16} /> Save entry</>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
