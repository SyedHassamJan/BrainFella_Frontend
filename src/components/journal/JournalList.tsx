'use client'

import { useJournals } from '@/hooks/useJournals'
import { JournalCard } from './JournalCard'
import { Spinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { BookOpen } from 'lucide-react'
import Link from 'next/link'
import { ROUTES } from '@/constants/routes'

export function JournalList() {
  const { data, isLoading, isError, error } = useJournals()

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
        <Spinner size="lg" />
      </div>
    )
  }

  if (isError) {
    return <ErrorMessage message={error?.message ?? 'Failed to load journal entries'} />
  }

  if (!data?.entries.length) {
    return (
      <EmptyState
        icon={BookOpen}
        title="No journal entries yet"
        description="Start writing — your first entry could be about how you are feeling right now"
        action={
          <Link
            href={ROUTES.JOURNAL_NEW}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'var(--color-dark)',
              color: '#fff', textDecoration: 'none',
              padding: '12px 24px', borderRadius: 12,
              fontFamily: "'Epilogue', sans-serif",
              fontWeight: 700, fontSize: '0.95rem',
            }}
          >
            Write your first entry
          </Link>
        }
      />
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {data.entries.map((entry) => (
        <JournalCard key={entry.id} entry={entry} />
      ))}
    </div>
  )
}
