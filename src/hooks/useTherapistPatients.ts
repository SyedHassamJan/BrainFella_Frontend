import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import type {
  JournalEntry,
  MoodLogEntry,
  PaginatedResponse,
  QuestionnaireResult,
  RiskAssessmentResult,
  TherapistPatient,
  WeeklyReportSummary,
} from '@/types'

export const patientKeys = {
  all: ['therapist-patients'] as const,
  list: () => [...patientKeys.all, 'list'] as const,
  record: (patientId: string, kind: string) => [...patientKeys.all, 'record', patientId, kind] as const,
}

/** Patients linked to the signed-in therapist, plus those who only contacted them (no records). */
export function useTherapistPatients() {
  return useQuery({
    queryKey: patientKeys.list(),
    queryFn: async (): Promise<TherapistPatient[]> => (await api.get<TherapistPatient[]>('/user/patients')).data,
    refetchInterval: 60_000,
  })
}

// Each record endpoint returns 403 unless the patient is linked (appointment or sharing).
const get = <T,>(url: string, params?: object) => async (): Promise<T> => (await api.get<T>(url, { params })).data

export const usePatientJournal = (patientId: string) =>
  useQuery({ queryKey: patientKeys.record(patientId, 'journal'), queryFn: get<PaginatedResponse<JournalEntry>>(`/journal/patient/${patientId}`, { limit: 50 }) })

export const usePatientMoods = (patientId: string) =>
  useQuery({ queryKey: patientKeys.record(patientId, 'moods'), queryFn: get<MoodLogEntry[]>(`/mood/patient/${patientId}`) })

export const usePatientScreening = (patientId: string) =>
  useQuery({ queryKey: patientKeys.record(patientId, 'screening'), queryFn: get<RiskAssessmentResult[]>(`/screening/history/${patientId}`) })

export const usePatientQuestionnaires = (patientId: string) =>
  useQuery({ queryKey: patientKeys.record(patientId, 'questionnaires'), queryFn: get<QuestionnaireResult[]>(`/questionnaire/history/${patientId}`) })

export const usePatientReports = (patientId: string) =>
  useQuery({ queryKey: patientKeys.record(patientId, 'reports'), queryFn: get<WeeklyReportSummary[]>(`/report/patient/${patientId}`) })

export function useCommentOnJournal(patientId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ entryId, comment }: { entryId: string; comment: string }) =>
      (await api.patch<JournalEntry>(`/journal/${entryId}/comment`, { therapistComment: comment })).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: patientKeys.record(patientId, 'journal') }),
  })
}
