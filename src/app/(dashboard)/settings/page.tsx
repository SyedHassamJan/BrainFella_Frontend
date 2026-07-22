'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useProfile } from '@/hooks/useProfile'
import { useUpdateProfile, useAddGuardian } from '@/hooks/useUpdateProfile'
import { Spinner } from '@/components/ui/Spinner'
import { User, Phone, Shield, Camera, CheckCircle, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import type { AxiosError } from 'axios'
import type { ApiError } from '@/types'

// ─── Shared style tokens ──────────────────────────────────────────
const card: React.CSSProperties = {
  background: '#ffffff',
  border: '1.5px solid rgba(0,0,0,0.06)',
  borderRadius: 24,
  padding: '32px 36px',
  marginBottom: 24,
  boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
}

const sectionLabel: React.CSSProperties = {
  fontFamily: "'Epilogue', sans-serif",
  fontSize: '0.72rem',
  fontWeight: 800,
  letterSpacing: '1px',
  textTransform: 'uppercase',
  color: 'rgba(0,0,0,0.4)',
  marginBottom: 6,
  display: 'block',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(0,0,0,0.02)',
  border: '1.5px solid rgba(0,0,0,0.08)',
  borderRadius: 12,
  padding: '12px 16px',
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '0.95rem',
  color: 'var(--color-dark)',
  outline: 'none',
  transition: 'border-color 0.2s',
}

const inputDisabledStyle: React.CSSProperties = {
  ...inputStyle,
  background: 'rgba(0,0,0,0.03)',
  color: 'rgba(0,0,0,0.4)',
  cursor: 'not-allowed',
}

const primaryBtn: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  background: 'var(--color-dark)',
  color: '#fff',
  border: 'none',
  borderRadius: 12,
  padding: '13px 28px',
  fontFamily: "'Epilogue', sans-serif",
  fontWeight: 800,
  fontSize: '0.9rem',
  cursor: 'pointer',
  transition: 'background 0.2s, transform 0.15s',
}

// ─── Profile Schema ────────────────────────────────────────────────
const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z
    .string()
    .regex(/^[+\d\s()-]{7,15}$/, 'Enter a valid phone number')
    .optional()
    .or(z.literal('')),
})
type ProfileFormValues = z.infer<typeof profileSchema>

// ─── Guardian Schema ───────────────────────────────────────────────
const guardianSchema = z.object({
  guardianEmail: z.string().email('Enter a valid email'),
  guardianName: z.string().optional().or(z.literal('')),
  guardianPhone: z.string().optional().or(z.literal('')),
  relationship: z.string().optional().or(z.literal('')),
})
type GuardianFormValues = z.infer<typeof guardianSchema>

// ─── Field wrapper ─────────────────────────────────────────────────
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <span style={sectionLabel}>{label}</span>
      {children}
      {error && (
        <p style={{ color: '#e11d48', fontSize: '0.8rem', marginTop: 5, fontFamily: "'DM Sans', sans-serif" }}>
          {error}
        </p>
      )}
    </div>
  )
}

