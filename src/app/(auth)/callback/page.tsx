'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { Spinner } from '@/components/ui/Spinner'
import { ROUTES } from '@/constants/routes'
import type { User } from '@/types'

function OAuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setUser, setAccessToken, setRefreshToken } = useAuthStore()

  useEffect(() => {
    const userId = searchParams.get('userId')
    const name = searchParams.get('name')
    const accessToken = searchParams.get('accessToken')
    const refreshToken = searchParams.get('refreshToken')
    const role = searchParams.get('role') as User['role'] | null

    if (!userId || !accessToken) {
      router.replace(`${ROUTES.LOGIN}?error=oauth_failed`)
      return
    }

    // Store the token and user in auth store (persisted to localStorage)
    setAccessToken(accessToken)
    if (refreshToken) setRefreshToken(refreshToken)
    setUser({
      id: userId,
      name: name ?? 'User',
      role: role ?? 'PATIENT',
      email: '',
      isActive: true,
      createdAt: new Date().toISOString(),
    })

    // Redirect based on role
    if (role === 'THERAPIST' || role === 'ADMIN') {
      router.replace(ROUTES.HOME)
    } else {
      router.replace(ROUTES.JOURNAL)
    }
  }, [searchParams, router, setUser, setAccessToken, setRefreshToken])

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 16,
      background: 'var(--color-bg)'
    }}>
      <Spinner size="lg" />
      <p style={{
        color: 'var(--color-text-muted)',
        fontFamily: "'Epilogue', sans-serif", fontWeight: 600
      }}>
        Signing you in with Google...
      </p>
    </div>
  )
}

export default function OAuthCallbackPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 16,
        background: 'var(--color-bg)'
      }}>
        <Spinner size="lg" />
      </div>
    }>
      <OAuthCallbackContent />
    </Suspense>
  )
}
