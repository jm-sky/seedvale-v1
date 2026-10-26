<script setup lang="ts">
import { Apple, BookOpen, Package, ScrollText, Shield, Sword, Wheat } from 'lucide-vue-next'
import { type Component, computed, ref } from 'vue'
import ItemDetailCard from '@/components/items/ItemDetailCard.vue'
import ItemInstanceMeters from '@/components/items/ItemInstanceMeters.vue'
import {
  buildItemDetailPresentation,
  type DetailStatRow,
} from '@/components/items/buildItemDetailPresentation'
import ItemsScreenItemButton from '@/components/ItemsScreenItemButton.vue'
import { useItemCategoryLabels } from '@/composables/useItemCategoryLabels'
import { firstUpperCase } from '@/lib/firstUpperCase'
import type { EquipmentSlot } from '../../items/equipment'
import { FOOD_SOURCE_SPECIES_LABEL, foodHungerRelief, FRESHNESS_STAGE_LABEL } from '../../items/foodFreshness'
import { isToolKind } from '../../items/HeldTool'
import { ITEM_METER_LABEL } from '../../items/inventoryView'
import { CAPABILITY_LABEL, isMeleeToolKind, isRangedTool, isThrowableKind } from '../../items/itemCatalog'
import { type BookTier, consumeNeedNoun, ITEM_CATALOG } from '../../items/itemCatalog'
import { itemDisplayName } from '../../items/itemDisplay'
import { isArmorKind, isWeaponMaintenanceKind } from '../../items/itemInstances'
import { ITEM_DEFS, type ItemCategory, type ItemDef, type ItemKind, primaryItemCategory } from '../../items/items'
import { resolveReadBookUseView } from '../../items/itemUseView'
import { isPrimaryMeleeAssignment, isPrimaryRangedAssignment } from '../../items/primaryWeapons'
import { tradeValue } from '../../items/tradeCatalog'
import { SKILL_LABEL } from '../../player/PlayerSkills'
import { trapKindForItem } from '../../world/animalTraps'
import { useTouchScroll } from '../composables/useTouchScroll'
import { getSkillValue, openQuantityDialog, showToast, ui } from '../store'

const BOOK_TIER_LABEL: Record<BookTier, string> = {
  basic: 'podstawowy',
  intermediate: 'średniozaawansowany',
  advanced: 'zaawansowany',
}

const props = defineProps<{
  selectedItem: ItemKind | null
}>()

const emit = defineEmits<{
  'return-to-list': []
}>()

const panel = ref<HTMLElement | null>(null)
const { categoryLabel } = useItemCategoryLabels()

const CATEGORY_ICON: Record<ItemCategory, Component> = {
  weapon: Sword,
  armor: Shield,
  tool: Sword,
  resource: Wheat,
  utility: Package,
  food: Apple,
  knowledge: BookOpen,
  story: ScrollText,
  other: Package,
}

const item = computed<ItemDef | null>(() => props.selectedItem ? ITEM_DEFS[props.selectedItem] : null)
const displayName = computed(() => props.selectedItem ? itemDisplayName(props.selectedItem) : '')
const group = computed(() => props.selectedItem
  ? ui.inventory.groups.find((entry) => entry.kind === props.selectedItem) ?? null
  : null)
