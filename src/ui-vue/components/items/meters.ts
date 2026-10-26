/** Meter tones matching V3 item-card chrome (presentation only). */

export type MeterTone = 'bad' | 'edge' | 'good' | 'neutral' | 'warn'

export const CONDITION_GOOD_FROM = 0.7
export const CONDITION_WORN_FROM = 0.3

export function conditionTone(ratio: number): MeterTone {
  if (ratio <= 0) return 'bad'
  if (ratio >= CONDITION_GOOD_FROM) return 'good'
  return ratio >= CONDITION_WORN_FROM ? 'warn' : 'bad'
}

export const TONE_BAR: Record<MeterTone, string> = {
  bad: 'bg-bad',
  edge: 'bg-edge',
  good: 'bg-good',
  neutral: 'bg-neutral-400',
  warn: 'bg-warn',
}

export const TONE_TEXT: Record<MeterTone, string> = {
  bad: 'text-bad',
  edge: 'text-edge',
  good: 'text-good',
  neutral: 'text-neutral-300',
  warn: 'text-warn',
}
