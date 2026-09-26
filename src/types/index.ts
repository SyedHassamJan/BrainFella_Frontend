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
