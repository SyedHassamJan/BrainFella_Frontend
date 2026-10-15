'use client'

import { useState } from 'react'
import { CheckCircle, ExternalLink, User as UserIcon, XCircle } from 'lucide-react'
import type { AxiosError } from 'axios'
import { Spinner } from '@/components/ui/Spinner'
import { useApplication, useApplications, useDocumentUrl, useReviewApplication } from '@/hooks/useTherapistApplication'
import type { ApiError, TherapistApplication, VerificationStatus } from '@/types'

const card: React.CSSProperties = {
  background: '#ffffff',
  border: '1.5px solid rgba(0,0,0,0.06)',
  borderRadius: 24,
  padding: '24px 28px',
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

const body: React.CSSProperties = { fontFamily: "'DM Sans', sans-serif", color: 'var(--color-dark)', fontSize: '0.95rem' }

const btn = (bg: string, color: string): React.CSSProperties => ({
  display: 'inline-flex', alignItems: 'center', gap: 8,
  background: bg, color, border: 'none', borderRadius: 12,
  padding: '12px 22px', fontFamily: "'Epilogue', sans-serif", fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer',
})

const TABS: { value: VerificationStatus | undefined; label: string }[] = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: undefined, label: 'All' },
]

const STATUS_STYLE: Record<VerificationStatus, { text: string; color: string; bg: string }> = {
  NOT_SUBMITTED: { text: 'Not submitted', color: '#64748b', bg: 'rgba(100,116,139,0.1)' },
  PENDING: { text: 'Pending', color: '#b45309', bg: 'rgba(245,158,11,0.12)' },
  APPROVED: { text: 'Approved', color: '#15803d', bg: 'rgba(34,197,94,0.12)' },
  REJECTED: { text: 'Rejected', color: '#be123c', bg: 'rgba(225,29,72,0.1)' },
}

const formatDate = (iso?: string | null) => (iso ? new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : '—')

function StatusPill({ status }: { status: VerificationStatus }) {
  const s = STATUS_STYLE[status]
  return (
    <span style={{ background: s.bg, color: s.color, borderRadius: 999, padding: '3px 10px', fontSize: '0.75rem', fontWeight: 800, fontFamily: "'Epilogue', sans-serif" }}>
      {s.text}
    </span>
  )
}