// ─── Profile Section ───────────────────────────────────────────────
function ProfileSection() {
  const { data: profile, isLoading } = useProfile()
  const updateProfile = useUpdateProfile()

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: profile ? { name: profile.name, phone: profile.phone ?? '' } : undefined,
  })

  const onSubmit = (values: ProfileFormValues) => {
    updateProfile.mutate({ name: values.name, phone: values.phone || undefined })
  }

  const axiosError = updateProfile.error as AxiosError<ApiError> | null
  const errorMessage = axiosError?.response?.data?.message ?? axiosError?.message

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}><Spinner /></div>
  }

  return (
    <div style={card}>
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28, paddingBottom: 24, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{
          width: 44, height: 44,
          background: 'rgba(75,105,240,0.08)',
          border: '1px solid rgba(75,105,240,0.15)',
          borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <User size={20} color="var(--color-blue)" />
        </div>
        <div>
          <h2 style={{ fontFamily: "'Epilogue', sans-serif", fontWeight: 900, fontSize: '1.2rem', color: 'var(--color-dark)', margin: 0, letterSpacing: '-0.3px' }}>
            Account Details
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", color: 'rgba(0,0,0,0.45)', fontSize: '0.875rem', margin: 0, marginTop: 2 }}>
            Update your name and contact info
          </p>
        </div>
      </div>

      {/* Avatar row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
        <div style={{ position: 'relative' }}>
          {profile?.profileImage ? (
            <Image src={profile.profileImage} alt="Profile" width={68} height={68}
              style={{ borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(0,0,0,0.08)' }} />
          ) : (
            <div style={{
              width: 68, height: 68,
              background: 'rgba(75,105,240,0.1)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <User size={28} color="var(--color-blue)" />
            </div>
          )}
          <button
            type="button"
            aria-label="Change profile picture"
            style={{
              position: 'absolute', bottom: -2, right: -2,
              width: 26, height: 26,
              background: 'var(--color-dark)', borderRadius: '50%',
              border: '2px solid var(--color-bg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}
          >
            <Camera size={12} color="#fff" />
          </button>
        </div>
        <div>
          <p style={{ fontFamily: "'Epilogue', sans-serif", fontWeight: 800, fontSize: '1.05rem', color: 'var(--color-dark)', margin: 0 }}>
            {profile?.name}
          </p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", color: 'rgba(0,0,0,0.4)', fontSize: '0.85rem', margin: '3px 0' }}>
            {profile?.email}
          </p>
          <span style={{
            display: 'inline-block',
            background: 'rgba(75,105,240,0.08)',
            color: 'var(--color-blue)',
            fontFamily: "'Epilogue', sans-serif",
            fontWeight: 700, fontSize: '0.72rem',
            letterSpacing: '0.8px', textTransform: 'uppercase',
            padding: '3px 10px', borderRadius: 999,
          }}>
            {profile?.role}
          </span>
        </div>
      </div>

      {/* Alerts */}
      {errorMessage && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'rgba(225,29,72,0.07)', border: '1px solid rgba(225,29,72,0.2)',
          borderRadius: 12, padding: '12px 16px', marginBottom: 20,
        }}>
          <AlertCircle size={16} color="#e11d48" />
          <p style={{ color: '#e11d48', fontSize: '0.875rem', fontFamily: "'DM Sans', sans-serif", margin: 0 }}>{errorMessage}</p>
        </div>
      )}
      {updateProfile.isSuccess && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.2)',
          borderRadius: 12, padding: '12px 16px', marginBottom: 20,
        }}>
          <CheckCircle size={16} color="#16a34a" />
          <p style={{ color: '#16a34a', fontSize: '0.875rem', fontFamily: "'DM Sans', sans-serif", margin: 0, fontWeight: 600 }}>
            Profile updated successfully!
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Field label="Full name" error={errors.name?.message}>
          <input {...register('name')} id="settings-name" type="text" placeholder="Your full name" style={inputStyle} />
        </Field>

        <Field label="Email address">
          <input id="settings-email" type="email" value={profile?.email ?? ''} disabled style={inputDisabledStyle} />
          <p style={{ fontSize: '0.75rem', color: 'rgba(0,0,0,0.35)', marginTop: 4, fontFamily: "'DM Sans', sans-serif" }}>
            Email cannot be changed
          </p>
        </Field>

        <Field label="Phone number" error={errors.phone?.message}>
          <div style={{ position: 'relative' }}>
            <Phone size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', opacity: 0.35 }} />
            <input {...register('phone')} id="settings-phone" type="tel" placeholder="+92 300 1234567"
              style={{ ...inputStyle, paddingLeft: 40 }} />
          </div>
        </Field>

        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <button
            type="submit"
            disabled={updateProfile.isPending}
            style={{ ...primaryBtn, opacity: updateProfile.isPending ? 0.6 : 1 }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-blue)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--color-dark)'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            {updateProfile.isPending ? 'Saving…' : <><CheckCircle size={15} /> Save changes</>}
          </button>
        </div>
      </form>
    </div>
  )
}

