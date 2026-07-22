'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function SmoothScroll() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    gsap.registerPlugin(ScrollTrigger)

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    })

    // Sync Lenis scroll position with GSAP ScrollTrigger
    const scrollHandler = () => ScrollTrigger.update()
    lenis.on('scroll', scrollHandler)

    // Use a named RAF callback so we can remove it later
    const rafCallback = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(rafCallback)
    gsap.ticker.lagSmoothing(0)

    // Dynamic tab title when user switches tabs
    const originalTitle = document.title
    const handleVisibility = () => {
      document.title = document.hidden
        ? 'Hey, come back! 👋 — BrainHealth'
        : originalTitle
    }
    document.addEventListener('visibilitychange', handleVisibility)

    // Expose lenis globally for TransitionScribble
    ;(window as any).__lenis = lenis

    return () => {
      // Remove the ticker callback first, then destroy lenis
      gsap.ticker.remove(rafCallback)
      lenis.off('scroll', scrollHandler)
      lenis.destroy()
      document.removeEventListener('visibilitychange', handleVisibility)
      delete (window as any).__lenis
      // Refresh ScrollTrigger after lenis is gone
      ScrollTrigger.refresh()
    }
  }, [])

  return null
}
