'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { signupSchema, type SignupFormValues } from '@/schemas/signupSchema'
import { useSignup } from '@/hooks/useSignup'
import { PasswordStrength } from './PasswordStrength'
import type { AxiosError } from 'axios'
import type { ApiError } from '@/types'

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(0,0,0,0.02)',
  border: '1px solid rgba(0,0,0,0.1)',
  borderRadius: 12,
  padding: '13px 16px',
  color: 'var(--color-dark)',
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '0.95rem',
  outline: 'none',
  transition: 'border-color 0.2s ease, background 0.2s ease',
  boxSizing: 'border-box',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.85rem',
  fontWeight: 700,
  color: 'var(--color-dark)',
  marginBottom: 7,
  fontFamily: "'Epilogue', sans-serif",
}

const errorStyle: React.CSSProperties = {
  marginTop: 5,
  fontSize: '0.78rem',
  color: '#e11d48',
  fontFamily: "'DM Sans', sans-serif",
}

export function SignupForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const signupMutation = useSignup()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { role: 'PATIENT', acceptTerms: false },
  })

  const password = watch('password', '')

  const onSubmit = (values: SignupFormValues) => {
    signupMutation.mutate(values)
  }

  const axiosError = signupMutation.error as AxiosError<ApiError> | null
  const errorMessage =
    axiosError?.response?.data?.message ?? axiosError?.message

  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = 'var(--color-blue)'
    e.target.style.background = '#fff'
  }
  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = 'rgba(0,0,0,0.1)'
    e.target.style.background = 'rgba(0,0,0,0.02)'
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

      <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

        {/* Full name */}
        <div>
          <label htmlFor="signup-name" style={labelStyle}>Full name</label>
          <input
            {...register('name')}
            id="signup-name"
            type="text"
            autoComplete="name"
            placeholder="Your full name"
            style={inputStyle}
            onFocus={onFocus} onBlur={onBlur}
          />
          {errors.name && <p style={errorStyle}>{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="signup-email" style={labelStyle}>Email address</label>
          <input
            {...register('email')}
            id="signup-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            style={inputStyle}
            onFocus={onFocus} onBlur={onBlur}
          />
          {errors.email && <p style={errorStyle}>{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="signup-password" style={labelStyle}>Password</label>
          <div style={{ position: 'relative' }}>
            <input
              {...register('password')}
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="At least 8 characters"
              style={{ ...inputStyle, paddingRight: 44 }}
              onFocus={onFocus} onBlur={onBlur}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              style={{
                position: 'absolute', right: 12, top: '50%',
                transform: 'translateY(-50%)',
                background: 'none', border: 'none',
                color: 'rgba(0,0,0,0.4)', cursor: 'pointer', padding: 4,
              }}
            >
              {showPassword ? <EyeOff style={{ width: 15, height: 15 }} /> : <Eye style={{ width: 15, height: 15 }} />}
            </button>
          </div>
          {password && <PasswordStrength password={password} />}
          {errors.password && <p style={errorStyle}>{errors.password.message}</p>}
        </div>

        {/* Confirm password */}
        <div>
          <label htmlFor="signup-confirm" style={labelStyle}>Confirm password</label>
          <div style={{ position: 'relative' }}>
            <input
              {...register('confirmPassword')}
              id="signup-confirm"
              type={showConfirm ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Re-enter your password"
              style={{ ...inputStyle, paddingRight: 44 }}
              onFocus={onFocus} onBlur={onBlur}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
              style={{
                position: 'absolute', right: 12, top: '50%',
                transform: 'translateY(-50%)',
                background: 'none', border: 'none',
                color: 'rgba(0,0,0,0.4)', cursor: 'pointer', padding: 4,
              }}
            >
              {showConfirm ? <EyeOff style={{ width: 15, height: 15 }} /> : <Eye style={{ width: 15, height: 15 }} />}
            </button>
          </div>
          {errors.confirmPassword && <p style={errorStyle}>{errors.confirmPassword.message}</p>}
        </div>

        {/* Role selector */}
        <div>
          <label style={labelStyle}>I am signing up as</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {(['PATIENT', 'THERAPIST'] as const).map((role) => (
              <label
                key={role}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  border: '1px solid rgba(0,0,0,0.1)',
                  background: 'rgba(0,0,0,0.02)',
                  borderRadius: 12, padding: '12px',
                  cursor: 'pointer',
                  fontFamily: "'Epilogue', sans-serif",
                  fontWeight: 700, fontSize: '0.9rem',
                  color: 'var(--color-dark)',
                  transition: 'border-color 0.2s, background 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.2)'; e.currentTarget.style.background = '#fff' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)'; e.currentTarget.style.background = 'rgba(0,0,0,0.02)' }}
              >
                <input
                  {...register('role')}
                  type="radio"
                  value={role}
                  style={{ accentColor: 'var(--color-blue)' }}
                />
                {role === 'PATIENT' ? '🎓 Patient' : '🩺 Therapist'}
              </label>
            ))}
          </div>
          {errors.role && <p style={errorStyle}>{errors.role.message}</p>}
        </div>

        {/* Terms */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <input
            {...register('acceptTerms')}
            id="accept-terms"
            type="checkbox"
            style={{ marginTop: 2, accentColor: 'var(--color-blue)', cursor: 'pointer', width: 16, height: 16, flexShrink: 0 }}
          />
          <label htmlFor="accept-terms" style={{
            fontSize: '0.85rem',
            color: 'var(--color-text-muted)',
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500,
            lineHeight: 1.4, cursor: 'pointer',
          }}>
            I agree to the{' '}
            <span style={{ color: 'var(--color-blue)', fontWeight: 700 }}>Terms of Service</span>
            {' '}and{' '}
            <span style={{ color: 'var(--color-blue)', fontWeight: 700 }}>Privacy Policy</span>
          </label>
        </div>
        {errors.acceptTerms && <p style={errorStyle}>{errors.acceptTerms.message}</p>}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting || signupMutation.isPending}
          style={{
            width: '100%',
            background: 'var(--color-dark)',
            color: '#fff', border: 'none',
            borderRadius: 12, padding: '15px',
            fontFamily: "'Epilogue', sans-serif",
            fontWeight: 800, fontSize: '1rem',
            cursor: (isSubmitting || signupMutation.isPending) ? 'not-allowed' : 'pointer',
            opacity: (isSubmitting || signupMutation.isPending) ? 0.6 : 1,
            transition: 'background 0.2s, transform 0.2s',
          }}
          onMouseEnter={(e) => { if (!isSubmitting && !signupMutation.isPending) { e.currentTarget.style.background = 'var(--color-blue)'; e.currentTarget.style.transform = 'translateY(-2px)' } }}
          onMouseLeave={(e) => { if (!isSubmitting && !signupMutation.isPending) { e.currentTarget.style.background = 'var(--color-dark)'; e.currentTarget.style.transform = 'translateY(0)' } }}
        >
          {signupMutation.isPending ? 'Creating account…' : 'Create account'}
        </button>
      </form>
    </div>
  )
}
