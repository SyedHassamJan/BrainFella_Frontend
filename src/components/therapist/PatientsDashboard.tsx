'use client'

import { useState } from 'react'
import { AlertTriangle, Lock, MessageCircle, User as UserIcon } from 'lucide-react'
import type { AxiosError } from 'axios'
import { Spinner } from '@/components/ui/Spinner'
import { EMOTION_EMOJI, EMOTION_LABEL } from '@/constants/emotions'
import {
  useCommentOnJournal,
  usePatientJournal,
  usePatientMoods,
  usePatientQuestionnaires,
  usePatientReports,
  usePatientScreening,
  useTherapistPatients,
} from '@/hooks/useTherapistPatients'
import type { ApiError, JournalEntry, TherapistPatient } from '@/types'

const card: React.CSSProperties = {
  background: '#ffffff',
  border: '1.5px solid rgba(0,0,0,0.06)',
  borderRadius: 24,
  padding: '22px 26px',
  boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
}
const body: React.CSSProperties = { fontFamily: "'DM Sans', sans-serif", color: 'var(--color-dark)', fontSize: '0.95rem' }
const muted: React.CSSProperties = { ...body, color: 'var(--color-text-muted)', fontSize: '0.85rem' }
const heading: React.CSSProperties = { fontFamily: "'Epilogue', sans-serif", fontWeight: 800, color: 'var(--color-dark)' }
const label: React.CSSProperties = {
  fontFamily: "'Epilogue', sans-serif", fontSize: '0.72rem', fontWeight: 800, letterSpacing: '1px',
  textTransform: 'uppercase', color: 'rgba(0,0,0,0.45)', display: 'block', marginBottom: 8,
}
const crisisPill: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(190,18,60,0.08)', color: '#be123c',
  borderRadius: 999, padding: '3px 10px', fontSize: '0.75rem', fontWeight: 800, fontFamily: "'Epilogue', sans-serif",
}

const fmt = (iso?: string | null, withTime = true) =>
  iso ? new Date(iso).toLocaleString(undefined, withTime ? { dateStyle: 'medium', timeStyle: 'short' } : { dateStyle: 'medium' }) : '—'
const emotion = (e?: string | null) => (e ? `${EMOTION_EMOJI[e] ?? ''} ${EMOTION_LABEL[e] ?? e}` : '—')

function CrisisPill() {
  return <span style={crisisPill}><AlertTriangle size={12} /> Crisis flag</span>
}

function Loading() {
  return <div style={{ display: 'flex', justifyContent: 'center', padding: 30 }}><Spinner /></div>
}

function LoadError({ error }: { error: unknown }) {
  const status = (error as AxiosError | null)?.response?.status
  return (
    <p style={{ ...body, color: '#be123c' }}>
      {status === 403 ? 'This patient no longer shares their records with you.' : 'Could not load this section.'}
    </p>
  )
}

function Empty({ text }: { text: string }) {
  return <p style={muted}>{text}</p>
}

// ─── Record sections ──────────────────────────────────────────────

function JournalEntryCard({ entry, patientId }: { entry: JournalEntry; patientId: string }) {
  const comment = useCommentOnJournal(patientId)
  const [draft, setDraft] = useState('')
  const error = (comment.error as AxiosError<ApiError> | null)?.response?.data?.message
  return (
    <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', padding: '16px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 6 }}>
        <span style={{ ...heading, fontSize: '1rem' }}>{entry.title || 'Untitled entry'}</span>
        <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {entry.isCrisis ? <CrisisPill /> : null}
          <span style={muted}>{fmt(entry.createdAt)}</span>
        </span>
      </div>
      <p style={{ ...body, whiteSpace: 'pre-wrap', lineHeight: 1.55 }}>{entry.content}</p>
      <p style={{ ...muted, marginTop: 6 }}>Detected emotion: {emotion(entry.detectedEmotion)}</p>
      {entry.therapistComment ? (
        <p style={{ ...body, marginTop: 10, background: 'rgba(75,105,240,0.06)', borderRadius: 12, padding: '10px 14px' }}>
          <strong>Your note:</strong> {entry.therapistComment}
        </p>
      ) : (
        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Leave a supportive note (the patient can see it)"
            style={{ ...body, flex: 1, border: '1.5px solid rgba(0,0,0,0.1)', borderRadius: 10, padding: '9px 12px' }}
          />
          <button
            disabled={draft.trim().length < 5 || comment.isPending}
            onClick={() => comment.mutate({ entryId: entry.id, comment: draft.trim() })}
            style={{ ...heading, fontSize: '0.85rem', border: 'none', borderRadius: 10, padding: '9px 16px', cursor: 'pointer', background: 'var(--color-dark)', color: '#fff', opacity: draft.trim().length < 5 ? 0.5 : 1 }}
          >
            Save note
          </button>
        </div>
      )}
      {error ? <p style={{ ...muted, color: '#be123c' }}>{error}</p> : null}
    </div>
  )
}

