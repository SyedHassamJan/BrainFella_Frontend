'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { BookOpen, Bell, LogOut, User, LayoutDashboard, Settings, Stethoscope, ShieldCheck, Users } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useAuth } from '@/hooks/useAuth'
import { useUnreadNotificationCount } from '@/hooks/useNotifications'
import api from '@/lib/api'
import { ROUTES } from '@/constants/routes'
import { queryClient } from '@/lib/queryClient'

export function Navbar() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const { logout } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const unread = useUnreadNotificationCount(isAuthenticated)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = async () => {
    try {
      await api.post('/auth/signout')
    } catch {
      // clear client state regardless
    } finally {
      queryClient.clear()
      logout()
      router.push(ROUTES.HOME)
    }
  }

  // when on homepage and not scrolled, we're over the dark video → white text; otherwise → dark text
  const onHero = pathname === '/' && !scrolled

  return (
    <>
      <nav
        className="bh-navbar"
        style={{
          background: scrolled ? 'rgba(240, 235, 230, 0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(0,0,0,0.08)' : 'none',
          transition: 'background 0.4s ease, backdrop-filter 0.4s ease, border 0.4s ease',
        }}
      >
        {/* Logo */}
        <Link
          href={ROUTES.HOME}
          className="bh-logo"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontFamily: "'Epilogue', sans-serif",
            fontWeight: 900,
            fontSize: '1.35rem',
            letterSpacing: '-0.5px',
            color: onHero ? '#ffffff' : 'var(--color-dark)',
            textDecoration: 'none',
            transition: 'color 0.4s ease',
          }}
        >
          <div style={{
            width: 34, height: 34,
            background: onHero ? 'rgba(255,255,255,0.15)' : 'var(--color-dark)',
            border: onHero ? '1.5px solid rgba(255,255,255,0.3)' : 'none',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.95rem', fontWeight: 900, color: '#fff',
            flexShrink: 0,
            transition: 'background 0.4s ease',
          }}>
            B
          </div>
          BrainHealth
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {isLoading ? (
            <div style={{ width: 120, height: 36 }} aria-hidden="true" />
          ) : isAuthenticated && user ? (
            <>
              {/* Journal (patients only: therapists have no journal of their own) */}
              {user.role === 'PATIENT' ? (
                <NavLink href={ROUTES.JOURNAL} icon={<BookOpen size={15} />} onHero={onHero}>
                  Journal
                </NavLink>
              ) : null}

              {/* Therapist: patients who are linked or contacted them, and their own profile / CV application */}
              {user.role === 'THERAPIST' ? (
                <>
                  <NavLink href={ROUTES.THERAPIST_PATIENTS} icon={<Users size={15} />} onHero={onHero}>
                    Patients
                  </NavLink>
                  <NavLink href={ROUTES.THERAPIST_APPLICATION} icon={<Stethoscope size={15} />} onHero={onHero}>
                    My profile
                  </NavLink>
                </>
              ) : null}

              {/* Admin: review therapist applications */}
              {user.role === 'ADMIN' ? (
                <NavLink href={ROUTES.ADMIN_THERAPISTS} icon={<ShieldCheck size={15} />} onHero={onHero}>
                  Therapists
                </NavLink>
              ) : null}

              {/* Notifications (everyone; therapists see patient crisis alerts here) */}
              <NavLink href={ROUTES.NOTIFICATIONS} icon={<Bell size={15} />} onHero={onHero}>
                Notifications
                {unread > 0 ? (
                  <span
                    aria-label={`${unread} unread`}
                    style={{
                      marginLeft: 4, minWidth: 18, height: 18, padding: '0 5px',
                      borderRadius: 999, background: '#f59e0b', color: '#fff',
                      fontSize: '0.7rem', fontWeight: 800, lineHeight: '18px',
                      textAlign: 'center', display: 'inline-block',
                    }}
                  >
                    {unread > 99 ? '99+' : unread}
                  </span>
                ) : null}
              </NavLink>

              {/* Settings */}
              <NavLink href={ROUTES.SETTINGS} icon={<Settings size={15} />} onHero={onHero}>
                Settings
              </NavLink>

              {/* Divider */}
              <div style={{
                width: 1, height: 28,
                background: onHero ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.12)',
                margin: '0 8px',
                transition: 'background 0.4s ease',
              }} />

              {/* User avatar + name */}
              {user.profileImage ? (
                <Image
                  src={user.profileImage}
                  alt={user.name}
                  width={30}
                  height={30}
                  style={{ borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{
                  width: 30, height: 30,
                  background: 'var(--color-lightblue)',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <User size={14} color="#fff" />
                </div>
              )}

              <span style={{
                fontFamily: "'Epilogue', sans-serif",
                fontWeight: 700,
                fontSize: '0.9rem',
                color: onHero ? '#ffffff' : 'var(--color-dark)',
                marginRight: 4,
                transition: 'color 0.4s ease',
              }}>
                {user.name.split(' ')[0]}
              </span>

              {/* Sign out */}
              <button
                onClick={handleLogout}
                aria-label="Sign out"
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '7px 14px',
                  borderRadius: 999,
                  background: 'rgba(225,29,72,0.08)',
                  border: '1px solid rgba(225,29,72,0.18)',
                  color: '#e11d48',
                  fontFamily: "'Epilogue', sans-serif",
                  fontWeight: 700, fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  marginLeft: 4,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(225,29,72,0.15)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(225,29,72,0.08)' }}
              >
                <LogOut size={13} />
                Sign out
              </button>
            </>
          ) : (
            <>
              {/* Public nav: How it works, About */}
              <NavLink href="/#motion-card-section" onHero={onHero}>Features</NavLink>

              <div style={{
                width: 1, height: 28,
                background: onHero ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.12)',
                margin: '0 4px',
                transition: 'background 0.4s ease',
              }} />

              <Link
                href={ROUTES.LOGIN}
                style={{
                  padding: '8px 18px',
                  borderRadius: 999,
                  color: onHero ? 'rgba(255,255,255,0.85)' : 'var(--color-dark)',
                  fontFamily: "'Epilogue', sans-serif",
                  fontWeight: 700, fontSize: '0.9rem',
                  textDecoration: 'none',
                  transition: 'color 0.4s ease, background 0.2s',
                  background: 'transparent',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = onHero ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.05)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
              >
                Sign in
              </Link>

              <Link
                href={ROUTES.SIGNUP}
                style={{
                  padding: '9px 22px',
                  borderRadius: 999,
                  background: onHero ? 'rgba(255,255,255,0.18)' : 'var(--color-dark)',
                  border: onHero ? '1.5px solid rgba(255,255,255,0.4)' : 'none',
                  color: '#fff',
                  fontFamily: "'Epilogue', sans-serif",
                  fontWeight: 800, fontSize: '0.9rem',
                  textDecoration: 'none',
                  transition: 'background 0.3s ease, border 0.3s ease, transform 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = onHero ? 'rgba(255,255,255,0.3)' : 'var(--color-blue)'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = onHero ? 'rgba(255,255,255,0.18)' : 'var(--color-dark)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </nav>
    </>
  )
}

// Small helper component for nav links
function NavLink({
  href,
  icon,
  children,
  onHero = false,
}: {
  href: string
  icon?: React.ReactNode
  children: React.ReactNode
  onHero?: boolean
}) {
  return (
    <Link
      href={href}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '7px 14px',
        borderRadius: 999,
        color: onHero ? 'rgba(255,255,255,0.85)' : 'var(--color-dark)',
        fontFamily: "'Epilogue', sans-serif",
        fontWeight: 700,
        fontSize: '0.9rem',
        textDecoration: 'none',
        transition: 'color 0.4s ease, background 0.2s',
        background: 'transparent',
        opacity: 0.9,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = onHero ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)'
        e.currentTarget.style.opacity = '1'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent'
        e.currentTarget.style.opacity = '0.9'
      }}
    >
      {icon}
      {children}
    </Link>
  )
}
