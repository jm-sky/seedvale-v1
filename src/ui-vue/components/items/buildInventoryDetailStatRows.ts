import type { InventoryGroupView, InventoryInstanceRow } from '../../../items/inventoryView'
import type { DetailStatRow } from './buildItemDetailPresentation'
import { FOOD_SOURCE_SPECIES_LABEL, foodHungerRelief, FRESHNESS_STAGE_LABEL } from '../../../items/foodFreshness'
import {
  type BookTier,
  CAPABILITY_LABEL,
  consumeNeedNoun,
  type ItemCatalogEntry,
} from '../../../items/itemCatalog'
import { ITEM_DEFS, type ItemKind } from '../../../items/items'
import { resolveReadBookUseView } from '../../../items/itemUseView'
import { tradeValue } from '../../../items/tradeCatalog'
import { SKILL_LABEL } from '../../../player/PlayerSkills'
import { formatCoins } from '../../lib/formatCoins'
import {
  catalogueStatStrength,
  INVENTORY_DETAIL_STAT_CEILINGS,
} from './catalogueStatStrength'

const CEILINGS = INVENTORY_DETAIL_STAT_CEILINGS

const BOOK_TIER_LABEL: Record<BookTier, string> = {
  basic: 'podstawowy',
  intermediate: 'średniozaawansowany',
  advanced: 'zaawansowany',
}

const LIQUID_LABEL: Record<string, string> = {
  water: 'woda',
  milk: 'mleko',
}

function formatWeight(kg: number): string {
  return `${kg.toFixed(1)} kg`
}

function formatSeconds(value: number): string {
  const rounded = Math.round(value * 100) / 100
  return `${rounded} s`
}

function percent(value: number): string {
  return `${Math.round(value * 100)}%`
}

function unavailable(label: string, icon?: DetailStatRow['icon']): DetailStatRow {
  return { group: 'main', label, value: '—', unavailable: true, icon }
}

function bodyUnavailable(label: string, icon?: DetailStatRow['icon']): DetailStatRow {
  return { group: 'body', label, value: '—', unavailable: true, icon }
}

function valueUnavailable(label: string, icon?: DetailStatRow['icon']): DetailStatRow {
  return { group: 'value', label, value: '—', unavailable: true, icon }
}

/** Compatible ammo label (first kind) plus owned sum; counts above 99 show as ×99+. */
export function formatAmmoStat(
  ammoKinds: readonly ItemKind[],
  counts: Partial<Record<string, number>>,
): string {
  const primary = ammoKinds[0]
  if (!primary) return '—'
  const label = ITEM_DEFS[primary]?.label ?? primary
  const total = ammoKinds.reduce((sum, kind) => sum + (counts[kind] ?? 0), 0)
  const qty = total > 99 ? '×99+' : `×${total}`
  return `${label} · ${qty}`
}

function meleeSpeedLabel(windUp: number, hitWindow: number, recovery: number): string {
  const cycle = windUp + hitWindow + recovery
  if (cycle < 0.35) return 'szybki'
  if (cycle < 0.55) return 'średni'
  return 'wolny'
}

export type BuildInventoryDetailStatRowsInput = {
  kind: ItemKind
  /** Instance selection = one physical piece; group = stackable / count row. */
  selectionType: 'instance' | 'group'
  liveKindCount: number
  unitWeightKg: number
  catalog: ItemCatalogEntry | null | undefined
  group: InventoryGroupView
  instance: InventoryInstanceRow | null
  counts: Partial<Record<string, number>>
  bookSkillValue: number | null
  merchantOpen: boolean
  isArmor: boolean
}

/**
 * V3-shaped detail rows for V1 data: main → resist → body → value, then V1-only extras.
 * Stack quantity only for group (stackable) selections. Donor-only fields stay labeled unavailable.
 */
