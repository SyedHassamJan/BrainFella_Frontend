import Link from 'next/link'
import { CheckCircle, ArrowRight } from 'lucide-react'
import { ROUTES } from '@/constants/routes'

const therapistBenefits = [
  'Manage your patient roster with ease',
  'Review AI-flagged journal entries instantly',
  'Leave therapy notes and comments securely',
  'Get weekly patient progress summaries',
  'Set your availability and accept bookings',
]

export function ForTherapists() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Text */}
          <div>
            <div className="inline-flex items-center gap-2 bg-violet-50 text-violet-700 rounded-full px-4 py-2 text-sm font-medium mb-6">
              For Therapists
            </div>
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight mb-6">
              A platform built for
              <span className="text-violet-600"> Pakistani therapists</span>
            </h2>
            <p className="text-lg text-slate-500 leading-relaxed mb-8">
              Join a growing network of verified mental health professionals.
              Manage your patients, track progress, and provide better care
              — all from one dashboard.
            </p>

            <ul className="space-y-3 mb-8">
              {therapistBenefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-slate-700">{benefit}</span>
                </li>
              ))}
            </ul>

            <Link
              href={ROUTES.SIGNUP}
              className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Join as a therapist
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Visual card */}
          <div className="relative">
            <div className="bg-gradient-to-br from-violet-600 to-blue-600 rounded-3xl p-8 text-white shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🧠</span>
                </div>
                <div>
                  <div className="font-bold text-lg">Patient Insights</div>
                  <div className="text-violet-200 text-sm">Real-time emotional analysis</div>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { label: 'Ahmad K.', emotion: 'Sadness', score: 72, crisis: false },
                  { label: 'Sara M.', emotion: 'Anxiety', score: 85, crisis: true },
                  { label: 'Bilal R.', emotion: 'Joy', score: 45, crisis: false },
                ].map((patient) => (
                  <div key={patient.label} className="bg-white/10 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <div className="font-medium">{patient.label}</div>
                      <div className="text-violet-200 text-sm">{patient.emotion}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-bold">{patient.score}%</div>
                      {patient.crisis && (
                        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                          Crisis
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Decorative blob */}
            <div className="absolute -z-10 -bottom-6 -right-6 w-48 h-48 bg-violet-100 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  )
}
