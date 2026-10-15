'use client'

import { useEffect, useMemo, useState } from 'react'
import { CheckCircle, Clock, AlertCircle, FileText, Image as ImageIcon, Upload } from 'lucide-react'
import type { AxiosError } from 'axios'
import { Spinner } from '@/components/ui/Spinner'
import { readFileAsDataUrl, useMyApplication, useSubmitApplication } from '@/hooks/useTherapistApplication'
import type { UseMutationResult } from '@tanstack/react-query'
import type { SubmitTherapistApplication } from '@/types'
import type { ApiError, TherapistApplication, UploadedFile, VerificationStatus } from '@/types'

// ─── Shared style tokens (match the settings page) ────────────────
const card: React.CSSProperties = {
  background: '#ffffff',
  border: '1.5px solid rgba(0,0,0,0.06)',
  borderRadius: 24,
  padding: '32px 36px',
  marginBottom: 24,
  boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
}

const label: React.CSSProperties = {
  fontFamily: "'Epilogue', sans-serif",
  fontSize: '0.72rem',
  fontWeight: 800,
  letterSpacing: '1px',
  textTransform: 'uppercase',
  color: 'rgba(0,0,0,0.45)',
  marginBottom: 6,
  display: 'block',
}

const input: React.CSSProperties = {
  width: '100%',
  background: 'rgba(0,0,0,0.02)',
  border: '1.5px solid rgba(0,0,0,0.08)',
  borderRadius: 12,
  padding: '12px 16px',
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '0.95rem',
  color: 'var(--color-dark)',
  outline: 'none',
  boxSizing: 'border-box',
}

const hint: React.CSSProperties = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '0.8rem',
  color: 'var(--color-text-muted)',
  marginTop: 6,
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
}

const MB = 1024 * 1024
const LIMITS = { cv: 5 * MB, photo: 2 * MB }

const STATUS: Record<VerificationStatus, { title: string; text: string; color: string; bg: string; Icon: typeof Clock }> = {
  NOT_SUBMITTED: {
    title: 'Complete your profile for review',
    text: 'Patients can see you once an administrator has reviewed your CV and approved your profile.',
    color: '#4b69f0', bg: 'rgba(75,105,240,0.07)', Icon: Upload,
  },
  PENDING: {
    title: 'Your application is under review',
    text: 'An administrator is checking your CV and profile. You will get a notification when it is approved. You can still correct details below.',
    color: '#b45309', bg: 'rgba(245,158,11,0.09)', Icon: Clock,
  },
  APPROVED: {
    title: 'Your profile is approved',
    text: 'You are visible to patients in the BrainHealth app. They can book sessions and message you on WhatsApp.',
    color: '#15803d', bg: 'rgba(34,197,94,0.09)', Icon: CheckCircle,
  },
  REJECTED: {
    title: 'Your application needs changes',
    text: 'Please update your details below and submit again.',
    color: '#be123c', bg: 'rgba(225,29,72,0.07)', Icon: AlertCircle,
  },
}

const splitList = (s: string) => s.split(',').map((x) => x.trim()).filter(Boolean)
const formatSize = (bytes: number) => (bytes >= MB ? `${(bytes / MB).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`)

