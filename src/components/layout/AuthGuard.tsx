'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { Spinner } from '@/components/ui/Spinner'
import { ROUTES } from '@/constants/routes'

interface AuthGuardProps {
  children: React.ReactNode
  allowedRoles?: string[]
}

export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const { user, isAuthenticated, isLoading, _hasHydrated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    // Wait for both: Zustand hydration from localStorage AND any loading state
    if (!_hasHydrated || isLoading) return

    if (!isAuthenticated) {
      router.replace(ROUTES.LOGIN)
      return
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      router.replace(ROUTES.HOME)
    }
  }, [isAuthenticated, isLoading, _hasHydrated, user, allowedRoles, router])

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
