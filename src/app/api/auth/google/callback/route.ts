import { type NextRequest, NextResponse } from 'next/server'

/**
 * The NestJS backend redirects to:
 * /api/auth/google/callback?userId=...&name=...&accessToken=...&refreshToken=...&role=...
 *
 * This Route Handler receives it server-side and forwards params to the
 * client-side /auth/callback page which can write to localStorage.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl

  const userId = searchParams.get('userId') ?? ''
  const name = searchParams.get('name') ?? ''
  const accessToken = searchParams.get('accessToken') ?? ''
  const refreshToken = searchParams.get('refreshToken') ?? ''
  const role = searchParams.get('role') ?? 'PATIENT'

  if (!userId || !accessToken) {
    return NextResponse.redirect(new URL('/login?error=oauth_failed', request.url))
  }

  const callbackUrl = new URL('/auth/callback', request.url)
  callbackUrl.searchParams.set('userId', userId)
  callbackUrl.searchParams.set('name', name)
  callbackUrl.searchParams.set('accessToken', accessToken)
  callbackUrl.searchParams.set('refreshToken', refreshToken)
  callbackUrl.searchParams.set('role', role)

  return NextResponse.redirect(callbackUrl)
}