function Photo({ documentId, size }: { documentId?: string; size: number }) {
  const { data: url } = useDocumentUrl(documentId)
  if (!url) {
    return (
      <div style={{ width: size, height: size, borderRadius: '50%', background: 'var(--color-lightblue)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <UserIcon size={size / 2.4} color="#fff" />
      </div>
    )
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={url} alt="Therapist's uploaded photo" style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
}

function CvViewer({ doc }: { doc: TherapistApplication['documents'][number] }) {
  const { data: url, isLoading, error } = useDocumentUrl(doc.id)
  if (isLoading) return <div style={{ padding: 30, display: 'flex', justifyContent: 'center' }}><Spinner /></div>
  if (error || !url) return <p style={{ ...body, color: '#e11d48' }}>Could not load the CV.</p>
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, gap: 12 }}>
        <span style={{ ...body, fontWeight: 600 }}>{doc.fileName}</span>
        <a href={url} target="_blank" rel="noreferrer" style={{ ...body, display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--color-blue)', fontWeight: 700 }}>
          Open in new tab <ExternalLink size={14} />
        </a>
      </div>
      {doc.mimeType === 'application/pdf' ? (
        <iframe src={url} title="Therapist CV" style={{ width: '100%', height: 560, border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12 }} />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="Therapist CV" style={{ width: '100%', borderRadius: 12, border: '1px solid rgba(0,0,0,0.08)' }} />
      )}
    </div>
  )
}

function Detail({ userId }: { userId: string }) {
  const { data: app, isLoading } = useApplication(userId)
  const review = useReviewApplication()
  const [rejecting, setRejecting] = useState(false)
  const [reason, setReason] = useState('')

  if (isLoading || !app) return <div style={{ ...card, display: 'flex', justifyContent: 'center', padding: 60 }}><Spinner /></div>

  const photo = app.documents.find((d) => d.kind === 'PHOTO')
  const cv = app.documents.find((d) => d.kind === 'CV')
  const apiError = (review.error as AxiosError<ApiError> | null)?.response?.data?.message
  const rows: [string, React.ReactNode][] = [
    ['Email', app.user?.email],
    ['WhatsApp', app.whatsappNumber ? <a href={`https://wa.me/${app.whatsappNumber}`} target="_blank" rel="noreferrer">+{app.whatsappNumber}</a> : '—'],
    ['Specializations', app.specializations.join(', ') || '—'],
    ['Qualifications', app.qualifications.join(', ') || '—'],
    ['Experience', `${app.experienceYears} years`],
    ['Consultation fee', app.consultationFee ? `PKR ${app.consultationFee.toLocaleString()}` : '—'],
    ['Registered', formatDate(app.user?.createdAt)],
    ['Submitted', formatDate(app.submittedAt)],
    ['Reviewed', formatDate(app.reviewedAt)],
  ]

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 20 }}>
          <Photo documentId={photo?.id} size={88} />
          <div>
            <h2 style={{ fontFamily: "'Epilogue', sans-serif", fontWeight: 900, fontSize: '1.5rem', color: 'var(--color-dark)', marginBottom: 6 }}>{app.user?.name}</h2>
            <StatusPill status={app.verificationStatus} />
          </div>
        </div>

        <span style={label}>About</span>
        <p style={{ ...body, lineHeight: 1.6, marginBottom: 18, whiteSpace: 'pre-wrap' }}>{app.bio || '—'}</p>

        {rows.map(([k, v]) => (
          <div key={k} style={{ display: 'flex', gap: 16, padding: '9px 0', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
            <span style={{ ...body, width: 150, flexShrink: 0, color: 'var(--color-text-muted)' }}>{k}</span>
            <span style={{ ...body, fontWeight: 600, wordBreak: 'break-word' }}>{v}</span>
          </div>
        ))}

        {app.verificationStatus === 'REJECTED' && app.reviewNote ? (
          <p style={{ ...body, marginTop: 14, color: '#be123c' }}><strong>Rejection reason:</strong> {app.reviewNote}</p>
        ) : null}
      </div>

      <div style={card}>
        <span style={label}>CV / qualification document</span>
        {cv ? <CvViewer doc={cv} /> : <p style={body}>No CV uploaded.</p>}
      </div>

      {app.verificationStatus !== 'NOT_SUBMITTED' ? (
        <div style={card}>
          <span style={label}>Decision</span>
          {rejecting ? (
            <div style={{ display: 'grid', gap: 12 }}>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                placeholder="Tell the therapist what to fix, e.g. 'The CV scan is unreadable, please upload a clearer copy.'"
                style={{ ...body, width: '100%', borderRadius: 12, border: '1.5px solid rgba(0,0,0,0.1)', padding: '12px 14px', boxSizing: 'border-box' }}
              />
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button
                  style={{ ...btn('#be123c', '#fff'), opacity: reason.trim().length < 5 || review.isPending ? 0.5 : 1 }}
                  disabled={reason.trim().length < 5 || review.isPending}
                  onClick={() => review.mutate({ userId, decision: 'reject', reason: reason.trim() }, { onSuccess: () => setRejecting(false) })}
                >
                  <XCircle size={16} /> Send rejection
                </button>
                <button style={btn('rgba(0,0,0,0.06)', 'var(--color-dark)')} onClick={() => setRejecting(false)}>Cancel</button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {app.verificationStatus !== 'APPROVED' ? (
                <button
                  style={{ ...btn('#15803d', '#fff'), opacity: review.isPending ? 0.5 : 1 }}
                  disabled={review.isPending}
                  onClick={() => review.mutate({ userId, decision: 'approve' })}
                >
                  <CheckCircle size={16} /> Approve
                </button>
              ) : null}
              <button style={btn('rgba(225,29,72,0.08)', '#be123c')} onClick={() => setRejecting(true)}>
                <XCircle size={16} /> {app.verificationStatus === 'APPROVED' ? 'Revoke approval' : 'Reject'}
              </button>
            </div>
          )}
          {apiError ? <p style={{ ...body, color: '#e11d48', marginTop: 10 }}>{apiError}</p> : null}
        </div>
      ) : null}
    </div>
  )
}

export function ApplicationReview() {
  const [status, setStatus] = useState<VerificationStatus | undefined>('PENDING')
  const [selected, setSelected] = useState<string | null>(null)
  const { data: list, isLoading } = useApplications(status)

  // Fall back to the first item when the selection leaves the list (e.g. approved off the Pending tab).
  const current = list?.some((a) => a.userId === selected) ? selected : (list?.[0]?.userId ?? null)

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {TABS.map((t) => (
          <button
            key={t.label}
            onClick={() => setStatus(t.value)}
            style={{
              ...btn(status === t.value ? 'var(--color-dark)' : 'rgba(0,0,0,0.05)', status === t.value ? '#fff' : 'var(--color-dark)'),
              padding: '9px 18px', borderRadius: 999,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(240px, 320px) minmax(0, 1fr)', gap: 20, alignItems: 'start' }}>
        <div style={{ ...card, padding: 10 }}>
          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 30 }}><Spinner /></div>
          ) : !list?.length ? (
            <p style={{ ...body, padding: 18, color: 'var(--color-text-muted)' }}>No applications here.</p>
          ) : (
            list.map((a) => (
              <button
                key={a.userId}
                onClick={() => setSelected(a.userId)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left',
                  border: 'none', borderRadius: 14, padding: '12px 14px', cursor: 'pointer',
                  background: current === a.userId ? 'rgba(75,105,240,0.08)' : 'transparent',
                }}
              >
                <Photo documentId={a.documents.find((d) => d.kind === 'PHOTO')?.id} size={40} />
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ ...body, fontWeight: 700, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.user?.name}</span>
                  <span style={{ ...body, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{formatDate(a.submittedAt)}</span>
                </span>
                <StatusPill status={a.verificationStatus} />
              </button>
            ))
          )}
        </div>
        {/* key: switching applicant starts with a fresh decision panel */}
        <div>{current ? <Detail key={current} userId={current} /> : null}</div>
      </div>
    </div>
  )
}