function JournalSection({ patientId }: { patientId: string }) {
  const q = usePatientJournal(patientId)
  if (q.isLoading) return <Loading />
  if (q.error) return <LoadError error={q.error} />
  if (!q.data?.entries.length) return <Empty text="No journal entries yet." />
  return <div>{q.data.entries.map((e) => <JournalEntryCard key={e.id} entry={e} patientId={patientId} />)}</div>
}

function MoodSection({ patientId }: { patientId: string }) {
  const q = usePatientMoods(patientId)
  if (q.isLoading) return <Loading />
  if (q.error) return <LoadError error={q.error} />
  if (!q.data?.length) return <Empty text="No check-ins yet." />
  return (
    <div>
      {q.data.map((m) => (
        <div key={m.id} style={{ borderTop: '1px solid rgba(0,0,0,0.06)', padding: '12px 0', display: 'grid', gap: 4 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ ...body, fontWeight: 700 }}>Felt {emotion(m.mood)} · {m.intensity}/10</span>
            <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {m.isCrisis ? <CrisisPill /> : null}
              <span style={muted}>{fmt(m.loggedAt)}</span>
            </span>
          </div>
          {m.note ? <p style={{ ...body, whiteSpace: 'pre-wrap' }}>&ldquo;{m.note}&rdquo;</p> : null}
          {m.note ? (
            <span style={muted}>
              Tone of the note: {m.detectedEmotion ? emotion(m.detectedEmotion) : 'not analysed'}
              {m.detectedEmotion && m.detectedEmotion !== m.mood ? ' (differs from the mood they chose)' : ''}
            </span>
          ) : null}
        </div>
      ))}
    </div>
  )
}

const RISKS = [
  ['depressionRisk', 'Depression'],
  ['anxietyRisk', 'Anxiety'],
  ['stressRisk', 'Stress'],
  ['ocdRisk', 'OCD'],
] as const

