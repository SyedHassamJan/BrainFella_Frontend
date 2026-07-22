'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { loginSchema, type LoginFormValues } from '@/schemas/loginSchema'
import { useLogin } from '@/hooks/useLogin'
import type { AxiosError } from 'axios'
import type { ApiError } from '@/types'

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const { loginMutation } = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values)
  }

  const axiosError = loginMutation.error as AxiosError<ApiError> | null
  const errorMessage =
    axiosError?.response?.data?.message ?? axiosError?.message

  const inputStyle = {
    width: '100%',
    background: 'rgba(0,0,0,0.02)',
    border: '1px solid rgba(0,0,0,0.1)',
    borderRadius: 12,
    padding: '14px 18px',
    color: 'var(--color-dark)',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s ease, background 0.2s ease',
    boxSizing: 'border-box' as const,
  }

  const labelStyle = {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: 700,
    color: 'var(--color-dark)',
    marginBottom: 8,
    fontFamily: "'Epilogue', sans-serif",
  }

  const errorStyle = {
    marginTop: 6,
    fontSize: '0.8rem',
    color: '#e11d48',
    fontFamily: "'DM Sans', sans-serif",
  }

  return (
    <div>
      {errorMessage && (
        <div style={{
          background: 'rgba(225,29,72,0.1)',
          border: '1px solid rgba(225,29,72,0.2)',
          borderRadius: 12, padding: '12px 16px', marginBottom: 20,
        }}>
          <p style={{ color: '#e11d48', fontSize: '0.875rem', fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>
            {errorMessage}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Email */}
        <div>
          <label htmlFor="login-email" style={labelStyle}>Email address</label>
          <input
            {...register('email')}
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            style={inputStyle}
            onFocus={(e) => { e.target.style.borderColor = 'var(--color-blue)'; e.target.style.background = '#fff' }}
            onBlur={(e) => { e.target.style.borderColor = 'rgba(0,0,0,0.1)'; e.target.style.background = 'rgba(0,0,0,0.02)' }}
            aria-describedby={errors.email ? 'login-email-error' : undefined}
          />
          {errors.email && (
            <p id="login-email-error" style={errorStyle}>{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="login-password" style={labelStyle}>Password</label>
          <div style={{ position: 'relative' }}>
            <input
              {...register('password')}
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Enter your password"
              style={{ ...inputStyle, paddingRight: 48 }}
              onFocus={(e) => { e.target.style.borderColor = 'var(--color-blue)'; e.target.style.background = '#fff' }}
              onBlur={(e) => { e.target.style.borderColor = 'rgba(0,0,0,0.1)'; e.target.style.background = 'rgba(0,0,0,0.02)' }}
              aria-describedby={errors.password ? 'login-password-error' : undefined}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              style={{
                position: 'absolute', right: 14, top: '50%',
                transform: 'translateY(-50%)',
                background: 'none', border: 'none',
                color: 'rgba(0,0,0,0.4)', cursor: 'pointer',
                padding: 4,
              }}
            >
              {showPassword
                ? <EyeOff style={{ width: 16, height: 16 }} />
                : <Eye style={{ width: 16, height: 16 }} />}
            </button>
          </div>
          {errors.password && (
            <p id="login-password-error" style={errorStyle}>{errors.password.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting || loginMutation.isPending}
          style={{
            width: '100%',
            background: 'var(--color-dark)',
            color: '#fff', border: 'none',
            borderRadius: 12, padding: '15px',
            fontFamily: "'Epilogue', sans-serif",
            fontWeight: 800, fontSize: '1rem',
            cursor: 'pointer',
            transition: 'background 0.2s, transform 0.2s',
            opacity: (isSubmitting || loginMutation.isPending) ? 0.6 : 1,
          }}
          onMouseEnter={(e) => { if (!isSubmitting && !loginMutation.isPending) { e.currentTarget.style.background = 'var(--color-blue)'; e.currentTarget.style.transform = 'translateY(-2px)' } }}
          onMouseLeave={(e) => { if (!isSubmitting && !loginMutation.isPending) { e.currentTarget.style.background = 'var(--color-dark)'; e.currentTarget.style.transform = 'translateY(0)' } }}
        >
          {loginMutation.isPending ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
