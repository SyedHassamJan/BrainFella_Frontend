'use client'

import { useEffect } from 'react'
import { gsap } from 'gsap'

export default function CursorBubble() {
  useEffect(() => {
    const cursorBubble = document.querySelector('.cursor-bubble')
    if (!cursorBubble) return

    const xTo = gsap.quickTo(cursorBubble, 'x', { duration: 0.5, ease: 'power3' })
    const yTo = gsap.quickTo(cursorBubble, 'y', { duration: 0.5, ease: 'power3' })

    let isHoveringClickable = false
    gsap.set(cursorBubble, { rotation: -30 })

    const clickableSelector = 'a, button'

    const onMouseMove = (e: MouseEvent) => {
      xTo(e.clientX + 13)
      yTo(e.clientY - 43)
    }

    let activeElement: Element | null = null

    const onMouseOver = (e: MouseEvent) => {
      const found = (e.target as Element).closest(clickableSelector)

      if (found) {
        if (found !== activeElement) {
          activeElement = found
          
          // Determine custom context-aware cursor text
          let text = 'explore'
          const customText = found.getAttribute('data-cursor')
          if (customText) {
            text = customText
          } else {
            const txt = found.textContent?.toLowerCase() || ''
            const ariaLabel = found.getAttribute('aria-label')?.toLowerCase() || ''
            if (txt.includes('sign out') || txt.includes('logout') || ariaLabel.includes('sign out') || ariaLabel.includes('logout')) {
              text = 'log out'
            } else if (txt.includes('journal') || ariaLabel.includes('journal')) {
              text = 'journal'
            } else if (txt.includes('settings') || ariaLabel.includes('settings')) {
              text = 'settings'
            } else if (txt.includes('get started') || txt.includes('sign up')) {
              text = 'join'
            } else if (txt.includes('sign in') || txt.includes('login')) {
              text = 'sign in'
            } else if (txt.includes('edit')) {
              text = 'edit'
            } else if (txt.includes('delete') || ariaLabel.includes('delete')) {
              text = 'delete'
            } else if (txt.includes('back')) {
              text = 'back'
            }
          }

          if (cursorBubble) {
            cursorBubble.textContent = text
          }
        }

        if (!isHoveringClickable) {
          isHoveringClickable = true
          gsap.killTweensOf(cursorBubble, 'opacity,scale,rotation')
          gsap.to(cursorBubble, {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 1.7,
            delay: 0.1,
            ease: 'elastic.out(1, 0.4)',
          })
        }
      } else {
        activeElement = null
        if (isHoveringClickable) {
          isHoveringClickable = false
          gsap.killTweensOf(cursorBubble, 'opacity,scale,rotation')
          gsap.to(cursorBubble, {
            opacity: 0,
            scale: 0,
            rotation: -30,
            duration: 0.3,
            ease: 'sine.inOut',
          })
        }
      }
    }

    const onMouseLeave = () => {
      activeElement = null
      if (isHoveringClickable) {
        isHoveringClickable = false
        gsap.killTweensOf(cursorBubble, 'opacity,scale,rotation')
        gsap.to(cursorBubble, {
          opacity: 0,
          scale: 0,
          rotation: -30,
          duration: 0.3,
          ease: 'sine.inOut',
        })
      }
    }

    window.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseover', onMouseOver)
    document.addEventListener('mouseleave', onMouseLeave)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseover', onMouseOver)
      document.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  return <div className="cursor-bubble">explore</div>
}
