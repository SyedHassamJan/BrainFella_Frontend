'use client'

import { useLayoutEffect, useEffect, useState } from 'react'
import { gsap } from 'gsap'

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const stats = [
  { number: '10k+', label: 'Journal entries written', color: '#1a3a6c' },
  { number: '98%', label: 'Student satisfaction', color: '#1a4a3a' },
  { number: '500+', label: 'Active students', color: '#3a1a6c' },
  { number: '15+', label: 'Verified therapists', color: '#4a1a2a' },
  { number: '30k+', label: 'Mood logs tracked', color: '#1a3a6c' },
  { number: '5min', label: 'Average session start', color: '#1a4a3a' },
  { number: '24/7', label: 'AI support available', color: '#3a1a6c' },
  { number: '100%', label: 'Private & secure', color: '#4a2a1a' },
]

function buildTracks() {
  const doubled = [...stats, ...stats]
  return [doubled, [...doubled].reverse()]
}

export function StatsMarquee() {
  const [tracks] = useState(buildTracks)

  useIsomorphicLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    gsap.set('.marquee-underline', { scaleX: 0, opacity: 0 })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.Double-marquee',
        start: 'top 70%',
        toggleActions: 'play none none reverse',
      },
    })

    tl.to('.marquee-underline', { scaleX: 1, opacity: 1, duration: 1, ease: 'power2.out' })

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars.trigger === '.Double-marquee') t.kill()
      })
    }
  }, [])

  return (
    <div>
      <section className="Double-marquee">
      {/* Left — headline + blob decoration */}
      <div className="marquee-left">
        <div className="marquee-text-container">
          <h2>
            trusted by<br />
            our <span className="text-with">users:</span>
          </h2>
          <svg xmlns="http://www.w3.org/2000/svg" className="marquee-underline" viewBox="0 0 132 5" fill="none">
            <path d="M1 2.08C44.3 3.9 87.98 5.71 131 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Decorative blob */}
        <div className="marquee-blob-container">
          <svg viewBox="0 0 420 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="marquee-blob" style={{ position:'absolute', width:'100%', height:'100%' }}>
            <path d="M210 20C300 20 390 80 390 180C390 280 330 380 210 400C90 420 30 340 20 240C10 140 60 20 210 20Z"
              fill="url(#blobGrad)" opacity="0.4"/>
            <defs>
              <radialGradient id="blobGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#4f7cff"/>
                <stop offset="100%" stopColor="#6ee7b7" stopOpacity="0"/>
              </radialGradient>
            </defs>
          </svg>

          {/* Hand pointing SVG */}
          <div className="marquee-svg-container">
            <div className="marquee-svg-item" style={{ bottom:'18%', left:'68%', width:'90px', position:'absolute' }}>
              <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" width="90" height="90">
                <circle cx="30" cy="30" r="28" fill="#6ee7b7" opacity="0.2" stroke="#6ee7b7" strokeWidth="1.5"/>
                <path d="M20 35V22a3 3 0 016 0v8M26 22v-3a3 3 0 016 0v11M32 25v-2a3 3 0 016 0v10c0 5.5-4.5 10-10 10h-2c-3 0-6-2-7.5-5l-3-6a3 3 0 015.5-2.4L20 35" stroke="#6ee7b7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="marquee-svg-item" style={{ bottom:'3%', left:'70%', width:'350px', position:'absolute', color:'var(--color-mint)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 386 127" fill="none">
                <path d="M2 123C9 36 84.5 17 124 26C217.764 47.4 207 115 177.5 123C105.777 142.45 110.737 2 232.5 2C310.5 2 366.5 79 376 118L356.5 105.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 123C9 36 84.5 17 124 26C217.764 47.4 207 115 177.5 123C105.777 142.45 110.737 2 232.5 2C310.5 2 366.5 79 376 118L384 97" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Right — dual scrolling stat columns */}
      <div className="marquee-right">
        {tracks.map((trackItems, colIndex) => (
          <div key={colIndex} className="marquee-column">
            <div className="marquee-track">
              {trackItems.map((item, i) => (
                <div
                  key={i}
                  className="marquee-item"
                  style={{ backgroundColor: item.color }}
                >
                  <div className="stat-number">{item.number}</div>
                  <div className="stat-label">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
    </div>
  )
}