const itemCount = computed<number>(() => group.value?.count ?? ui.inventory.counts[props.selectedItem as ItemKind ?? ''] ?? 0)
const catalogEntry = computed(() => props.selectedItem ? ITEM_CATALOG[props.selectedItem] : null)
const melee = computed(() => catalogEntry.value?.melee ?? null)
const meleeSpeed = computed<string | null>(() => {
  const m = melee.value
  if (!m) return null
  const cycle = m.windUp + m.hitWindow + m.recovery
  if (cycle < 0.35) return 'szybki'
  if (cycle < 0.55) return 'średni'
  return 'wolny'
})
const ranged = computed(() => catalogEntry.value?.ranged ?? null)
const ammoText = computed<string | null>(() => {
  const r = ranged.value
  if (!r) return null
  return r.ammoKinds
    .map((kind) => `${ITEM_DEFS[kind].label}: ${ui.inventory.counts[kind] ?? 0}`)
    .join(' · ')
})
const armor = computed(() => catalogEntry.value?.armor ?? null)
const isArmorItem = computed(() => props.selectedItem != null && isArmorKind(props.selectedItem))
const equippedInstanceIdSet = computed(() => new Set(Object.values(ui.inventory.equippedSlots)))
function isArmorInstanceEquipped(id: string): boolean {
  return equippedInstanceIdSet.value.has(id)
}
const anyArmorEquipped = computed(() =>
  isArmorItem.value
  && (group.value?.instances.some((row) => isArmorInstanceEquipped(row.id)) ?? false),
)
const representativeArmorRow = computed(() => group.value?.instances[0] ?? null)
const percentDelta = (multiplier: number): string => {
  const delta = Math.round((multiplier - 1) * 100)
  return delta === 0 ? '±0%' : `${delta > 0 ? '+' : ''}${delta}%`
}
const consumable = computed(() => catalogEntry.value?.consumable ?? null)
const consumeUse = computed(() => group.value?.consumeUse ?? null)
const consumableRelief = computed(() => {
  if (!consumable.value || !props.selectedItem) return 0
  return foodHungerRelief(props.selectedItem, group.value?.sourceSpecies)
})
const freshnessLabel = computed(() => {
  const stage = group.value?.freshnessStage
  return stage ? FRESHNESS_STAGE_LABEL[stage] : null
})
const sourceSpeciesLabel = computed(() => {
  const species = group.value?.sourceSpecies
  return species ? FOOD_SOURCE_SPECIES_LABEL[species] : null
})
const book = computed(() => catalogEntry.value?.book ?? null)
const treasureMap = computed(() => catalogEntry.value?.treasureMap ?? null)
const bookSkillValue = computed<number | null>(() => book.value ? getSkillValue(book.value.skill) : null)
const readUse = computed(() => {
  const b = book.value
  const value = bookSkillValue.value
  return b && value != null ? resolveReadBookUseView(b, value) : null
})
const bookStateLabel = computed(() => readUse.value ? (readUse.value.reasonLabel || 'Możesz się nauczyć') : null)
const itemValue = computed<number>(() => item.value ? tradeValue(item.value.kind) : 0)
const itemCategoryText = computed(() => item.value ? item.value.categories.map((cat) => categoryLabel[cat]).join(' · ') : '')
const itemCategoryIcon = computed(() => item.value ? CATEGORY_ICON[primaryItemCategory(item.value)] : Sword)

const instanceRows = computed(() => {
  if (!group.value || group.value.instances.length === 0) return []
  const buckets = new Map<string, {
    count: number
    ids: string[]
    sellPrice: number
    meterKind: typeof group.value.instances[0]['meterKind']
    conditionPercent: number
    sharpnessPercent: number | null
    qualityLabel: string | null
    effectiveWeightKg: number | null
    protectionPercent: number | null
    staminaPenaltyLabel: string | null
    movementPenaltyLabel: string | null
    recoveryPenaltyLabel: string | null
    slotLabel: string | null
  }>()
  for (const row of group.value.instances) {
    const key = row.quality
      ? `quality:${row.quality}`
      : `${row.conditionPercent}:${row.sharpnessPercent ?? ''}`
    const existing = buckets.get(key)
    if (existing) {
      existing.count++
      existing.ids.push(row.id)
    } else {
      buckets.set(key, {
        count: 1,
        ids: [row.id],
        sellPrice: row.sellPrice,
        meterKind: row.meterKind,
        conditionPercent: row.conditionPercent,
        sharpnessPercent: row.sharpnessPercent,
        qualityLabel: row.qualityLabel ?? null,
        effectiveWeightKg: row.effectiveWeightKg ?? null,
        protectionPercent: row.protectionPercent ?? null,
        staminaPenaltyLabel: row.staminaPenaltyLabel ?? null,
        movementPenaltyLabel: row.movementPenaltyLabel ?? null,
        recoveryPenaltyLabel: row.recoveryPenaltyLabel ?? null,
        slotLabel: row.slotLabel ?? null,
      })
    }
  }
  return [...buckets.values()].sort((a, b) => {
    if (a.qualityLabel && b.qualityLabel) return a.qualityLabel.localeCompare(b.qualityLabel)
    return b.conditionPercent - a.conditionPercent
  })
})

const capabilityLabels = computed<string[]>(() => (catalogEntry.value?.capabilities ?? []).map((cap) => CAPABILITY_LABEL[cap]))

const whetstoneCount = computed<number>(() => ui.inventory.counts.whetstone ?? 0)
const merchantOpen = computed(() => ui.merchant.open)
const isPrimaryMelee = computed(() => props.selectedItem != null
  && ui.inventory.primaryMelee?.kind === props.selectedItem)