function ScreeningSection({ patientId }: { patientId: string }) {
  const q = usePatientScreening(patientId)
  if (q.isLoading) return <Loading />
  if (q.error) return <LoadError error={q.error} />
  if (!q.data?.length) return <Empty text="No screening results yet." />
  return (
    <div>
      <p style={{ ...muted, marginBottom: 8 }}>Rule-based risk indicators (0–100) from questionnaires, text and facial signals. A screening result, not a diagnosis.</p>
      {[...q.data].reverse().map((a) => (
        <div key={a.id} style={{ borderTop: '1px solid rgba(0,0,0,0.06)', padding: '12px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 6 }}>
            <span style={muted}>{fmt(a.computedAt)} · {a.confidence} confidence · inputs: {a.inputsUsed.join(', ') || '—'}</span>
            {a.crisisFlag ? <CrisisPill /> : null}
          </div>
          <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
            {RISKS.map(([key, name]) => (
              <span key={key} style={body}><strong>{name}:</strong> {a[key] ?? '—'}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

const QUESTIONNAIRE_NAME: Record<string, string> = { PHQ9: 'PHQ-9 (depression)', GAD7: 'GAD-7 (anxiety)', OCIR: 'OCI-R (OCD)', DASS21: 'DASS-21' }

function QuestionnaireSection({ patientId }: { patientId: string }) {
  const q = usePatientQuestionnaires(patientId)
  if (q.isLoading) return <Loading />
  if (q.error) return <LoadError error={q.error} />
  if (!q.data?.length) return <Empty text="No questionnaires completed yet." />
  return (
    <div>
      {q.data.map((r) => (
        <div key={r.id} style={{ borderTop: '1px solid rgba(0,0,0,0.06)', padding: '12px 0', display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <span style={body}><strong>{QUESTIONNAIRE_NAME[r.type] ?? r.type}</strong> · score {r.score} · {r.severityLabel}</span>
          <span style={muted}>{fmt(r.createdAt)}</span>
        </div>
      ))}
    </div>
  )
}

function ReportSection({ patientId }: { patientId: string }) {
  const q = usePatientReports(patientId)
  if (q.isLoading) return <Loading />
  if (q.error) return <LoadError error={q.error} />
  if (!q.data?.length) return <Empty text="No weekly reports yet. They are generated every Sunday for patients who have linked a guardian." />
  return (
    <div>
      {q.data.map((r) => (
        <div key={r.id} style={{ borderTop: '1px solid rgba(0,0,0,0.06)', padding: '12px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 4 }}>
            <span style={{ ...body, fontWeight: 700 }}>Week of {fmt(r.weekStartDate, false)}</span>
            {r.crisisEventsCount > 0 ? <span style={crisisPill}><AlertTriangle size={12} /> {r.crisisEventsCount} crisis event{r.crisisEventsCount === 1 ? '' : 's'}</span> : null}
          </div>
          <span style={muted}>
            Mostly {emotion(r.dominantEmotion)} · avg intensity {r.averageMoodScore?.toFixed(1) ?? '—'} · {r.totalMoodLogs} check-ins ·{' '}
            {r.totalJournalEntries} journal entries · {r.totalChatSessions} chats · {r.exercisesCompleted} exercises · {r.appointmentsHeld} sessions
          </span>
        </div>
      ))}
    </div>
  )
}

const TABS = [
  { key: 'journal', label: 'Journal', Section: JournalSection },
  { key: 'moods', label: 'Check-ins', Section: MoodSection },
  { key: 'screening', label: 'Screening', Section: ScreeningSection },
  { key: 'questionnaires', label: 'Questionnaires', Section: QuestionnaireSection },
  { key: 'reports', label: 'Weekly reports', Section: ReportSection },
] as const

function PatientRecords({ patient }: { patient: TherapistPatient }) {
  const [tab, setTab] = useState<(typeof TABS)[number]['key']>('journal')
  const { Section } = TABS.find((t) => t.key === tab)!
  const how = [
    patient.viaAppointment ? 'You have a confirmed session together' : null,
    patient.sharedAt ? `They shared their records with you on ${fmt(patient.sharedAt, false)}` : null,
  ].filter(Boolean).join(' · ')
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={card}>
        <h2 style={{ ...heading, fontSize: '1.5rem', fontWeight: 900, marginBottom: 4 }}>{patient.name}</h2>
        <p style={muted}>{patient.email}{how ? ` · ${how}` : ''}</p>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              ...heading, fontSize: '0.85rem', border: 'none', borderRadius: 999, padding: '9px 18px', cursor: 'pointer',
              background: tab === t.key ? 'var(--color-dark)' : 'rgba(0,0,0,0.05)', color: tab === t.key ? '#fff' : 'var(--color-dark)',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div style={card}><Section patientId={patient.id} /></div>
    </div>
  )
}

function ContactedOnly({ patient }: { patient: TherapistPatient }) {
  return (
    <div style={{ ...card, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
      <Lock size={22} color="var(--color-text-muted)" style={{ flexShrink: 0, marginTop: 3 }} />
      <div>
        <h2 style={{ ...heading, fontSize: '1.3rem', marginBottom: 6 }}>{patient.name}</h2>
        <p style={{ ...body, lineHeight: 1.55 }}>
          Opened a WhatsApp chat with you on {fmt(patient.contactedAt)}. Their journal, check-ins and screening results stay private
          until they choose to share them with you in the app, or you confirm a booked session with them.
        </p>
      </div>
    </div>
  )
}

function PatientButton({ p, selected, onSelect }: { p: TherapistPatient; selected: boolean; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      style={{
        display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left', border: 'none', borderRadius: 14,
        padding: '11px 14px', cursor: 'pointer', background: selected ? 'rgba(75,105,240,0.08)' : 'transparent',
      }}
    >
      <span style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--color-lightblue)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {p.access ? <UserIcon size={16} color="#fff" /> : <MessageCircle size={16} color="#fff" />}
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ ...body, fontWeight: 700, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span>
        <span style={muted}>{p.access ? (p.sharedAt ? 'Shares records' : 'Booked session') : 'Contacted on WhatsApp'}</span>
      </span>
    </button>
  )
}

export function PatientsDashboard() {
  const { data, isLoading, error } = useTherapistPatients()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  if (isLoading) return <Loading />
  if (error) return <p style={{ ...body, color: '#be123c' }}>Could not load your patients. Please refresh.</p>

  const list = data ?? []
  const linked = list.filter((p) => p.access)
  const contacted = list.filter((p) => !p.access)
  const selected = list.find((p) => p.id === selectedId) ?? linked[0] ?? contacted[0] ?? null

  if (!list.length) {
    return (
      <div style={card}>
        <p style={body}>No patients yet. Patients appear here when they share their records with you, book a session you confirm, or message you on WhatsApp from the app.</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(240px, 300px) minmax(0, 1fr)', gap: 20, alignItems: 'start' }}>
      <div style={{ ...card, padding: 12 }}>
        <span style={{ ...label, padding: '6px 14px 0' }}>Can see records ({linked.length})</span>
        {linked.length ? linked.map((p) => <PatientButton key={p.id} p={p} selected={selected?.id === p.id} onSelect={() => setSelectedId(p.id)} />) : <p style={{ ...muted, padding: '0 14px 10px' }}>None yet.</p>}
        <span style={{ ...label, padding: '14px 14px 0' }}>Contacted you ({contacted.length})</span>
        {contacted.length ? contacted.map((p) => <PatientButton key={p.id} p={p} selected={selected?.id === p.id} onSelect={() => setSelectedId(p.id)} />) : <p style={{ ...muted, padding: '0 14px 10px' }}>None yet.</p>}
      </div>
      <div>
        {selected ? (selected.access ? <PatientRecords key={selected.id} patient={selected} /> : <ContactedOnly patient={selected} />) : null}
      </div>
    </div>
  )
}
