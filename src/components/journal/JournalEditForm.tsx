'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useJournalDetail } from '@/hooks/useJournalDetail'
import { useUpdateJournal } from '@/hooks/useUpdateJournal'
import { Spinner } from '@/components/ui/Spinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import type { AxiosError } from 'axios'
import type { ApiError } from '@/types'
import { PenLine, Check } from 'lucide-react'

const editSchema = z.object({
  title: z.string().max(100, 'Title too long').optional().or(z.literal('')),
  content: z
    .string()
    .min(10, 'Entry must be at least 10 characters')
    .max(5000, 'Entry too long'),
})

type EditFormValues = z.infer<typeof editSchema>

interface JournalEditFormProps {
  id: string
}

export function JournalEditForm({ id }: JournalEditFormProps) {
  const { data: entry, isLoading: isFetching, isError } = useJournalDetail(id)
  const updateJournal = useUpdateJournal()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<EditFormValues>({
    resolver: zodResolver(editSchema),
    values: entry
      ? { title: entry.title ?? '', content: entry.content }
      : undefined,
  })

  const contentLength = watch('content', '')?.length ?? 0

  if (isFetching) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
        <Spinner size="lg" />
      </div>
    )
  }

  if (isError || !entry) {
    return <ErrorMessage message="Could not load journal entry" />
  }

  const onSubmit = (values: EditFormValues) => {
    updateJournal.mutate({
      id,
      title: values.title || undefined,
      content: values.content,
    })
  }

  const axiosError = updateJournal.error as AxiosError<ApiError> | null
  const errorMessage = axiosError?.response?.data?.message ?? axiosError?.message

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(245,105,60,0.08)',
          border: '1px solid rgba(245,105,60,0.2)',
          borderRadius: 999, padding: '5px 14px',
          fontSize: '0.78rem', fontWeight: 700,
          color: 'var(--color-rose)',
          letterSpacing: '0.5px',
          textTransform: 'uppercase' as const,
          fontFamily: "'Epilogue', sans-serif",
          marginBottom: 14,
        }}>
          <PenLine size={12} /> Editing entry
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
          Edit journal entry
        </h1>
        <p style={{
          color: 'var(--color-text-muted)',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '1rem',
        }}>
          Make changes and save when you are done
        </p>
      </div>

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

      {updateJournal.isSuccess && (
        <div style={{
          background: 'rgba(41,114,95,0.08)',
          border: '1px solid rgba(41,114,95,0.18)',
          borderRadius: 16, padding: '14px 18px', marginBottom: 24,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <Check size={16} color="var(--color-mint)" />
          <p style={{ color: 'var(--color-mint)', fontSize: '0.875rem', fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>
            Changes saved!
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Title */}
        <div style={{
          background: '#fff',
          border: '1.5px solid rgba(0,0,0,0.06)',
          borderRadius: 20,
          padding: '20px 28px',
          boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
        }}>
          <label style={{
            display: 'block',
            fontSize: '0.75rem', fontWeight: 700,
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
              background: 'transparent', border: 'none', outline: 'none',
              fontSize: '1.4rem', fontWeight: 800,
              letterSpacing: '-0.5px',
              color: 'var(--color-dark)',
              fontFamily: "'Epilogue', sans-serif",
            }}
          />
        </div>

        {/* Content */}
        <div style={{
          background: '#fff',
          border: '1.5px solid rgba(0,0,0,0.06)',
          borderRadius: 20,
          padding: '20px 28px',
          boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
        }}>
          <label style={{
            display: 'block',
            fontSize: '0.75rem', fontWeight: 700,
            letterSpacing: '0.8px',
            textTransform: 'uppercase' as const,
            color: 'var(--color-text-dim)',
            fontFamily: "'Epilogue', sans-serif",
            marginBottom: 10,
          }}>Your thoughts</label>
          <textarea
            {...register('content')}
            rows={14}
            style={{
              width: '100%',
              background: 'transparent', border: 'none', outline: 'none', resize: 'none',
              color: 'var(--color-dark)',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '1rem', lineHeight: 1.8,
            }}
          />
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            paddingTop: 12, marginTop: 8,
            borderTop: '1px solid rgba(0,0,0,0.06)',
          }}>
            {errors.content ? (
              <p style={{ color: '#e11d48', fontSize: '0.8rem', fontFamily: "'DM Sans', sans-serif" }}>
                {errors.content.message}
              </p>
            ) : (
              <span style={{ color: 'var(--color-text-dim)', fontSize: '0.8rem', fontFamily: "'DM Sans', sans-serif" }}>
                {contentLength} / 5000 characters
              </span>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, paddingTop: 4 }}>
          <button
            type="button"
            onClick={() => window.history.back()}
            style={{
              padding: '12px 24px', borderRadius: 14,
              border: '1.5px solid rgba(0,0,0,0.12)',
              background: 'transparent',
              color: 'var(--color-dark)',
              fontFamily: "'Epilogue', sans-serif",
              fontWeight: 700, fontSize: '0.95rem',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.04)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={updateJournal.isPending}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'var(--color-dark)',
              color: '#fff', border: 'none',
              borderRadius: 14, padding: '12px 30px',
              fontFamily: "'Epilogue', sans-serif",
              fontWeight: 800, fontSize: '0.95rem',
              cursor: updateJournal.isPending ? 'not-allowed' : 'pointer',
              opacity: updateJournal.isPending ? 0.6 : 1,
              transition: 'background 0.2s, transform 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!updateJournal.isPending) {
                e.currentTarget.style.background = 'var(--color-blue)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--color-dark)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            {updateJournal.isPending ? 'Saving…' : <><Check size={15} /> Save changes</>}
          </button>
        </div>
      </form>
    </div>
  )
}
