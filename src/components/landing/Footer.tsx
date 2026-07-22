'use client'

import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'
import { ROUTES } from '@/constants/routes'

const SOCIAL_LINKS = [
  {
    name: 'Instagram',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
      </svg>
    ),
  },
  {
    name: 'Twitter',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    ),
  },
]

function initWiggle(element: Element, intensity: number) {
  let tween: gsap.core.Tween | null = null
  const target = (element.querySelector('[data-wiggle-target]') || element) as HTMLElement
  gsap.set(target, { transformOrigin: 'center center' })
  const onEnter = () => {
    tween = gsap.to(target, { rotation: intensity, duration: 0.17, repeat: -1, yoyo: true, ease: 'steps(1)' })
  }
  const onLeave = () => {
    tween?.kill()
    gsap.to(target, { rotation: 0, duration: 0.3, ease: 'power2.out' })
  }
  element.addEventListener('mouseenter', onEnter)
  element.addEventListener('mouseleave', onLeave)
  return () => {
    element.removeEventListener('mouseenter', onEnter)
    element.removeEventListener('mouseleave', onLeave)
  }
}

export function Footer() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    // Wiggle on social icons
    const socials = document.querySelectorAll('.single-social')
    const cleanups = Array.from(socials).map((el) => initWiggle(el, 12))

    // Credits pop-out
    const creditsWrapper = document.querySelector('.footer-credits-wrapper')
    if (creditsWrapper) {
      const creditsBox = creditsWrapper.querySelector('.credits-box') as HTMLElement
      const creditsItems = creditsWrapper.querySelectorAll('.credits-item')

      gsap.set(creditsBox, { visibility: 'visible', width: 'auto', height: 'auto', opacity: 1 })
      const boxRect = creditsBox.getBoundingClientRect()
      const fullWidth = boxRect.width
      const fullHeight = boxRect.height
      const creditsBtn = creditsWrapper.querySelector('.footer-credits')!
      const startY = (creditsBtn as HTMLElement).offsetHeight + 15

      gsap.set(creditsBox, { visibility: 'hidden', width: 0, height: 0, opacity: 0, y: startY })
      gsap.set(creditsItems, { y: fullHeight })

      const onEnter = () => {
        gsap.set(creditsBox, { visibility: 'visible' })
        gsap.killTweensOf(creditsBox)
        gsap.killTweensOf(creditsItems)
        gsap.to(creditsBox, { width: fullWidth, height: fullHeight, opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' })
        gsap.to(creditsItems, { y: 0, duration: 0.5, stagger: 0.04, ease: 'power3.out', delay: 0.1 })
      }
      const onLeave = () => {
        gsap.killTweensOf(creditsBox)
        gsap.killTweensOf(creditsItems)
        gsap.to(creditsBox, {
          width: 0, height: 0, opacity: 0, y: startY, duration: 0.35, ease: 'power3.in',
          onComplete: () => gsap.set(creditsBox, { visibility: 'hidden' }),
        })
        gsap.to(creditsItems, { y: fullHeight, duration: 0.25, ease: 'power3.in' })
      }

      creditsWrapper.addEventListener('mouseenter', onEnter)
      creditsWrapper.addEventListener('mouseleave', onLeave)

      return () => {
        cleanups.forEach((fn) => fn())
        creditsWrapper.removeEventListener('mouseenter', onEnter)
        creditsWrapper.removeEventListener('mouseleave', onLeave)
      }
    }

    return () => cleanups.forEach((fn) => fn())
  }, [])

  return (
    <footer className="main-footer">
      <div className="footer-inner">
        {/* Top row */}
        <div className="footer-top">
          {/* Column 1 — Address / contact */}
          <div className="footer-column">
            <span className="footer-badge">est. 2025</span>
            <h3>BrainHealth</h3>
            <address>
              Lahore, Pakistan<br />
              Remote-first team
            </address>
            <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="footer-map-link">
              <span>View on map ↗</span>
              <svg className="draw-btn__svg" viewBox="0 0 100 8" fill="none">
                <path d="M0 4 Q25 1 50 4 Q75 7 100 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </a>
          </div>

          {/* Column 2 — Email / phone */}
          <div className="footer-column">
            <span className="footer-badge">get in touch</span>
            <a href="mailto:hello@brainhealth.pk" className="footer-email">
              hello@brainhealth.pk
            </a>
            <a href="tel:+923174288665" className="footer-whatsapp">
              +92 317 428 8665
            </a>
            <p className="footer-note">
              Crisis support available 24/7.<br />
              We respond within 1 business day.
            </p>
          </div>

          {/* Column 3 — Links + Socials */}
          <div className="footer-column">
            <span className="footer-badge">explore</span>
            <h3>
              <Link href={ROUTES.SIGNUP} style={{ color: 'inherit' }}>Get Started</Link>
            </h3>
            <h3>
              <Link href={ROUTES.LOGIN} style={{ color: 'inherit' }}>Sign In</Link>
            </h3>
            <div className="footer-socials">
              {SOCIAL_LINKS.map((social) => (
                <a key={social.name} href={social.href} className="single-social" aria-label={social.name} target="_blank" rel="noopener noreferrer">
                  <div data-wiggle-target="true" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {social.icon}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom — huge wordmark */}
        <div className="footer-bottom">
          <div className="footer-big-text">
            <svg
              className="footer-logo__svg"
              viewBox="0 0 1200 160"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <text
                x="50%"
                y="140"
                textAnchor="middle"
                fontFamily="Epilogue, sans-serif"
                fontWeight="900"
                fontSize="170"
                letterSpacing="-8"
                fill="currentColor"
              >
                BRAINHEALTH
              </text>
            </svg>
          </div>

          <div className="footer-bottom-row">
            {/* Copyright */}
            <p style={{
              color: 'rgba(255,255,255,0.45)',
              fontSize: '0.85rem',
              fontFamily: "'Epilogue', sans-serif",
              padding: '0 0 4px 4px',
              pointerEvents: 'auto',
            }}>
              © {new Date().getFullYear()} BrainHealth. All rights reserved.
            </p>

            {/* Credits pop-out */}
            <div className="footer-credits-wrapper">
              <div className="credits-box">
                <div className="credits-content">
                  <div className="credits-item">
                    <div className="overflow-wrapper">
                      <span className="credits-label">Design</span>
                    </div>
                    <div className="overflow-wrapper">
                      <span className="credits-name">BrainHealth Team</span>
                    </div>
                  </div>
                  <div className="credits-item">
                    <div className="overflow-wrapper">
                      <span className="credits-label">Inspired by</span>
                    </div>
                    <div className="overflow-wrapper">
                      <a href="https://truus.co" target="_blank" rel="noopener noreferrer" className="credits-name">Truus.co</a>
                    </div>
                  </div>
                  <div className="credits-item">
                    <div className="overflow-wrapper">
                      <span className="credits-label">Built with</span>
                    </div>
                    <div className="overflow-wrapper">
                      <span className="credits-name">Next.js + GSAP</span>
                    </div>
                  </div>
                </div>
              </div>
              <button className="footer-credits">credits ✦</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
