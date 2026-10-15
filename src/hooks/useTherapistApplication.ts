import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import type { SubmitTherapistApplication, TherapistApplication, VerificationStatus } from '@/types'

/** Uploads carry a CV (up to 5 MB) and photo (up to 2 MB) as base64, so allow far more than the default 10 s. */
const UPLOAD_TIMEOUT_MS = 120_000

export const applicationKeys = {
  all: ['therapist-application'] as const,
  mine: () => [...applicationKeys.all, 'mine'] as const,
  adminList: (status?: VerificationStatus) => [...applicationKeys.all, 'admin', 'list', status ?? 'all'] as const,
  adminDetail: (userId: string) => [...applicationKeys.all, 'admin', 'detail', userId] as const,
}

// ─── Therapist ─────────────────────────────────────────────────────

export function useMyApplication(enabled = true) {
  return useQuery({
    queryKey: applicationKeys.mine(),
    queryFn: async (): Promise<TherapistApplication> => (await api.get<TherapistApplication>('/therapist/application/me')).data,
    enabled,
  })
}

export function useSubmitApplication() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (body: SubmitTherapistApplication): Promise<TherapistApplication> =>
      (await api.put<TherapistApplication>('/therapist/application', body, { timeout: UPLOAD_TIMEOUT_MS })).data,
    onSuccess: (data) => queryClient.setQueryData(applicationKeys.mine(), data),
  })
}

// ─── Admin ─────────────────────────────────────────────────────────

export function useApplications(status?: VerificationStatus) {
  return useQuery({
    queryKey: applicationKeys.adminList(status),
    queryFn: async (): Promise<TherapistApplication[]> =>
      (await api.get<TherapistApplication[]>('/admin/therapist-applications', { params: status ? { status } : {} })).data,
  })
}

export function useApplication(userId: string | null) {
  return useQuery({
    queryKey: applicationKeys.adminDetail(userId ?? ''),
    queryFn: async (): Promise<TherapistApplication> =>
      (await api.get<TherapistApplication>(`/admin/therapist-applications/${userId}`)).data,
    enabled: !!userId,
  })
}

/** The document endpoint needs the auth header, so it is fetched as a blob and shown via an object URL. */
export function useDocumentUrl(documentId: string | undefined) {
  return useQuery({
    queryKey: [...applicationKeys.all, 'admin', 'document', documentId ?? ''],
    queryFn: async (): Promise<string> => {
      const res = await api.get<Blob>(`/admin/therapist-applications/documents/${documentId}`, {
        responseType: 'blob',
        timeout: UPLOAD_TIMEOUT_MS,
      })
      return URL.createObjectURL(res.data)
    },
    enabled: !!documentId,
    staleTime: Infinity,
    gcTime: 5 * 60_000,
  })
}

export function useReviewApplication() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (args: { userId: string; decision: 'approve' | 'reject'; reason?: string }) =>
      (
        await api.patch<TherapistApplication>(
          `/admin/therapist-applications/${args.userId}/${args.decision}`,
          args.decision === 'reject' ? { reason: args.reason } : undefined
        )
      ).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: applicationKeys.all }),
  })
}

/** Reads a chosen file as a base64 data URL for upload. */
export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error ?? new Error('Could not read the file'))
    reader.readAsDataURL(file)
  })
}
