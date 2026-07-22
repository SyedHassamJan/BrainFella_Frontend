'use client'

import { useLayoutEffect, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

gsap.registerPlugin(ScrollTrigger)

const words = [
  'y', 'o', 'u', 'r', ' ',
  'b', 'r', 'a', 'i', 'n', ' ',
  'h', 'e', 'a', 'l', 't', 'h', ' ',
  'j', 'o', 'u', 'r', 'n', 'e', 'y', ' ',
  's', 't', 'a', 'r', 't', 's', ' ',
  'h', 'e', 'r', 'e'
]

export function HorizontalScrollWords() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const container = sectionRef.current
      if (!container) return
      const textRef = container.querySelector('.horizontal-words__relative') as HTMLElement
      const letters = container.querySelectorAll('.letter')
      const stickers = container.querySelectorAll(
        '.horizontal-words__sticker-watch, .horizontal-words__sticker-cursor, .horizontal-words__sticker-phone'
      )

      const entranceDistance = window.innerHeight
      const pinnedDistance = 2500

      const scrollTween = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top bottom',
          end: () => `+=${entranceDistance + pinnedDistance}`,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      })

      scrollTween
        .fromTo(textRef, { x: window.innerWidth }, { x: window.innerWidth * 0.5, ease: 'none', duration: entranceDistance })
        .to(textRef, { x: () => -(textRef.scrollWidth - window.innerWidth * 0.5), ease: 'none', duration: pinnedDistance })

      ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: () => `+=${pinnedDistance}`,
        pin: true,
        pinSpacing: true,
        invalidateOnRefresh: true,
      })

      letters.forEach((letter) => {
        gsap.from(letter, {
          yPercent: (Math.random() - 0.5) * 500,
          rotation: (Math.random() - 0.5) * 60,
          ease: 'elastic.out(1.2, 1)',
          scrollTrigger: {
            trigger: letter,
            containerAnimation: scrollTween,
            start: 'left 90%',
            end: 'left 50%',
            scrub: 0.5,
          },
        })
      })

      stickers.forEach((sticker) => {
        gsap.from(sticker, {
          scale: 0,
          yPercent: (Math.random() - 0.5) * 400,
          rotation: (Math.random() - 0.5) * 60,
          ease: 'elastic.out(1.2, 1)',
          scrollTrigger: {
            trigger: sticker,
            containerAnimation: scrollTween,
            start: 'left 90%',
            end: 'left 50%',
            scrub: 0.5,
          },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <div>
      <section ref={sectionRef} className="horizontal-words-section content-section">
        <div className="horizontal-words__relative">
          {/* Decorative SVG arrows + stickers */}
          <div className="horizontal-words__sticker-svg">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 386 127" fill="none" className="horizontal-words__arrow-svg">
              <path d="M2 123C9 36 84.5 17 124 26C217.764 47.4 207 115 177.5 123C105.777 142.45 110.737 2 232.5 2C310.5 2 366.5 79 376 118L356.5 105.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 123C9 36 84.5 17 124 26C217.764 47.4 207 115 177.5 123C105.777 142.45 110.737 2 232.5 2C310.5 2 366.5 79 376 118L384 97" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>

            {/* Brain sticker (inline SVG) */}
            <div className="horizontal-words__sticker-watch" style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" width="100" height="100">
                <circle cx="40" cy="40" r="38" fill="#1a2035" stroke="#6ee7b7" strokeWidth="2"/>
                <path d="M25 38c0-8.3 6.7-15 15-15s15 6.7 15 15c0 5-2.5 9.4-6.2 12H31.2C27.5 47.4 25 43 25 38z" fill="#4f7cff" opacity="0.4"/>
                <path d="M28 38c0-6.6 5.4-12 12-12s12 5.4 12 12" stroke="#6ee7b7" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M34 44v8M46 44v8M34 52h12" stroke="#6ee7b7" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="32" cy="35" r="3" fill="#a78bfa"/>
                <circle cx="48" cy="35" r="3" fill="#a78bfa"/>
              </svg>
            </div>

            {/* Heart sticker */}
            <div className="horizontal-words__sticker-cursor" style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" width="80" height="80">
                <circle cx="40" cy="40" r="38" fill="#1a2035" stroke="#fb7185" strokeWidth="2"/>
                <path d="M40 55 C30 47 18 40 18 30 C18 23 23 18 30 18 C34 18 38 20 40 23 C42 20 46 18 50 18 C57 18 62 23 62 30 C62 40 50 47 40 55Z" fill="#fb7185" opacity="0.85"/>
              </svg>
            </div>

            {/* Star sticker */}
            <div className="horizontal-words__sticker-phone" style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" width="80" height="80">
                <circle cx="40" cy="40" r="38" fill="#1a2035" stroke="#a78bfa" strokeWidth="2"/>
                <path d="M40 18L44.5 31.5H59L47.7 39.5L52 53L40 45L28 53L32.3 39.5L21 31.5H35.5Z" fill="#a78bfa"/>
              </svg>
            </div>

            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 127" fill="none" className="horizontal-words__arrow-end-svg">
              <path d="M2 2.4C100.5 2.4 130.2 52.4 118.4 125.1L99.7 107.9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 2.4C100.5 2.4 130.2 52.4 118.4 125.1L138 110.2" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>

            {/* Giant bouncing letters */}
            <h2 className="horizontal-words__h2" aria-label="your brain health journey starts here">
              {words.map((char, i) =>
                char === ' ' ? (
                  <span key={i} style={{ display: 'inline-block', width: '0.4em' }}>&nbsp;</span>
                ) : (
                  <div className="letter" key={i} aria-hidden="true" style={{ position: 'relative', display: 'inline-block' }}>
                    {char}
                  </div>
                )
              )}
            </h2>
          </div>
        </div>

        <div className="horizontal-words__bottom-text">
          <div>
            Your mind is complex <em>and</em> beautiful.<br />
            We give you the tools to understand it,<br />
            heal it, and grow — one day at a time.
          </div>
        </div>
      </section>
    </div>
  )
}