// ─── Guardian Section ──────────────────────────────────────────────
function GuardianSection() {
  const { data: profile, isLoading } = useProfile()
  const addGuardian = useAddGuardian()

  const { register, handleSubmit, formState: { errors } } = useForm<GuardianFormValues>({
    resolver: zodResolver(guardianSchema),
    values: profile?.guardianLink ? {
      guardianEmail: profile.guardianLink.guardianEmail,
      guardianName: profile.guardianLink.guardianName ?? '',
      guardianPhone: profile.guardianLink.guardianPhone ?? '',
      relationship: profile.guardianLink.relationship ?? '',
    } : undefined,
  })

  const onSubmit = (values: GuardianFormValues) => {
    addGuardian.mutate({
      guardianEmail: values.guardianEmail,
      guardianName: values.guardianName || undefined,
      guardianPhone: values.guardianPhone || undefined,
      relationship: values.relationship || undefined,
    })
  }

  const axiosError = addGuardian.error as AxiosError<ApiError> | null
  const errorMessage = axiosError?.response?.data?.message ?? axiosError?.message

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}><Spinner /></div>
  }

  return (
    <div style={card}>
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28, paddingBottom: 24, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{
          width: 44, height: 44,
          background: 'rgba(139,92,246,0.08)',
          border: '1px solid rgba(139,92,246,0.15)',
          borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Shield size={20} color="#7c3aed" />
        </div>
        <div>
          <h2 style={{ fontFamily: "'Epilogue', sans-serif", fontWeight: 900, fontSize: '1.2rem', color: 'var(--color-dark)', margin: 0, letterSpacing: '-0.3px' }}>
            Guardian / Emergency Contact
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", color: 'rgba(0,0,0,0.45)', fontSize: '0.875rem', margin: 0, marginTop: 2 }}>
            Weekly progress reports will be sent to your guardian
          </p>
        </div>
      </div>

      {errorMessage && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'rgba(225,29,72,0.07)', border: '1px solid rgba(225,29,72,0.2)',
          borderRadius: 12, padding: '12px 16px', marginBottom: 20,
        }}>
          <AlertCircle size={16} color="#e11d48" />
          <p style={{ color: '#e11d48', fontSize: '0.875rem', fontFamily: "'DM Sans', sans-serif", margin: 0 }}>{errorMessage}</p>
        </div>
      )}
      {addGuardian.isSuccess && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.2)',
          borderRadius: 12, padding: '12px 16px', marginBottom: 20,
        }}>
          <CheckCircle size={16} color="#16a34a" />
          <p style={{ color: '#16a34a', fontSize: '0.875rem', fontFamily: "'DM Sans', sans-serif", margin: 0, fontWeight: 600 }}>
            Guardian link saved!
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Field label="Guardian email *" error={errors.guardianEmail?.message}>
          <input {...register('guardianEmail')} id="guardian-email" type="email"
            placeholder="guardian@example.com" style={inputStyle} />
        </Field>

        <Field label="Guardian name" error={errors.guardianName?.message}>
          <input {...register('guardianName')} id="guardian-name" type="text"
            placeholder="Full name" style={inputStyle} />
        </Field>

        <Field label="Guardian phone" error={errors.guardianPhone?.message}>
          <input {...register('guardianPhone')} id="guardian-phone" type="tel"
            placeholder="+92 300 1234567" style={inputStyle} />
        </Field>

        <Field label="Relationship" error={errors.relationship?.message}>
          <select {...register('relationship')} id="guardian-relationship" style={inputStyle}>
            <option value="">Select relationship</option>
            <option value="Parent">Parent</option>
            <option value="Sibling">Sibling</option>
            <option value="Spouse">Spouse</option>
            <option value="Friend">Friend</option>
            <option value="Other">Other</option>
          </select>
        </Field>

        <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
          <button
            type="submit"
            disabled={addGuardian.isPending}
            style={{ ...primaryBtn, background: '#7c3aed', opacity: addGuardian.isPending ? 0.6 : 1 }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#6d28d9'; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#7c3aed'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            {addGuardian.isPending ? 'Saving…' : <><Shield size={15} /> Save guardian</>}
          </button>
        </div>
      </form>
    </div>
  )
}

// ─── Main Settings Page ─────────────────────────────────────────────
export default function SettingsPage() {
  return (
    <div style={{ maxWidth: 880, margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ marginBottom: 36 }}>
        <p style={{
          display: 'inline-block',
          fontFamily: "'Epilogue', sans-serif",
          fontSize: '0.72rem', fontWeight: 800,
          letterSpacing: '1px', textTransform: 'uppercase',
          color: 'var(--color-blue)',
          background: 'rgba(75,105,240,0.08)',
          border: '1px solid rgba(75,105,240,0.15)',
          padding: '4px 12px', borderRadius: 999,
          marginBottom: 14,
        }}>
          Your Account
        </p>
        <h1 style={{
          fontFamily: "'Epilogue', sans-serif",
          fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
          fontWeight: 900,
          letterSpacing: '-1.5px',
          color: 'var(--color-dark)',
          lineHeight: 1,
          margin: 0,
        }}>
          Settings
        </h1>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          color: 'rgba(0,0,0,0.45)',
          fontSize: '1rem',
          marginTop: 8,
        }}>
          Manage your account and preferences
        </p>
      </div>

      <ProfileSection />
      <GuardianSection />
    </div>
  )
}
