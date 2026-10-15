// User and Auth
export interface GuardianLink {
  id: string
  patientId: string
  guardianEmail: string
  guardianName?: string
  guardianPhone?: string
  relationship?: string
  isConfirmed: boolean
}

export interface User {
  id: string
  email: string
  name: string
  role: 'PATIENT' | 'THERAPIST' | 'ADMIN' | 'GUARDIAN'
  profileImage?: string
  phone?: string
  guardianLink?: GuardianLink
  isActive: boolean
  createdAt: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthResponse {
  id: string
  name: string
  role: 'PATIENT' | 'THERAPIST' | 'ADMIN' | 'GUARDIAN'
  accessToken: string
  refreshToken: string
}

// Journal
export type EmotionLabel =
  | 'joy' | 'sadness' | 'anger'
  | 'fear' | 'disgust' | 'surprise' | 'neutral'

export interface JournalEntry {
  id: string
  userId: string
  title?: string
  content: string
  detectedEmotion?: EmotionLabel
  emotionScore?: number
  isCrisis: boolean
  therapistComment?: string
  isReviewed: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateJournalDTO {
  title?: string
  content: string
}

export interface JournalResponse {
  entry: JournalEntry
  emotionResult?: {
    emotion: EmotionLabel
    score: number
    isCrisis: boolean
  }
}

// API wrapper
export interface ApiResponse<T> {
  data: T
  message?: string
  statusCode: number
}

export interface PaginatedResponse<T> {
  entries: T[]
  total: number
  page: number
  totalPages: number
}

// API error shape from NestJS
export interface ApiError {
  message: string
  statusCode: number
  timestamp: string
  path: string
}

// Notifications (GET /notification/my)
export interface AppNotification {
  id: string
  userId: string
  title: string
  message: string
  /** e.g. CRISIS_DETECTED (to a patient), CRISIS_ALERT (to a linked therapist), APPOINTMENT_*, REPORT_SENT */
  type: string
  isRead: boolean
  /** CRISIS_ALERT only: the patient the alert is about */
  relatedUserId?: string | null
  createdAt: string
}

// Therapist applications (therapist uploads a CV + photo; an admin reviews)
export type VerificationStatus = 'NOT_SUBMITTED' | 'PENDING' | 'APPROVED' | 'REJECTED'

export interface TherapistDocumentMeta {
  id: string
  kind: 'CV' | 'PHOTO'
  fileName: string
  mimeType: string
  size: number
  createdAt: string
}

export interface TherapistApplication {
  id: string
  userId: string
  bio?: string | null
  specializations: string[]
  qualifications: string[]
  experienceYears: number
  consultationFee?: number | null
  /** International digits only, e.g. 923001234567 */
  whatsappNumber?: string | null
  isVerified: boolean
  verificationStatus: VerificationStatus
  submittedAt?: string | null
  reviewedAt?: string | null
  /** The admin's reason when an application is rejected */
  reviewNote?: string | null
  createdAt: string
  documents: TherapistDocumentMeta[]
  /** Present on admin responses */
  user?: { id: string; name: string; email: string; phone?: string | null; isActive: boolean; createdAt: string }
}

export interface UploadedFile {
  fileName: string
  /** base64 data URL */
  data: string
}

export interface SubmitTherapistApplication {
  bio: string
  specializations: string[]
  qualifications: string[]
  experienceYears: number
  consultationFee?: number
  whatsappNumber: string
  cv?: UploadedFile
  photo?: UploadedFile
}

// Therapist's patients (GET /user/patients). access=false: contacted on WhatsApp only, name only, no records.
export interface TherapistPatient {
  id: string
  name: string
  email?: string
  access: boolean
  viaAppointment: boolean
  sharedAt?: string | null
  contactedAt?: string | null
  lastSessionAt?: string | null
}

export interface MoodLogEntry {
  id: string
  mood: EmotionLabel
  intensity: number
  note?: string | null
  isCrisis: boolean
  /** Tone of the note from the emotion model; null if no note or the model was unavailable */
  detectedEmotion?: EmotionLabel | null
  emotionScore?: number | null
  loggedAt: string
}

export interface QuestionnaireResult {
  id: string
  type: 'PHQ9' | 'GAD7' | 'OCIR' | 'DASS21'
  score: number
  severityLabel: string
  subscores?: Record<string, { score: number; severity: string }> | null
  createdAt: string
}

export interface RiskAssessmentResult {
  id: string
  depressionRisk: number | null
  anxietyRisk: number | null
  stressRisk: number | null
  ocdRisk: number | null
  crisisFlag: boolean
  confidence: 'high' | 'low'
  inputsUsed: string[]
  computedAt: string
}

export interface WeeklyReportSummary {
  id: string
  weekStartDate: string
  weekEndDate: string
  dominantEmotion?: EmotionLabel | null
  averageMoodScore?: number | null
  totalMoodLogs: number
  totalJournalEntries: number
  crisisEventsCount: number
  totalChatSessions: number
  exercisesCompleted: number
  appointmentsHeld: number
}
