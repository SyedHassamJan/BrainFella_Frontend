<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# BrainHealth Frontend — AI Coding Context

## ⚠️ READ SYSTEM DOCUMENTATION FIRST

The full system documentation is at the **repo root**:

```
../SYSTEM_DOCUMENTATION.md
```

or:

```
d:/CodeBaseLEGACY/FYP/SYSTEM_DOCUMENTATION.md
```

It contains: the complete API surface, DB schema, RBAC matrix, auth flow, Zustand store design, React Query patterns, and Axios interceptor logic. **Read it before adding any new feature.**

---

## Frontend Quick Reference

**Framework:** Next.js 16 (App Router) · **Port:** 3000 · **Language:** TypeScript strict  
**Backend API:** `http://localhost:8001` (set via `NEXT_PUBLIC_API_URL` in `.env.local`)

### Project structure (`src/`)
```
app/
  layout.tsx           ← root layout (QueryClientProvider + global effects)
  page.tsx             ← landing page (public)
  (auth)/              ← login, signup, callback pages (no AuthGuard)
  (dashboard)/         ← protected pages (AuthGuard wraps all children)
    layout.tsx         ← AuthGuard + Navbar
    journal/           ← journal list, detail, new, edit
    settings/          ← profile settings

components/
  layout/AuthGuard     ← redirects unauthenticated users; waits for _hasHydrated
  layout/Navbar        ← role-aware navigation
  effects/             ← SmoothScroll (Lenis), CursorBubble, TransitionScribble

hooks/                 ← one hook per API resource (useJournals, useProfile, etc.)
store/authStore.ts     ← Zustand persist store (user, accessToken, refreshToken)
lib/api.ts             ← Axios instance with request interceptor (token inject)
                          + response interceptor (silent 401 refresh with failed-queue)
types/index.ts         ← all TypeScript interfaces (User, JournalEntry, AuthResponse …)
constants/routes.ts    ← ROUTES map (use this everywhere, never hardcode paths)
schemas/               ← Zod schemas for forms
```

### Key conventions
- **All API calls** go through `lib/api.ts` (the configured Axios instance) — never bare `fetch`
- **Auth state** lives in `useAuthStore` (Zustand + localStorage persist). Access via `useAuth()` hook
- **Server state** (journals, profile, etc.) fetched via React Query `useQuery` / `useMutation`
- **Query key factories** (e.g. `journalKeys`) must be used for all cache invalidation
- **Protected pages** must live inside `(dashboard)/` — `AuthGuard` handles the redirect
- **Never hardcode role strings** — check `user.role` against string literals `'PATIENT'`, `'THERAPIST'`, `'ADMIN'`, `'GUARDIAN'`
- **Routes** — always import from `constants/routes.ts`, never write `/journal` inline

### Dev commands
```bash
npm run dev    # start dev server on :3000
npm run build  # production build (only when explicitly needed)
npm run lint   # ESLint
```
