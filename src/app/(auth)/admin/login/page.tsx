'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, ShieldCheck } from 'lucide-react'
import type { AxiosError } from 'axios'
import { loginSchema, type LoginFormValues } from '@/schemas/loginSchema'
import { useAdminLogin } from '@/hooks/useAdminLogin'
import type { ApiError } from '@/types'

const input: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.14)',
  borderRadius: 12,
  padding: '14px 18px',
  color: '#fff',
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '1rem',
  outline: 'none',
  boxSizing: 'border-box',
}
const label: React.CSSProperties = {
  display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'rgba(255,255,255,0.85)',
  marginBottom: 8, fontFamily: "'Epilogue', sans-serif",
}
const fieldError: React.CSSProperties = { marginTop: 6, fontSize: '0.8rem', color: '#fda4af', fontFamily: "'DM Sans', sans-serif" }

function AdminLoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const login = useAdminLogin()
  const params = useSearchParams()
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) })

  const apiError = (login.error as AxiosError<ApiError> | null)?.response
  const message = apiError
    ? apiError.status === 401
      ? 'Incorrect email or password.'
      : apiError.data?.message
    : params.get('error') === 'google'
      ? 'Administrators sign in with their email and password here.'
      : (login.error as Error | null)?.message

  return (
    <form onSubmit={handleSubmit((v) => login.mutate(v))} style={{ display: 'grid', gap: 18 }} noValidate>
      {message ? (
        <div role="alert" style={{ background: 'rgba(225,29,72,0.15)', border: '1px solid rgba(253,164,175,0.4)', color: '#fecdd3', borderRadius: 12, padding: '12px 14px', fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem' }}>
          {message}
        </div>
      ) : null}
      <div>
        <label htmlFor="admin-email" style={label}>Admin email</label>
        <input id="admin-email" type="email" autoComplete="username" style={input} {...register('email')} />
        {errors.email ? <p style={fieldError}>{errors.email.message}</p> : null}
      </div>
      <div>
        <label htmlFor="admin-password" style={label}>Password</label>
        <div style={{ position: 'relative' }}>
          <input id="admin-password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" style={{ ...input, paddingRight: 48 }} {...register('password')} />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password ? <p style={fieldError}>{errors.password.message}</p> : null}
      </div>
      <button
        type="submit"
        disabled={login.isPending}
        style={{
          background: '#fff', color: '#0f172a', border: 'none', borderRadius: 12, padding: '14px 18px',
          fontFamily: "'Epilogue', sans-serif", fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', opacity: login.isPending ? 0.6 : 1,
        }}
      >
        {login.isPending ? 'Signing in…' : 'Sign in to admin'}
      </button>
    </form>
  )
}

/** Separate sign-in for administrators. The API refuses every non-admin account here. */
export default function AdminLoginPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={22} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontFamily: "'Epilogue', sans-serif", fontWeight: 900, fontSize: '1.6rem', color: '#fff', lineHeight: 1.1 }}>BrainHealth Admin</h1>
            <p style={{ fontFamily: "'DM Sans', sans-serif", color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Restricted area for administrators</p>
          </div>
        </div>
        <Suspense fallback={null}>
          <AdminLoginForm />
        </Suspense>
      </div>
    </div>
  )
}
