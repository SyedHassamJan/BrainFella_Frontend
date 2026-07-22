import { AlertCircle } from 'lucide-react'

export function ErrorMessage({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3"
    >
      <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
      <p className="text-sm text-red-700">{message}</p>
    </div>
  )
}