const isPrimaryRanged = computed(() => props.selectedItem != null
  && ui.inventory.primaryRanged?.kind === props.selectedItem)
const showSetPrimaryMelee = computed(() =>
  props.selectedItem != null
  && isMeleeToolKind(props.selectedItem)
  && !isWeaponMaintenanceKind(props.selectedItem)
  && !isPrimaryMelee.value)
const showSetPrimaryRanged = computed(() =>
  props.selectedItem != null
  && isRangedTool(props.selectedItem)
  && !isWeaponMaintenanceKind(props.selectedItem)
  && !isPrimaryRanged.value)

const presentation = computed(() => {
  if (!props.selectedItem || !item.value) return null
  const stats: DetailStatRow[] = []
  stats.push({ label: 'Kategoria', value: itemCategoryText.value })
  stats.push({ label: 'Ilość', value: `×${itemCount.value}` })
  stats.push({
    label: 'Waga',
    value: formatWeight(representativeArmorRow.value?.effectiveWeightKg ?? item.value.weight),
  })
  stats.push({ label: 'Wartość', value: `${itemValue.value} monet` })
  if (melee.value) {
    stats.push({ label: 'Obrażenia', value: melee.value.damage.toString() })
    stats.push({ label: 'Zasięg', value: `${melee.value.range.toFixed(1)} m` })
  }
  if (meleeSpeed.value) stats.push({ label: 'Szybkość ataku', value: meleeSpeed.value })
  if (ranged.value) {
    stats.push({ label: 'Obrażenia', value: ranged.value.damage.toString() })
    stats.push({ label: 'Zasięg', value: `${ranged.value.range.toFixed(1)} m` })
  }
  if (ammoText.value) stats.push({ label: 'Amunicja', value: ammoText.value })
  if (consumable.value) {
    stats.push({
      label: 'Efekt',
      value: `+${consumableRelief.value} ${consumeNeedNoun(consumable.value.need)}`,
    })
  }
  if (freshnessLabel.value) stats.push({ label: 'Świeżość', value: freshnessLabel.value })
  if (sourceSpeciesLabel.value) stats.push({ label: 'Źródło', value: sourceSpeciesLabel.value })
  if (book.value) {
    stats.push({
      label: 'Umiejętność',
      value: `${SKILL_LABEL[book.value.skill]} · ${BOOK_TIER_LABEL[book.value.tier]}`,
    })
    stats.push({ label: 'Wymagane', value: percent(book.value.requiredSkillValue) })
    if (bookSkillValue.value != null) stats.push({ label: 'Twój poziom', value: percent(bookSkillValue.value) })
    stats.push({ label: 'Nauka do', value: percent(book.value.targetSkillValue) })
    if (bookStateLabel.value) stats.push({ label: 'Stan', value: bookStateLabel.value })
  }
  if (isPrimaryMelee.value) stats.push({ label: 'Skrót', value: 'Podstawowa broń biała' })
  if (isPrimaryRanged.value) stats.push({ label: 'Skrót', value: 'Podstawowa broń dystansowa' })
  if (capabilityLabels.value.length > 0) {
    stats.push({ label: 'Zastosowania', value: capabilityLabels.value.join(' · ') })
  }
  if (representativeArmorRow.value?.slotLabel) {
    stats.push({ label: 'Slot', value: representativeArmorRow.value.slotLabel })
  }
  if (representativeArmorRow.value?.qualityLabel && instanceRows.value.length <= 1) {
    stats.push({ label: 'Jakość', value: representativeArmorRow.value.qualityLabel })
  }
  if (armor.value) {
    stats.push({
      label: 'Ochrona',
      value: `${representativeArmorRow.value?.protectionPercent ?? Math.round(armor.value.damageReduction * 100)}%`,
    })
    stats.push({
      label: 'Wysiłek ataku',
      value: representativeArmorRow.value?.staminaPenaltyLabel ?? percentDelta(armor.value.staminaCostMultiplier ?? 1),
    })
    stats.push({
      label: 'Tempo ataku',
      value: representativeArmorRow.value?.recoveryPenaltyLabel ?? percentDelta(armor.value.meleeRecoveryMultiplier ?? 1),
    })
    stats.push({
      label: 'Ruch',
      value: representativeArmorRow.value?.movementPenaltyLabel ?? percentDelta(armor.value.movementSpeedMultiplier ?? 1),
    })
  }
  if (anyArmorEquipped.value) stats.push({ label: 'Stan', value: 'Założona' })

  const firstInstance = group.value?.instances[0]
  const showWeaponMeters = props.selectedItem != null && isWeaponMaintenanceKind(props.selectedItem)
  const showFillOrCondition = !isArmorItem.value && group.value?.meterKind != null && firstInstance != null

  return buildItemDetailPresentation({
    kind: props.selectedItem,
    title: firstUpperCase(displayName.value),
    meta: `${itemCategoryText.value} · ×${itemCount.value}`,
    description: item.value.description ?? `To jest... ${item.value.label}.`,
    lore: null,
    meterKind: showFillOrCondition || showWeaponMeters ? (firstInstance?.meterKind ?? group.value?.meterKind ?? null) : null,
    conditionPercent: showFillOrCondition || showWeaponMeters
      ? (group.value?.uniformConditionPercent ?? firstInstance?.conditionPercent ?? null)
      : null,
    sharpnessPercent: showWeaponMeters ? (firstInstance?.sharpnessPercent ?? null) : null,
    qualityLabel: isArmorItem.value ? (representativeArmorRow.value?.qualityLabel ?? null) : null,
    showArmorWearPlaceholder: isArmorItem.value,
    showDpsPlaceholder: melee.value != null || ranged.value != null,
    showResistPlaceholders: isArmorItem.value,
    stats,
  })
})

