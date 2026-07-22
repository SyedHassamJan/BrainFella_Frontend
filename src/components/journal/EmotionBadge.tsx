import { EMOTION_STYLES, EMOTION_EMOJI, EMOTION_LABEL } from '@/constants/emotions'
import type { EmotionLabel } from '@/types'

interface EmotionBadgeProps {
  emotion: EmotionLabel
  score?: number
}

export function EmotionBadge({ emotion, score }: EmotionBadgeProps) {
  const styles = EMOTION_STYLES[emotion] ?? EMOTION_STYLES.neutral
  const emoji = EMOTION_EMOJI[emotion] ?? '😐'
  const label = EMOTION_LABEL[emotion] ?? 'Neutral'

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${styles}`}
    >
      <span aria-hidden="true">{emoji}</span>
      {label}
      {score !== undefined && (
        <span className="opacity-70 ml-0.5">({Math.round(score * 100)}%)</span>
      )}
    </span>
  )
}