function StatusBanner({ app }: { app: TherapistApplication }) {
  const s = STATUS[app.verificationStatus]
  return (
    <div style={{ ...card, background: s.bg, border: `1.5px solid ${s.color}33`, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
      <s.Icon size={24} color={s.color} style={{ flexShrink: 0, marginTop: 2 }} />
      <div>
        <h2 style={{ fontFamily: "'Epilogue', sans-serif", fontWeight: 800, fontSize: '1.1rem', color: s.color, marginBottom: 6 }}>{s.title}</h2>
        <p style={{ fontFamily: "'DM Sans', sans-serif", color: 'var(--color-dark)', fontSize: '0.95rem', lineHeight: 1.5 }}>{s.text}</p>
        {app.verificationStatus === 'REJECTED' && app.reviewNote ? (
          <p style={{ fontFamily: "'DM Sans', sans-serif", marginTop: 10, fontSize: '0.95rem' }}>
            <strong>Reviewer&apos;s note:</strong> {app.reviewNote}
          </p>
        ) : null}
      </div>
    </div>
  )
}

function FilePicker({
  kind, accept, current, chosen, onChoose, error,
}: {
  kind: 'cv' | 'photo'
  accept: string
  current?: { fileName: string; size: number }
  chosen: File | null
  onChoose: (f: File | null) => void
  error?: string
}) {
  const preview = useMemo(() => (kind === 'photo' && chosen ? URL.createObjectURL(chosen) : null), [kind, chosen])
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview) }, [preview])

  const Icon = kind === 'cv' ? FileText : ImageIcon
  return (
    <div>
      <span style={label}>{kind === 'cv' ? 'CV / qualification document' : 'Profile photo'}</span>
      <label
        style={{
          display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer',
          border: '1.5px dashed rgba(0,0,0,0.15)', borderRadius: 14, padding: '16px 18px',
          background: 'rgba(0,0,0,0.015)',
        }}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Chosen profile photo" style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover' }} />
        ) : (
          <Icon size={26} color="var(--color-blue)" />
        )}
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.92rem', color: 'var(--color-dark)' }}>
          {chosen
            ? `${chosen.name} (${formatSize(chosen.size)})`
            : current
              ? `Uploaded: ${current.fileName} (${formatSize(current.size)}). Click to replace.`
              : 'Click to choose a file'}
        </span>
        <input type="file" accept={accept} style={{ display: 'none' }} onChange={(e) => onChoose(e.target.files?.[0] ?? null)} />
      </label>
      <p style={hint}>{kind === 'cv' ? 'PDF, JPG or PNG, up to 5 MB.' : 'A clear photo of your face. JPG or PNG, up to 2 MB.'}</p>
      {error ? <p style={{ ...hint, color: '#e11d48' }}>{error}</p> : null}
    </div>
  )
}

function ApprovedSummary({ app }: { app: TherapistApplication }) {
  const rows: [string, string][] = [
    ['Specializations', app.specializations.join(', ') || '—'],
    ['Qualifications', app.qualifications.join(', ') || '—'],
    ['Experience', `${app.experienceYears} years`],
    ['Consultation fee', app.consultationFee ? `PKR ${app.consultationFee.toLocaleString()}` : '—'],
    ['WhatsApp', app.whatsappNumber ? `+${app.whatsappNumber}` : '—'],
  ]
  return (
    <div style={card}>
      <span style={label}>About you</span>
      <p style={{ fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6, marginBottom: 20 }}>{app.bio}</p>
      {rows.map(([k, v]) => (
        <div key={k} style={{ display: 'flex', gap: 16, padding: '10px 0', borderTop: '1px solid rgba(0,0,0,0.06)', fontFamily: "'DM Sans', sans-serif" }}>
          <span style={{ width: 170, color: 'var(--color-text-muted)' }}>{k}</span>
          <span style={{ color: 'var(--color-dark)', fontWeight: 600 }}>{v}</span>
        </div>
      ))}
    </div>
  )
}

export function ApplicationForm() {
  const { data: app, isLoading, error: loadError } = useMyApplication()
  const submit = useSubmitApplication()

  if (isLoading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}><Spinner /></div>
  if (loadError || !app) return <p style={{ color: '#e11d48' }}>Could not load your application. Please refresh the page.</p>

  if (app.verificationStatus === 'APPROVED') {
    return (
      <>
        <StatusBanner app={app} />
        <ApprovedSummary app={app} />
      </>
    )
  }

  // key: after each submission or review the form restarts from the saved values (and clears chosen files).
  return <EditForm key={`${app.submittedAt ?? ''}|${app.reviewedAt ?? ''}`} app={app} submit={submit} />
}

