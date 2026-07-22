import { JournalDetail } from '@/components/journal/JournalDetail'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Journal Entry — BrainHealth',
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function JournalDetailPage({ params }: PageProps) {
  const { id } = await params
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <JournalDetail id={id} />
    </div>
  )
}
