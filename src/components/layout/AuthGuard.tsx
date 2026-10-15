'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { Spinner } from '@/components/ui/Spinner'
import { ROUTES } from '@/constants/routes'

interface AuthGuardProps {
  children: React.ReactNode
  allowedRoles?: string[]
  /** Where signed-out visitors go. Defaults to the admin login under /admin, else the normal login. */
  loginRoute?: string
}

export function AuthGuard({ children, allowedRoles, loginRoute }: AuthGuardProps) {
  const { user, isAuthenticated, isLoading, _hasHydrated } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()
  const login = loginRoute ?? (pathname?.startsWith('/admin') ? ROUTES.ADMIN_LOGIN : ROUTES.LOGIN)

  useEffect(() => {
    // Wait for both: Zustand hydration from localStorage AND any loading state
    if (!_hasHydrated || isLoading) return

    if (!isAuthenticated) {
      router.replace(login)
      return
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      router.replace(ROUTES.HOME)
    }
  }, [isAuthenticated, isLoading, _hasHydrated, user, allowedRoles, login, router])

  // Show spinner until hydration is complete
  if (!_hasHydrated || isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-bg)',
      }}>
        <Spinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated) return null

  return <>{children}</>
}
