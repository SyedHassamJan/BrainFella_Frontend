import type { Metadata } from 'next'
import { Providers } from './providers'
import SmoothScroll from '@/components/effects/SmoothScroll'
import CursorBubble from '@/components/effects/CursorBubble'
import TransitionScribble from '@/components/effects/TransitionScribble'
import './globals.css'

export const metadata: Metadata = {
  title: 'BrainHealth — Mental Health Support for Students',
  description:
    'AI-powered mental health support, CBT exercises, and therapist booking for Pakistani students.',
  keywords: ['mental health', 'CBT', 'therapy', 'Pakistan', 'students'],
  openGraph: {
    title: 'BrainHealth',
    description: 'AI-powered mental health support',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          {/* Global effects that persist across all pages */}
          <SmoothScroll />
          <CursorBubble />
          <TransitionScribble />
          {children}
        </Providers>
      </body>
    </html>
  )
}