export function buildInventoryDetailStatRows(input: BuildInventoryDetailStatRowsInput): DetailStatRow[] {
  const main: DetailStatRow[] = []
  const body: DetailStatRow[] = []
  const value: DetailStatRow[] = []
  const extra: DetailStatRow[] = []

  const def = ITEM_DEFS[input.kind]
  const melee = input.catalog?.melee ?? null
  const ranged = input.catalog?.ranged ?? null
  const armor = input.catalog?.armor ?? null
  const consumable = input.catalog?.consumable ?? null
  const book = input.catalog?.book ?? null
  const isCombat = melee != null || ranged != null
  const isToolish = !isCombat && !input.isArmor && (input.catalog?.capabilities?.length ?? 0) > 0

  if (isCombat) {
    main.push(unavailable('Klasa', 'class'))
  }

  if (melee) {
    main.push({
      group: 'main',
      label: 'Obrażenia',
      value: melee.damage.toString(),
      icon: 'damage',
      strength: catalogueStatStrength(melee.damage, CEILINGS.damage),
    })
    main.push({
      group: 'main',
      label: 'Odnowienie',
      value: formatSeconds(melee.recovery),
      icon: 'cooldown',
      strength: catalogueStatStrength(melee.recovery, CEILINGS.recovery),
    })
    // DPS placeholder inserted by buildItemDetailPresentation
    main.push({
      group: 'main',
      label: 'Wysiłek',
      value: String(melee.staminaCost),
      icon: 'stamina',
      strength: catalogueStatStrength(melee.staminaCost, CEILINGS.staminaCost),
    })
    main.push({
      group: 'main',
      label: 'Zasięg',
      value: `${melee.range.toFixed(1)} m`,
      icon: 'reach',
      strength: catalogueStatStrength(melee.range, CEILINGS.meleeRange),
    })
    extra.push({
      group: 'extra',
      label: 'Szybkość',
      value: meleeSpeedLabel(melee.windUp, melee.hitWindow, melee.recovery),
    })
  }

  if (ranged) {
    main.push({
      group: 'main',
      label: 'Obrażenia',
      value: ranged.damage.toString(),
      icon: 'damage',
      strength: catalogueStatStrength(ranged.damage, CEILINGS.damage),
    })
    main.push({
      group: 'main',
      label: 'Odnowienie',
      value: formatSeconds(ranged.recovery),
      icon: 'cooldown',
      strength: catalogueStatStrength(ranged.recovery, CEILINGS.recovery),
    })
    main.push({
      group: 'main',
      label: 'Wysiłek',
      value: String(ranged.staminaCost),
      icon: 'stamina',
      strength: catalogueStatStrength(ranged.staminaCost, CEILINGS.staminaCost),
    })
    main.push({
      group: 'main',
      label: 'Zasięg',
      value: `${ranged.range.toFixed(1)} m`,
      icon: 'range',
      strength: catalogueStatStrength(ranged.range, CEILINGS.rangedRange),
    })
    main.push({
      group: 'main',
      label: 'Amunicja',
      value: formatAmmoStat(ranged.ammoKinds, input.counts),
      icon: 'ammo',
    })
    main.push({
      group: 'main',
      label: 'Naciąg',
      value: formatSeconds(ranged.drawTime),
      icon: 'drawTime',
    })
    main.push({
      group: 'main',
      label: 'Pręd. pocisku',
      value: `${Math.round(ranged.projectileSpeed)} m/s`,
      icon: 'projectileSpeed',
    })
    extra.push({
      group: 'extra',
      label: 'Celność',
      value: percent(ranged.accuracy),
      icon: 'accuracy',
    })
    if (ranged.reloadTime != null) {
      extra.push({
        group: 'extra',
        label: 'Przeładowanie',
        value: formatSeconds(ranged.reloadTime),
        icon: 'cooldown',
      })
    }
  }

  if (input.isArmor && armor) {
    if (input.instance?.slotLabel) {
      main.push({ group: 'main', label: 'Slot', value: input.instance.slotLabel, icon: 'slot' })
    }
    const protection = input.instance?.protectionPercent ?? Math.round(armor.damageReduction * 100)
    main.push({
      group: 'main',
      label: 'Ochrona',
      value: `${protection}%`,
      icon: 'armor',
      strength: catalogueStatStrength(protection, CEILINGS.armorProtectionPercent),
    })
    extra.push({
      group: 'extra',
      label: 'Wysiłek ataku',
      value: input.instance?.staminaPenaltyLabel ?? '±0%',
      icon: 'stamina',
    })
    extra.push({
      group: 'extra',
      label: 'Tempo ataku',
      value: input.instance?.recoveryPenaltyLabel ?? '±0%',
    })
    extra.push({
      group: 'extra',
      label: 'Ruch',
      value: input.instance?.movementPenaltyLabel ?? '±0%',
      icon: 'speedPenalty',
    })
  } else if (input.instance?.slotLabel) {
    extra.push({ group: 'extra', label: 'Slot', value: input.instance.slotLabel, icon: 'slot' })
  }

  if (isToolish) {
    const caps = (input.catalog?.capabilities ?? []).map((cap) => CAPABILITY_LABEL[cap])
    if (caps.length > 0) {
      main.push({
        group: 'main',
        label: 'Zastosowania',
        value: caps.join(' · '),
        icon: 'capabilities',
      })
    }
  }

  if (consumable) {
    const relief = foodHungerRelief(input.kind, input.group.sourceSpecies)
    main.push({
      group: 'main',
      label: 'Efekt',
      value: `+${relief} ${consumeNeedNoun(consumable.need)}`,
      icon: 'nutrition',
    })
  }

  const freshness = input.group.freshnessStage
  if (freshness) {
    main.push({ group: 'main', label: 'Świeżość', value: FRESHNESS_STAGE_LABEL[freshness] })
  }
  const species = input.group.sourceSpecies
  if (species) {
    main.push({ group: 'main', label: 'Źródło', value: FOOD_SOURCE_SPECIES_LABEL[species] })
  }

  if (input.instance?.liquid !== undefined) {
    const liquid = input.instance.liquid
    main.push({
      group: 'main',
      label: 'Zawartość',
      value: liquid == null
        ? 'pusty'
        : `${LIQUID_LABEL[liquid] ?? liquid} · ${input.instance.amountLitres?.toFixed(1) ?? 0} / ${input.instance.capacityLitres?.toFixed(1) ?? 0} l`,
      icon: 'water',
    })
  }

  if (book) {
    main.push({
      group: 'main',
      label: 'Umiejętność',
      value: `${SKILL_LABEL[book.skill]} · ${BOOK_TIER_LABEL[book.tier]}`,
      icon: 'skill',
    })
    main.push({ group: 'main', label: 'Wymagane', value: percent(book.requiredSkillValue), icon: 'skill' })
    if (input.bookSkillValue != null) {
      main.push({ group: 'main', label: 'Twój poziom', value: percent(input.bookSkillValue), icon: 'skill' })
    }
    main.push({ group: 'main', label: 'Nauka do', value: percent(book.targetSkillValue), icon: 'skill' })
    const readUse = input.bookSkillValue != null
      ? resolveReadBookUseView(book, input.bookSkillValue)
      : null
    if (readUse) {
      extra.push({
        group: 'extra',
        label: 'Stan',
        value: readUse.reasonLabel || 'Możesz się nauczyć',
      })
    }
  }

  // Body block — V3 Size / Weight / Material
  if (isCombat || input.isArmor || isToolish || input.selectionType === 'instance') {
    body.push({
      group: 'body',
      label: 'Rozmiar',
      value: def.size,
      icon: 'size',
    })
    body.push({
      group: 'body',
      label: 'Waga',
      value: formatWeight(input.unitWeightKg),
      icon: 'weight',
      strength: catalogueStatStrength(input.unitWeightKg, CEILINGS.weightKg),
    })
    body.push(bodyUnavailable('Materiał', 'material'))
  } else {
    // Stackable goods: weight (+ total) without inventing combat body parity.
    body.push({
      group: 'body',
      label: 'Waga',
      value: formatWeight(def.weight),
      icon: 'weight',
      strength: catalogueStatStrength(def.weight, CEILINGS.weightKg),
    })
    if (input.liveKindCount > 1) {
      body.push({
        group: 'body',
        label: 'Waga łącznie',
        value: formatWeight(def.weight * input.liveKindCount),
        icon: 'weight',
      })
    }
    body.push({
      group: 'body',
      label: 'Rozmiar',
      value: def.size,
      icon: 'size',
    })
  }

  // Value block — quantity only for stackable group rows; durability/material-style donor slots.
  if (input.selectionType === 'group') {
    value.push({
      group: 'value',
      label: 'Ilość',
      value: `×${input.liveKindCount}`,
    })
  }

  if (isCombat || input.isArmor || input.selectionType === 'instance') {
    value.push(valueUnavailable('Trwałość', 'durability'))
  }

  const unitValue = tradeValue(input.kind)
  value.push({
    group: 'value',
    label: 'Wartość',
    value: formatCoins(unitValue),
    icon: 'price',
  })
  if (input.instance?.sellPrice != null && input.merchantOpen) {
    value.push({
      group: 'value',
      label: 'Sprzedaż',
      value: formatCoins(input.instance.sellPrice),
      icon: 'price',
    })
  }

  // V1-only context below donor layout (assignment badges stay on the list / actions, not here)
  if (!isToolish) {
    const caps = (input.catalog?.capabilities ?? []).map((cap) => CAPABILITY_LABEL[cap])
    if (caps.length > 0) {
      extra.push({
        group: 'extra',
        label: 'Zastosowania',
        value: caps.join(' · '),
        icon: 'capabilities',
      })
    }
  }

  return [...main, ...body, ...value, ...extra]
}
