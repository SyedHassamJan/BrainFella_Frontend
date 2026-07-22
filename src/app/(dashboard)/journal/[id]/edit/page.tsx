import { JournalEditForm } from '@/components/journal/JournalEditForm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ROUTES } from '@/constants/routes'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Edit Journal Entry — BrainHealth',
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function JournalEditPage({ params }: PageProps) {
  const { id } = await params

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <Link
          href={ROUTES.JOURNAL_DETAIL(id)}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to entry
        </Link>
      </div>
      <JournalEditForm id={id} />
    </div>
  )
}