useTouchScroll(panel)

function formatWeight(kg: number): string { return `${kg.toFixed(1)} kg` }
function onDrop(kind: ItemKind): void {
  const count = itemCount.value
  if (count <= 1) { ui.inventory.onDrop?.(kind, count); return }
  openQuantityDialog(`Wyrzuć: ${displayName.value}`, count, (amount) => ui.inventory.onDrop?.(kind, amount))
}
function onEquip(kind: ItemKind, instanceId?: string): void { ui.inventory.onEquip?.(kind, instanceId) }
function onUnequip(): void { ui.inventory.onUnequip?.() }
function onEquipArmor(instanceId: string): void { ui.inventory.onEquipArmor?.(instanceId) }
function onUnequipArmor(slot?: EquipmentSlot): void { ui.inventory.onUnequipArmor?.(slot) }
function isInstanceHeld(id: string): boolean {
  return ui.inventory.heldTool === props.selectedItem && ui.inventory.heldInstanceId === id
}
function onConsume(kind: ItemKind): void { ui.inventory.onConsume?.(kind) }
function onThrow(kind: ItemKind): void { ui.inventory.onThrow?.(kind) }
function onRead(kind: ItemKind): void { ui.inventory.onRead?.(kind) }
function percent(value: number): string { return `${Math.round(value * 100)}%` }
function onPlaceTrap(kind: ItemKind): void {
  const trapKind = trapKindForItem(kind)
  if (trapKind) ui.inventory.onPlaceTrap?.(trapKind)
}
function onPlaceContainer(): void { ui.inventory.onPlaceContainer?.() }
function onPlaceTent(): void { ui.inventory.onPlaceTent?.() }

function sellInstance(id: string): void {
  const result = ui.inventory.onSellInstances?.([id]) ?? 'invalid_offer'
  if (result === 'ok') return
  if (result === 'invalid_offer') showToast('Nie masz tego przedmiotu.', 'error')
  else if (result === 'full') showToast('Ekwipunek jest za ciężki.', 'error')
  else if (result === 'not_sold') showToast('Kupiec tego nie kupi.', 'error')
}

function sharpenInstance(id: string): void {
  const result = ui.inventory.onSharpen?.(id) ?? 'invalid'
  if (result === 'ok') return
  if (result === 'no_whetstone') showToast('Brak osełki.', 'error')
  else if (result === 'already_max') showToast('Ostrość jest już maksymalna.', 'error')
  else showToast('Nie można naostrzyć tej broni.', 'error')
}

function setPrimaryMelee(kind: ItemKind, instanceId: string | null = null): void {
  ui.inventory.onSetPrimaryMelee?.(kind, instanceId)
}

function setPrimaryRanged(kind: ItemKind, instanceId: string | null = null): void {
  ui.inventory.onSetPrimaryRanged?.(kind, instanceId)
}

