import { JournalEditor } from '@/components/journal/JournalEditor'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ROUTES } from '@/constants/routes'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'New Journal Entry — BrainHealth',
}

export default function NewJournalPage() {
  return (
    <>
      <div style={{ maxWidth: 760, margin: '0 auto', marginBottom: 24 }}>
        <Link
          href={ROUTES.JOURNAL}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            color: 'rgba(0,0,0,0.4)',
            fontFamily: "'Epilogue', sans-serif",
            fontWeight: 700, fontSize: '0.9rem',
            textDecoration: 'none',
            padding: '8px 14px', borderRadius: 10,
          }}
        >
          <ArrowLeft size={16} />
          Back to journal
        </Link>
      </div>
      <JournalEditor />
    </>
  )
}
