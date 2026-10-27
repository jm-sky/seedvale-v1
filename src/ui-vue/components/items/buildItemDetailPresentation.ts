import type { ItemKind } from '../../../items/items'
import type { ItemStatIconName } from './itemIcons'
import { ITEM_METER_LABEL, type ItemMeterKind } from '../../../items/inventoryView'
import { resolveItemIllustrationSrc } from './itemIllustrations'
import { conditionTone, type MeterTone } from './meters'

/** V3 ItemDetailCard groups; `extra` holds V1-only rows rendered below. */
export type DetailStatGroup = 'main' | 'resist' | 'body' | 'value' | 'extra'

export const DETAIL_STAT_GROUP_ORDER: readonly DetailStatGroup[] = [
  'main',
  'resist',
  'body',
  'value',
  'extra',
]

export type DetailStatRow = {
  label: string
  value: string
  /** D4: labeled unavailable placeholder — never a fabricated number. */
  unavailable?: boolean
  /** Optional V3 donor glyph beside the label. */
  icon?: ItemStatIconName
  /** 0..1 catalogue-relative strength; draws StatUnderline when set. */
  strength?: number
  /** Layout group; defaults to `main` when omitted (demos / legacy callers). */
  group?: DetailStatGroup
}

export type DetailMeterRow = {
  label: string
  /** 0..1 when available; null means D4 placeholder row. */
  ratio: number | null
  tone: MeterTone
  unavailable?: boolean
  title?: string
  /** Optional V3 donor glyph beside the meter label (e.g. durability). */
  icon?: ItemStatIconName
  /** Armor quality enum for coloured QualityTag. */
  quality?: import('../../../items/itemInstances').ArmorQuality | null
}

export type ItemDetailPresentation = {
  title: string
  meta: string
  description: string
  /** D4 lore: show italic quote when present; otherwise reserved unavailable line. */
  lore: string | null
  loreUnavailable: boolean
  illustrationSrc: string | null
  /** V3 InstanceMeters header — QualityTag when armor quality is known. */
  quality: import('../../../items/itemInstances').ArmorQuality | null
  qualityLabel: string | null
  /** Reference catalogue value in copper for the Wartość header line. */
  worthCoins: number | null
  /** Optional stack count shown beside quality/worth when > 1. */
  stackCount: number | null
  /** Condition / fill / sharpness / D4 wear bars only (quality lives in the header). */
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
  quality?: import('../../../items/itemInstances').ArmorQuality | null
  /** Reference catalogue value in copper (V3 Worth / Polish Wartość). */
  worthCoins?: number | null
  /** Stack / kind count for the header badge when > 1. */
  stackCount?: number | null
  /** When true, reserve armor-wear D4 placeholder (never treat sort-only 100 as wear). */
  showArmorWearPlaceholder?: boolean
  /**
   * When true, reserve a gray unavailable Stan bar for identity / ranged pieces
   * whose inventoryView 100% condition is display-only, not real wear.
   */
  showConditionUnavailablePlaceholder?: boolean
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
      icon: meterKind === 'fill' ? 'water' : 'durability',
    })
  }

  const sharpnessRatio = ratioFromPercent(input.sharpnessPercent)
  if (sharpnessRatio != null) {
    meters.push({
      label: 'Ostrość',
      ratio: sharpnessRatio,
      tone: 'edge',
      title: `${Math.round(sharpnessRatio * 100)}%`,
      icon: 'sharpness',
    })
  }

  if (input.showArmorWearPlaceholder) {
    meters.push({
      label: 'Zużycie',
      ratio: null,
      tone: 'neutral',
      unavailable: true,
      icon: 'durability',
    })
  }

  if (input.showConditionUnavailablePlaceholder) {
    meters.push({
      label: ITEM_METER_LABEL.condition,
      ratio: null,
      tone: 'neutral',
      unavailable: true,
      icon: 'durability',
    })
  }

  const stats: DetailStatRow[] = input.stats.map((row) => ({
    ...row,
    group: row.group ?? 'main',
  }))

  if (input.showDpsPlaceholder && !stats.some((s) => s.label === 'DPS')) {
    // Insert after Obrażenia / Odnowienie when present so the main grid matches V3 order.
    const dpsRow: DetailStatRow = {
      group: 'main',
      label: 'DPS',
      value: '—',
      unavailable: true,
      icon: 'dps',
    }
    const afterCooldown = stats.findIndex((s) => s.group === 'main' && s.label === 'Odnowienie')
    const afterDamage = stats.findIndex((s) => s.group === 'main' && s.label === 'Obrażenia')
    const insertAt = afterCooldown >= 0
      ? afterCooldown + 1
      : afterDamage >= 0
        ? afterDamage + 1
        : stats.findIndex((s) => s.group !== 'main')
    if (insertAt >= 0) stats.splice(insertAt, 0, dpsRow)
    else stats.push(dpsRow)
  }
  if (input.showResistPlaceholders) {
    const resistRows: DetailStatRow[] = [
      { group: 'resist', label: 'Cięcie', value: '—', unavailable: true, icon: 'armor' },
      { group: 'resist', label: 'Pchnięcie', value: '—', unavailable: true, icon: 'armor' },
      { group: 'resist', label: 'Obuch', value: '—', unavailable: true, icon: 'armor' },
    ]
    const firstAfterMain = stats.findIndex((s) => s.group === 'body' || s.group === 'value' || s.group === 'extra')
    if (firstAfterMain >= 0) stats.splice(firstAfterMain, 0, ...resistRows)
    else stats.push(...resistRows)
  }

  const lore = input.lore?.trim() ? input.lore.trim() : null
  const quality = input.quality ?? null
  const qualityLabel = input.qualityLabel?.trim() ? input.qualityLabel.trim() : null
  const worthCoins = input.worthCoins != null && Number.isFinite(input.worthCoins)
    ? Math.max(0, Math.round(input.worthCoins))
    : null
  const stackCount = input.stackCount != null && input.stackCount > 1
    ? Math.round(input.stackCount)
    : null

  return {
    title: input.title,
    meta: input.meta,
    description: input.description,
    lore,
    loreUnavailable: lore == null,
    illustrationSrc: resolveItemIllustrationSrc(input.kind),
    quality,
    qualityLabel,
    worthCoins,
    stackCount,
    meters,
    stats,
  }
}
