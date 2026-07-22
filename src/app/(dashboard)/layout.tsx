import { AuthGuard } from '@/components/layout/AuthGuard'
import { Navbar } from '@/components/layout/Navbar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard allowedRoles={['PATIENT', 'THERAPIST', 'ADMIN']}>
      <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
        <Navbar />
        {/* 80px offset clears the fixed navbar height (18px padding top/bottom + ~44px content) */}
        <main style={{ paddingTop: 88, paddingBottom: 80, paddingLeft: 24, paddingRight: 24 }}>
          {children}
        </main>
      </div>
    </AuthGuard>
  )
}