function isInstancePrimaryMelee(id: string): boolean {
  return props.selectedItem != null && isPrimaryMeleeAssignment(props.selectedItem, id, ui.inventory.primaryMelee)
}

function isInstancePrimaryRanged(id: string): boolean {
  return props.selectedItem != null && isPrimaryRangedAssignment(props.selectedItem, id, ui.inventory.primaryRanged)
}
</script>

<template>
  <div
    v-if="ui.inventory.open && item && presentation"
    ref="panel"
    class="max-h-[calc(100dvh-32px)] w-full max-w-2xl overflow-y-auto"
    style="touch-action: pan-y"
  >
    <ItemDetailCard
      solid
      :title="presentation.title"
      :meta="presentation.meta"
      :description="presentation.description"
      :lore="presentation.lore"
      :lore-unavailable="presentation.loreUnavailable"
      :illustration-src="presentation.illustrationSrc"
      :fallback-icon="itemCategoryIcon"
      :stat-rows="presentation.stats"
      @return-to-list="emit('return-to-list')"
    >
      <template #controls>
        <ItemInstanceMeters :meters="presentation.meters" />
      </template>

      <template
        v-if="instanceRows.length > 0"
        #lista
      >
        <div class="mb-2 text-sm font-semibold text-neutral-300">
          Lista
        </div>
        <div class="flex flex-col gap-2">
          <div
            v-for="row in instanceRows"
            :key="row.qualityLabel ? `quality:${row.qualityLabel}` : `${row.conditionPercent}:${row.sharpnessPercent}`"
            class="flex flex-col gap-2 rounded-md border border-neutral-800 bg-neutral-900/40 px-3 py-2 text-sm"
          >
            <div class="flex flex-wrap items-center gap-2 text-neutral-300">
              <span class="font-medium">{{ row.count }}×</span>
              <span
                v-if="row.qualityLabel"
                class="rounded border border-neutral-600 px-1.5 py-0.5 text-xs"
              >{{ row.qualityLabel }}</span>
              <span
                v-else
                class="rounded border border-neutral-600 px-1.5 py-0.5 text-xs"
              >
                {{ ITEM_METER_LABEL[row.meterKind] }} {{ row.conditionPercent }}%
              </span>
              <span
                v-if="row.sharpnessPercent !== null"
                class="rounded border border-neutral-600 px-1.5 py-0.5 text-xs"
              >
                Ostrość {{ row.sharpnessPercent }}%
              </span>
              <span
                v-if="row.effectiveWeightKg != null"
                class="rounded border border-neutral-600 px-1.5 py-0.5 text-xs"
              >
                {{ formatWeight(row.effectiveWeightKg) }}
              </span>
            </div>
            <div
              v-for="(id, index) in row.ids"
              :key="id"
              class="flex flex-wrap items-center justify-between gap-2"
            >
              <div class="flex flex-wrap items-center gap-2">
                <span
                  v-if="row.ids.length > 1"
                  class="text-[11px] text-neutral-500"
                >
                  #{{ index + 1 }}
                </span>
                <span
                  v-if="melee && isWeaponMaintenanceKind(item.kind) && isInstancePrimaryMelee(id)"
                  class="rounded-full bg-primary/30 px-2 py-0.5 text-[11px] font-medium"
                >
                  Podstawowa
                </span>
                <span
                  v-if="ranged && isWeaponMaintenanceKind(item.kind) && isInstancePrimaryRanged(id)"
                  class="rounded-full bg-primary/30 px-2 py-0.5 text-[11px] font-medium"
                >
                  Podstawowa
                </span>
                <span
                  v-if="isArmorItem && isArmorInstanceEquipped(id)"
                  class="rounded-full bg-primary/30 px-2 py-0.5 text-[11px] font-medium"
                >
                  Założona
                </span>
              </div>
              <div class="flex flex-wrap items-center gap-2">
                <ItemsScreenItemButton
                  v-if="isToolKind(item.kind) && !isInstanceHeld(id)"
                  class="min-h-0 py-1"
                  label="Weź"
                  @click="onEquip(item.kind, id)"
                />
                <ItemsScreenItemButton
                  v-if="isArmorItem && !isArmorInstanceEquipped(id)"
                  class="min-h-0 py-1"
                  label="Załóż"
                  @click="onEquipArmor(id)"
                />
                <ItemsScreenItemButton
                  v-if="isArmorItem && isArmorInstanceEquipped(id)"
                  class="min-h-0 py-1"
                  label="Zdejmij"
                  @click="onUnequipArmor(armor?.slot)"
                />
                <ItemsScreenItemButton
                  v-if="isToolKind(item.kind) && isInstanceHeld(id)"
                  class="min-h-0 py-1"
                  label="Odłóż"
                  @click="onUnequip"
                />
                <ItemsScreenItemButton
                  v-if="melee && isWeaponMaintenanceKind(item.kind) && !isInstancePrimaryMelee(id)"
                  class="min-h-0 py-1"
                  label="Ustaw podstawową"
                  @click="setPrimaryMelee(item.kind, id)"
                />
                <ItemsScreenItemButton
                  v-if="ranged && isWeaponMaintenanceKind(item.kind) && !isInstancePrimaryRanged(id)"
                  class="min-h-0 py-1"
                  label="Ustaw podstawową"
                  @click="setPrimaryRanged(item.kind, id)"
                />
                <template v-if="row.sharpnessPercent !== null && row.sharpnessPercent < 100">
                  <ItemsScreenItemButton
                    class="min-h-0 py-1"
                    :label="`Naostrz (${whetstoneCount})`"
                    :disabled="whetstoneCount === 0"
                    @click="whetstoneCount > 0 && sharpenInstance(id)"
                  />
                  <span
                    v-if="whetstoneCount === 0"
                    class="text-[11px] text-neutral-400"
                  >Brak osełki</span>
                </template>
                <ItemsScreenItemButton
                  v-if="merchantOpen"
                  class="min-h-0 py-1"
                  :label="`Sprzedaj (${row.sellPrice})`"
                  @click="sellInstance(id)"
                />
              </div>
            </div>
          </div>
        </div>
      </template>

      <template #actions>
        <div class="grid w-full grid-cols-1 gap-2 md:grid-cols-2">
          <template v-if="consumeUse">
            <ItemsScreenItemButton
              :label="consumeUse.label"
              :disabled="!consumeUse.enabled"
              @click="consumeUse.enabled && onConsume(item.kind)"
            />
            <span
              v-if="consumeUse.reasonLabel"
              class="self-center text-[11px] text-neutral-400"
            >{{ consumeUse.reasonLabel }}</span>
          </template>
          <ItemsScreenItemButton
            v-if="isThrowableKind(item.kind)"
            label="Rzuć"
            @click="onThrow(item.kind)"
          />
          <template v-if="readUse">
            <ItemsScreenItemButton
              :label="readUse.label"
              :disabled="!readUse.enabled"
              @click="readUse.enabled && onRead(item.kind)"
            />
            <span
              v-if="readUse.reasonLabel"
              class="self-center text-[11px] text-neutral-400"
            >{{ readUse.reasonLabel }}</span>
          </template>
          <ItemsScreenItemButton
            v-if="treasureMap"
            label="Odczytaj"
            @click="onRead(item.kind)"
          />
          <ItemsScreenItemButton
            v-if="trapKindForItem(item.kind)"
            label="Zastaw"
            @click="onPlaceTrap(item.kind)"
          />
          <ItemsScreenItemButton
            v-if="item.kind === 'chest'"
            label="Postaw"
            @click="onPlaceContainer"
          />
          <ItemsScreenItemButton
            v-if="item.kind === 'tent'"
            label="Rozstaw"
            @click="onPlaceTent"
          />
          <ItemsScreenItemButton
            v-if="showSetPrimaryMelee"
            label="Ustaw jako podstawową broń białą"
            @click="setPrimaryMelee(item.kind)"
          />
          <ItemsScreenItemButton
            v-if="showSetPrimaryRanged"
            label="Ustaw jako podstawową broń dystansową"
            @click="setPrimaryRanged(item.kind)"
          />
          <ItemsScreenItemButton
            v-if="isToolKind(item.kind) && !isWeaponMaintenanceKind(item.kind) && ui.inventory.heldTool !== item.kind"
            label="Weź"
            @click="onEquip(item.kind)"
          />
          <ItemsScreenItemButton
            v-if="!isWeaponMaintenanceKind(item.kind) && ui.inventory.heldTool === item.kind"
            label="Odłóż"
            @click="onUnequip"
          />
          <ItemsScreenItemButton
            label="Wyrzuć"
            destructive
            @click="onDrop(item.kind)"
          />
        </div>
      </template>
    </ItemDetailCard>
  </div>
</template>
