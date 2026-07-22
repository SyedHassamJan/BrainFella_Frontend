export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  JOURNAL: '/journal',
  JOURNAL_NEW: '/journal/new',
  JOURNAL_DETAIL: (id: string) => `/journal/${id}`,
  JOURNAL_EDIT: (id: string) => `/journal/${id}/edit`,
  SETTINGS: '/settings',
} as const
