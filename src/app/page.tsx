'use client'

import { Navbar } from '@/components/layout/Navbar'
import { HeroSection } from '@/components/landing/Hero'
import { HorizontalScrollWords } from '@/components/landing/HorizontalScrollWords'
import { Features } from '@/components/landing/Features'
import { StatsMarquee } from '@/components/landing/StatsMarquee'
import { Footer } from '@/components/landing/Footer'

export default function HomePage() {
  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Hero — full-viewport with animated text */}
      <header style={{ width: '100%', position: 'relative' }}>
        <HeroSection />
      </header>

      {/* Horizontal pinned scroll */}
      <HorizontalScrollWords />

      {/* Features — MotionCards tilt grid */}
      <Features />

      {/* Stats Marquee — dual vertical scrolling columns */}
      <section className="Double-marquee">
        <StatsMarquee />
      </section>

      {/* Footer */}
      <Footer />
    </>
  )
}
