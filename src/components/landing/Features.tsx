'use client'

import gsap from 'gsap'
import React, { useLayoutEffect, useEffect, useRef } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export function Features() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const cardsAreaRef = useRef<HTMLDivElement | null>(null)

  useIsomorphicLayoutEffect(() => {
    if (!sectionRef.current || !cardsAreaRef.current) return

    const section = sectionRef.current
    const cardsArea = cardsAreaRef.current
    const ctx = gsap.context(() => {}, section)

    // Select individual cards
    const card1 = cardsArea.querySelector('.motion-card__card--1') as HTMLElement
    const card2 = cardsArea.querySelector('.motion-card__card--2') as HTMLElement
    const card3 = cardsArea.querySelector('.motion-card__card--3') as HTMLElement
    const card4 = cardsArea.querySelector('.motion-card__card--4') as HTMLElement

    // Select floating labels
    const labelPink = cardsArea.querySelector('.motion-card__floating-label--pink') as HTMLElement
    const labelOrange = cardsArea.querySelector('.motion-card__floating-label--orange') as HTMLElement
    const labelRed = cardsArea.querySelector('.motion-card__floating-label--red') as HTMLElement

    const onMouseMove = (e: MouseEvent) => {
      const rect = cardsArea.getBoundingClientRect()
      // Normalized coordinates from -1 to 1 based on center of the cards area
      const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)
      const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)

      // Parallax translate & tilt for cards
      if (card1) {
        gsap.to(card1, {
          x: dx * -30,
          y: dy * -30,
          rotateY: dx * 15,
          rotateX: -dy * 15,
          rotation: -6 + dx * 3,
          duration: 0.8,
          ease: 'power2.out',
        })
      }
      if (card2) {
        gsap.to(card2, {
          x: dx * 45,
          y: dy * 35,
          rotateY: dx * -12,
          rotateX: -dy * 12,
          rotation: 6 - dx * 4,
          duration: 0.8,
          ease: 'power2.out',
        })
      }
      if (card3) {
        gsap.to(card3, {
          x: dx * -55,
          y: dy * -45,
          rotateY: dx * 18,
          rotateX: -dy * 18,
          rotation: -6 + dx * 5,
          duration: 0.8,
          ease: 'power2.out',
        })
      }
      if (card4) {
        gsap.to(card4, {
          x: dx * 35,
          y: dy * 55,
          rotateY: dx * -15,
          rotateX: -dy * 15,
          rotation: 4 - dx * 3,
          duration: 0.8,
          ease: 'power2.out',
        })
      }

      // Parallax for floating labels (more dramatic offset)
      if (labelPink) {
        gsap.to(labelPink, {
          x: dx * -70,
          y: dy * -60,
          rotation: dx * 12,
          duration: 0.7,
          ease: 'power2.out',
        })
      }
      if (labelOrange) {
        gsap.to(labelOrange, {
          x: dx * 80,
          y: dy * 70,
          rotation: -dx * 10,
          duration: 0.7,
          ease: 'power2.out',
        })
      }
      if (labelRed) {
        gsap.to(labelRed, {
          x: dx * -90,
          y: dy * 90,
          rotation: dx * 15,
          duration: 0.7,
          ease: 'power2.out',
        })
      }
    }

    const onMouseLeave = () => {
      // Smoothly return all elements to default configurations
      const cardsConfig = [
        { el: card1, rot: -6 },
        { el: card2, rot: 6 },
        { el: card3, rot: -6 },
        { el: card4, rot: 4 },
      ]

      cardsConfig.forEach(({ el, rot }) => {
        if (el) {
          gsap.to(el, {
            x: 0,
            y: 0,
            rotateY: 0,
            rotateX: 0,
            rotation: rot,
            duration: 1.5,
            ease: 'elastic.out(1, 0.5)',
          })
        }
      })

      const labels = [labelPink, labelOrange, labelRed]
      labels.forEach((label) => {
        if (label) {
          gsap.to(label, {
            x: 0,
            y: 0,
            rotation: 0,
            duration: 1.5,
            ease: 'elastic.out(1, 0.5)',
          })
        }
      })
    }

    cardsArea.addEventListener('mousemove', onMouseMove)
    cardsArea.addEventListener('mouseleave', onMouseLeave)

    // ── Entry animations: sticker pop + underline draw ────────────────────────
    const topStickerImg = section.querySelector<HTMLImageElement>('.motion-card__sticker--top img')
    const underlinePath = section.querySelector<SVGPathElement>('.motion-card__underline-path')

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
        toggleActions: 'play none none reverse',
      },
    })

    if (topStickerImg) {
      gsap.set(topStickerImg, { scale: 0, opacity: 0, rotation: -30 })
      tl.to(topStickerImg, { scale: 1, opacity: 1, rotation: 0, duration: 1.6, ease: 'elastic.out(1, 0.4)' }, 0)
    }

    if (underlinePath) {
      const pathLen = underlinePath.getTotalLength()
      gsap.set(underlinePath, { strokeDasharray: pathLen, strokeDashoffset: pathLen })
      tl.to(underlinePath, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.out' }, 0.2)
    }

    // Entry: cards cascade in
    const allCards = section.querySelectorAll<HTMLElement>('.motion-card__card')
    gsap.fromTo(
      allCards,
      { opacity: 0, y: 60, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        stagger: 0.12,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    )

    return () => {
      cardsArea.removeEventListener('mousemove', onMouseMove)
      cardsArea.removeEventListener('mouseleave', onMouseLeave)
      ctx.revert()
      ScrollTrigger.getAll()
        .filter((st) => st.trigger === section)
        .forEach((st) => st.kill())
    }
  }, [])

  return (
    <div>
      <section ref={sectionRef} className="motion-card-section" id="motion-card-section">
      <div className="motion-card__heading">
        <h2 className="motion-card__title">
          a platform built
          <br />
          for your mind.
        </h2>
        <p className="motion-card__subtitle">
          from stress to peace.
          <span className="motion-card__sticker motion-card__sticker--top">
            <img
              src="/assets/Footer-Sticker SVG/footer-sticker-hands.svg"
              alt="Green heart hands sticker"
              className="motion-card__sticker-img"
            />
          </span>
        </p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          viewBox="0 0 634 28"
          fill="none"
          className="motion-card__underline-svg"
        >
          <path
            className="motion-card__underline-path"
            d="M2 26C41.0237 23.1556 79.9927 19.9419 118.634 15.5521C169.106 9.98633 227.314 2.42393 275.206 2C280.46 2.57436 264.768 4.99488 262.462 5.55556C257.837 6.43078 252.529 7.47009 247.317 8.59146C239.594 10.3556 212.496 15.8393 226.932 19.8051C239.594 22.6359 263.663 21.9521 280.978 21.3504C314.817 19.9829 349.311 16.7419 383.204 14.7863C465.931 9.5077 549.191 10.547 632 14.1436"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div ref={cardsAreaRef} className="motion-card__cards-area">
        <div className="motion-card__blob">
          <img
            src="/assets/MotionCard SVG/motion-card-blob.svg"
            alt=""
            className="motion-card__blob-svg"
          />
        </div>

        <div className="motion-card__cards">
          <div className="motion-card__card motion-card__card--1">
            <div className="motion-card__card-image">
              <img
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop"
                loading="lazy"
                alt="Meditation"
                className="cover-image"
              />
            </div>
          </div>

          <div className="motion-card__card motion-card__card--2">
            <div className="motion-card__card-image">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop"
                loading="lazy"
                alt="Support"
                className="cover-image"
              />
            </div>
          </div>

          <div className="motion-card__card motion-card__card--3">
            <div className="motion-card__card-image">
              <img
                src="https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=800&auto=format&fit=crop"
                loading="lazy"
                alt="Therapy"
                className="cover-image"
              />
            </div>
          </div>

          <div className="motion-card__card motion-card__card--4">
            <div className="motion-card__card-image">
              <img
                src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop"
                loading="lazy"
                alt="Community"
                className="cover-image"
              />
            </div>
          </div>
        </div>

        <div className="motion-card__floating-labels">
          <div className="motion-card__floating-label motion-card__floating-label--pink">
            <p className="motion-card__floating-text">AI emotion detection</p>
          </div>
          <div className="motion-card__floating-label motion-card__floating-label--orange">
            <p className="motion-card__floating-text">private and secure</p>
          </div>
          <div className="motion-card__floating-label motion-card__floating-label--red">
            <p className="motion-card__floating-text">connect with therapists</p>
          </div>
        </div>
      </div>

      <div className="motion-card__footer-text">
        <p className="motion-card__description">
          To reach the best version of yourself, you need to understand your mind.
          We are a true 360° mental health platform, working the whole spectrum from
          daily journaling to professional therapy connections.
        </p>
      </div>
    </section>
    </div>
  )
}
