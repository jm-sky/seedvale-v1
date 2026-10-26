import { ITEM_METER_LABEL, type ItemMeterKind } from '../../../items/inventoryView'
import type { ItemKind } from '../../../items/items'
import { conditionTone, type MeterTone } from './meters'
import { resolveItemIllustrationSrc } from './itemIllustrations'

export type DetailStatRow = {
  label: string
  value: string
  /** D4: labeled unavailable placeholder — never a fabricated number. */
  unavailable?: boolean
}

export type DetailMeterRow = {
  label: string
  /** 0..1 when available; null means D4 placeholder row. */
  ratio: number | null
  tone: MeterTone
  unavailable?: boolean
  title?: string
}

export type ItemDetailPresentation = {
  title: string
  meta: string
  description: string
  /** D4 lore: show italic quote when present; otherwise reserved unavailable line. */
  lore: string | null
  loreUnavailable: boolean
  illustrationSrc: string | null
  meters: DetailMeterRow[]
  stats: DetailStatRow[]
}

export type BuildItemDetailPresentationInput = {
  kind: ItemKind
  title: string
  /** V1 categories joined · `×N` (no donor tier/availability). */
  meta: string
  description: string
  lore?: string | null
  /** Primary instance / uniform meters for #controls. */
  meterKind?: ItemMeterKind | null
  conditionPercent?: number | null
  sharpnessPercent?: number | null
  qualityLabel?: string | null
  /** When true, reserve armor-wear D4 placeholder (never treat sort-only 100 as wear). */
  showArmorWearPlaceholder?: boolean
  /** When true (weapons), reserve DPS D4 placeholder. */
  showDpsPlaceholder?: boolean
  /** When true (armor), reserve cut/pierce/blunt D4 placeholders. */
  showResistPlaceholders?: boolean
  /** Authoritative V1 stat rows (label/value). */
  stats: DetailStatRow[]
}

function ratioFromPercent(percent: number | null | undefined): number | null {
  if (percent == null || !Number.isFinite(percent)) return null
  return Math.min(1, Math.max(0, percent / 100))
}

/**
 * Pure presentation adapter for Stage A item details.
 * Does not import donor Item types, formulas, or inventory mutations.
 */
export function buildItemDetailPresentation(input: BuildItemDetailPresentationInput): ItemDetailPresentation {
  const meters: DetailMeterRow[] = []

  if (input.qualityLabel) {
    meters.push({
      label: 'Jakość',
      ratio: null,
      tone: 'neutral',
      title: input.qualityLabel,
    })
  }

  const meterKind = input.meterKind ?? null
  const conditionRatio = ratioFromPercent(input.conditionPercent)
  // Armor: never render sort-only condition as wear. Other families with a real meterKind do.
  const showConditionMeter = meterKind != null && conditionRatio != null && !input.showArmorWearPlaceholder
  if (showConditionMeter && meterKind) {
    meters.push({
      label: ITEM_METER_LABEL[meterKind],
      ratio: conditionRatio,
      tone: meterKind === 'fill' ? 'neutral' : conditionTone(conditionRatio!),
      title: `${Math.round(conditionRatio! * 100)}%`,
    })
  }

  const sharpnessRatio = ratioFromPercent(input.sharpnessPercent)
  if (sharpnessRatio != null) {
    meters.push({
      label: 'Ostrość',
      ratio: sharpnessRatio,
      tone: 'edge',
      title: `${Math.round(sharpnessRatio * 100)}%`,
    })
  }

  if (input.showArmorWearPlaceholder) {
    meters.push({
      label: 'Zużycie',
      ratio: null,
      tone: 'neutral',
      unavailable: true,
    })
  }

  const stats: DetailStatRow[] = [...input.stats]

  if (input.showDpsPlaceholder) {
    stats.push({ label: 'DPS', value: 'niedostępne', unavailable: true })
  }
  if (input.showResistPlaceholders) {
    stats.push(
      { label: 'Cięcie', value: 'niedostępne', unavailable: true },
      { label: 'Pchnięcie', value: 'niedostępne', unavailable: true },
      { label: 'Obuch', value: 'niedostępne', unavailable: true },
    )
  }

  const lore = input.lore?.trim() ? input.lore.trim() : null

  return {
    title: input.title,
    meta: input.meta,
    description: input.description,
    lore,
    loreUnavailable: lore == null,
    illustrationSrc: resolveItemIllustrationSrc(input.kind),
    meters,
    stats,
  }
}