function EditForm({
  app, submit,
}: {
  app: TherapistApplication
  submit: UseMutationResult<TherapistApplication, Error, SubmitTherapistApplication>
}) {
  // Starts from what was submitted before (e.g. after a rejection).
  const [bio, setBio] = useState(app.bio ?? '')
  const [specializations, setSpecializations] = useState(app.specializations.join(', '))
  const [qualifications, setQualifications] = useState(app.qualifications.join(', '))
  const [experienceYears, setExperienceYears] = useState(app.experienceYears ? String(app.experienceYears) : '')
  const [fee, setFee] = useState(app.consultationFee ? String(app.consultationFee) : '')
  const [whatsapp, setWhatsapp] = useState(app.whatsappNumber ? `+${app.whatsappNumber}` : '')
  const [cv, setCv] = useState<File | null>(null)
  const [photo, setPhoto] = useState<File | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const currentCv = app.documents.find((d) => d.kind === 'CV')
  const currentPhoto = app.documents.find((d) => d.kind === 'PHOTO')
  const cvError = cv && cv.size > LIMITS.cv ? 'This file is larger than 5 MB.' : undefined
  const photoError = photo && photo.size > LIMITS.photo ? 'This image is larger than 2 MB.' : undefined

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    if (bio.trim().length < 30) return setFormError('Please write at least a few sentences about yourself (30+ characters).')
    if (!whatsapp.trim()) return setFormError('Please add the WhatsApp number patients can message you on.')
    if (!cv && !currentCv) return setFormError('Please upload your CV.')
    if (!photo && !currentPhoto) return setFormError('Please upload a profile photo.')
    if (cvError || photoError) return setFormError(cvError ?? photoError ?? null)

    const toUpload = async (f: File | null): Promise<UploadedFile | undefined> =>
      f ? { fileName: f.name, data: await readFileAsDataUrl(f) } : undefined

    submit.mutate({
        bio: bio.trim(),
        specializations: splitList(specializations),
        qualifications: splitList(qualifications),
        experienceYears: Number(experienceYears) || 0,
        consultationFee: fee ? Number(fee) : undefined,
        whatsappNumber: whatsapp.trim(),
        cv: await toUpload(cv),
        photo: await toUpload(photo),
    })
  }

  const apiError = (submit.error as AxiosError<ApiError> | null)?.response?.data?.message ?? (submit.error as Error | null)?.message

  return (
    <>
      <StatusBanner app={app} />
      <form onSubmit={onSubmit} style={card}>
        <div style={{ display: 'grid', gap: 22 }}>
          <div>
            <span style={label}>About you</span>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={5}
              maxLength={2000}
              placeholder="Your approach, who you work with, and how you can help students."
              style={{ ...input, resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18 }}>
            <div>
              <span style={label}>Specializations</span>
              <input value={specializations} onChange={(e) => setSpecializations(e.target.value)} placeholder="Anxiety, Depression, Exam stress" style={input} />
              <p style={hint}>Separate with commas.</p>
            </div>
            <div>
              <span style={label}>Qualifications</span>
              <input value={qualifications} onChange={(e) => setQualifications(e.target.value)} placeholder="MS Clinical Psychology, PhD" style={input} />
              <p style={hint}>Separate with commas.</p>
            </div>
            <div>
              <span style={label}>Years of experience</span>
              <input type="number" min={0} max={70} value={experienceYears} onChange={(e) => setExperienceYears(e.target.value)} style={input} />
            </div>
            <div>
              <span style={label}>Consultation fee (PKR, optional)</span>
              <input type="number" min={0} value={fee} onChange={(e) => setFee(e.target.value)} style={input} />
            </div>
            <div>
              <span style={label}>WhatsApp number</span>
              <input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="+92 300 1234567" style={input} />
              <p style={hint}>Patients will tap a button in the app to message you here.</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
            <FilePicker kind="cv" accept="application/pdf,image/jpeg,image/png,.pdf,.jpg,.jpeg,.png" current={currentCv} chosen={cv} onChoose={setCv} error={cvError} />
            <FilePicker kind="photo" accept="image/jpeg,image/png,.jpg,.jpeg,.png" current={currentPhoto} chosen={photo} onChoose={setPhoto} error={photoError} />
          </div>

          {formError || apiError ? (
            <p style={{ color: '#e11d48', fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem' }}>{formError ?? apiError}</p>
          ) : null}
          {submit.isSuccess && !submit.isPending ? (
            <p style={{ color: '#15803d', fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem' }}>Submitted. An administrator will review it soon.</p>
          ) : null}

          <div>
            <button type="submit" disabled={submit.isPending} style={{ ...primaryBtn, opacity: submit.isPending ? 0.6 : 1 }}>
              {submit.isPending ? <Spinner size="sm" /> : <Upload size={16} />}
              {app.verificationStatus === 'NOT_SUBMITTED' ? 'Submit for review' : 'Resubmit for review'}
            </button>
          </div>
        </div>
      </form>
    </>
  )
}
