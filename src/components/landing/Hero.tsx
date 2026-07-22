'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import Link from 'next/link'
import { ROUTES } from '@/constants/routes'

// Inline SVG oval underline
function OvalUnderline() {
  return (
    <svg
      viewBox="0 0 220 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="bh-hero__oval"
    >
      <ellipse
        cx="110"
        cy="30"
        rx="108"
        ry="26"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        className="bh-hero__oval-path"
      />
    </svg>
  )
}

function SmileySVG() {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <circle cx="40" cy="40" r="38" fill="#6ee7b7" stroke="#6ee7b7" strokeWidth="2"/>
      <circle cx="27" cy="33" r="5" fill="#080c18"/>
      <circle cx="53" cy="33" r="5" fill="#080c18"/>
      <path d="M24 50 Q40 64 56 50" stroke="#080c18" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
    </svg>
  )
}

function StarSVG() {
  return (
    <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <path d="M30 4L35.5 22.5L55 22.5L39.5 34L45 52.5L30 41.5L15 52.5L20.5 34L5 22.5L24.5 22.5Z"
        fill="#a78bfa" stroke="#a78bfa" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  )
}

export function HeroSection() {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Animate headline words in
    if (!titleRef.current) return
    const words = titleRef.current.querySelectorAll('.bh-hero__word')
    gsap.fromTo(
      words,
      { y: 80, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.12,
        ease: 'power3.out',
        delay: 0.3,
      }
    )

    // Animate CTA buttons
    gsap.fromTo(
      '.bh-hero__controls',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 1.1 }
    )
  }, [])

  return (
    <div className="bh-hero" style={{ position: 'relative', overflow: 'hidden' }}>

      {/* ── Video background ── */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
        }}
        src="/assets/cursor/855734-hd_1920_1080_30fps.mp4"
      />

      {/* ── Dark overlay so text is legible ── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        background: 'linear-gradient(to bottom, rgba(8,12,24,0.30) 0%, rgba(8,12,24,0.55) 50%, rgba(8,12,24,0.80) 100%)',
      }} />

      {/* ── Decorative floating stickers ── */}
      <div
        style={{
          position: 'absolute',
          top: '15%',
          right: '8%',
          width: '80px',
          height: '80px',
          rotate: '-20deg',
          zIndex: 3,
          pointerEvents: 'none',
          animation: 'floatY 4s ease-in-out infinite',
        }}
      >
        <SmileySVG />
      </div>

      <div
        style={{
          position: 'absolute',
          top: '30%',
          right: '20%',
          width: '55px',
          height: '55px',
          rotate: '15deg',
          zIndex: 3,
          pointerEvents: 'none',
          animation: 'floatY 5s ease-in-out infinite 1s',
        }}
      >
        <StarSVG />
      </div>

      {/* ── Headline ── */}
      <div className="bh-hero__title-wrap" style={{ position: 'absolute', zIndex: 4 }}>
        <h1 className="bh-hero__title" ref={titleRef} style={{ color: '#ffffff' }}>
          <span className="bh-hero__word" style={{ opacity: 0, color: '#ffffff' }}>your </span>
          <span className="bh-hero__word" style={{ opacity: 0, color: '#ffffff' }}>mind </span>
          <span className="bh-hero__word is--relative" style={{ opacity: 0, color: '#6ee7b7' }}>
            <em>deserves </em>
          </span>
          {/* Line break */}
          <div style={{ flexBasis: '100%', height: 0 }} />
          <span className="bh-hero__word" style={{ opacity: 0, color: '#ffffff' }}>the </span>
          <span className="bh-hero__word" style={{ opacity: 0, color: '#ffffff' }}>right </span>
          <span className="bh-hero__word is--relative" style={{ opacity: 0, color: '#ffffff' }}>
            {/* Oval SVG underline */}
            <OvalUnderline />
            <span>care</span>
          </span>
        </h1>
      </div>

      {/* ── CTA buttons ── */}
      <div className="bh-hero__controls" style={{ position: 'absolute', zIndex: 4, opacity: 0 }}>
        <Link href={ROUTES.SIGNUP} className="bh-hero__cta bh-hero__cta--primary">
          Start Your Journey
        </Link>
        <Link href="/#motion-card-section" className="bh-hero__cta bh-hero__cta--glass">
          Learn More
        </Link>
      </div>

      <style>{`
        @keyframes floatY {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-18px); }
        }
      `}</style>
    </div>
  )
}
