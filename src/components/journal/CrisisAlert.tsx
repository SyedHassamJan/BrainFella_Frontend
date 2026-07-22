import { AlertTriangle, Phone } from 'lucide-react'

export function CrisisAlert() {
  return (
    <div
      role="alert"
      className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-6"
    >
      <div className="flex items-start gap-3 mb-4">
        <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-bold text-red-900 text-lg mb-1">
            We are concerned about you
          </h3>
          <p className="text-red-700 text-sm leading-relaxed">
            It sounds like you may be going through something very serious.
            You are not alone and you deserve support right now.
          </p>
        </div>
      </div>
      <div className="bg-white rounded-xl p-4 border border-red-100">
        <div className="flex items-center gap-3">
          <Phone className="w-5 h-5 text-red-600" />
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">
              Umang Helpline Pakistan — 24/7
            </p>
            <p className="text-2xl font-bold text-red-600 tracking-wide">
              0317-4288665
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
