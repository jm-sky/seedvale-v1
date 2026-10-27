<script setup lang="ts">
import { Apple, BookOpen, Package, ScrollText, Shield, Sword, Wheat } from 'lucide-vue-next'
import { type Component, computed } from 'vue'
import ItemsScreenItemButton from '@/components/ItemsScreenItemButton.vue'
import { useItemCategoryLabels } from '@/composables/useItemCategoryLabels'
import { firstUpperCase } from '@/lib/firstUpperCase'
import type { EquipmentSlot } from '../../../items/equipment'
import type { InventoryGroupView, InventoryInstanceRow } from '../../../items/inventoryView'
import type { PrimaryWeaponChoice } from '../../../items/primaryWeapons'
import type { InventorySelection } from './inventoryPresentation'
import { FOOD_SOURCE_SPECIES_LABEL, foodHungerRelief, FRESHNESS_STAGE_LABEL } from '../../../items/foodFreshness'
import { isToolKind } from '../../../items/HeldTool'
import { type BookTier, CAPABILITY_LABEL, consumeNeedNoun, isMeleeToolKind, isRangedTool, isThrowableKind, ITEM_CATALOG } from '../../../items/itemCatalog'
import { itemDisplayName } from '../../../items/itemDisplay'
import { isArmorKind, isInstanceBackedKind, isWeaponMaintenanceKind } from '../../../items/itemInstances'
import { ITEM_DEFS, type ItemCategory, primaryItemCategory } from '../../../items/items'
import { resolveReadBookUseView } from '../../../items/itemUseView'
import { isPrimaryMeleeAssignment, isPrimaryRangedAssignment } from '../../../items/primaryWeapons'
import { tradeValue } from '../../../items/tradeCatalog'
import { SKILL_LABEL } from '../../../player/PlayerSkills'
import { trapKindForItem } from '../../../world/animalTraps'
import {
  buildItemDetailPresentation,
  type DetailStatRow,
} from './buildItemDetailPresentation'
import ItemDetailCard from './ItemDetailCard.vue'
import ItemInstanceMeters from './ItemInstanceMeters.vue'

const BOOK_TIER_LABEL: Record<BookTier, string> = {
  basic: 'podstawowy',
  intermediate: 'średniozaawansowany',
  advanced: 'zaawansowany',
}

const LIQUID_LABEL: Record<string, string> = {
  water: 'woda',
  milk: 'mleko',
}

const props = withDefaults(defineProps<{
  selection: Exclude<InventorySelection, null>
  group: InventoryGroupView
  /** Exact selected instance row when selection.type === 'instance'. */
  instance: InventoryInstanceRow | null
  heldTool: string | null
  heldInstanceId: string | null
  primaryMelee: PrimaryWeaponChoice | null
  primaryRanged: PrimaryWeaponChoice | null
  equippedSlots: Partial<Record<EquipmentSlot, string>>
  counts: Partial<Record<string, number>>
  whetstoneCount: number
  merchantOpen: boolean
  bookSkillValue: number | null
  showReturn?: boolean
  headingId?: string
  solid?: boolean
}>(), {
  showReturn: true,
  solid: true,
  headingId: undefined,
})

const emit = defineEmits<{
  'return-to-list': []
  drop: [kind: string, amount: number]
  'request-drop-quantity': [kind: string, max: number, label: string]
  equip: [kind: string, instanceId?: string]
  unequip: []
  'equip-armor': [instanceId: string]
  'unequip-armor': [slot: EquipmentSlot]
  consume: [kind: string]
  throw: [kind: string]
  read: [kind: string]
  'place-trap': [kind: string]
  'place-container': []
  'place-tent': []
  sharpen: [instanceId: string]
  sell: [instanceId: string]
  'set-primary-melee': [kind: string, instanceId: string | null]
  'set-primary-ranged': [kind: string, instanceId: string | null]
}>()

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

const kind = computed(() => props.selection.kind)
const item = computed(() => ITEM_DEFS[kind.value])
const displayName = computed(() => itemDisplayName(kind.value))
const catalogEntry = computed(() => ITEM_CATALOG[kind.value])
const isInstanceSelection = computed(() => props.selection.type === 'instance')
const liveKindCount = computed(() => props.group.count)
const melee = computed(() => catalogEntry.value?.melee ?? null)
const ranged = computed(() => catalogEntry.value?.ranged ?? null)
const armor = computed(() => catalogEntry.value?.armor ?? null)
const isArmorItem = computed(() => isArmorKind(kind.value))
const consumable = computed(() => catalogEntry.value?.consumable ?? null)
const consumeUse = computed(() => props.group.consumeUse ?? null)
const book = computed(() => catalogEntry.value?.book ?? null)
const treasureMap = computed(() => catalogEntry.value?.treasureMap ?? null)
const readUse = computed(() => {
  const b = book.value
  const value = props.bookSkillValue
  return b && value != null ? resolveReadBookUseView(b, value) : null
})

const equippedInstanceId = computed(() => {
  if (!props.instance) return null
  for (const [slot, id] of Object.entries(props.equippedSlots)) {
    if (id === props.instance.id) return { slot: slot as EquipmentSlot, id }
  }
  return null
})

const isHeldSelected = computed(() => {
  if (isInstanceSelection.value && props.instance) {
    return props.heldTool === kind.value && props.heldInstanceId === props.instance.id
  }
  return props.heldTool === kind.value && (props.heldInstanceId == null || !isInstanceBackedKind(kind.value))
})

const isPrimaryMeleeSelected = computed(() => {
  if (isInstanceSelection.value && props.instance) {
    return isPrimaryMeleeAssignment(kind.value, props.instance.id, props.primaryMelee)
  }
  return props.primaryMelee?.kind === kind.value && props.primaryMelee.instanceId == null
})

const isPrimaryRangedSelected = computed(() => {
  if (isInstanceSelection.value && props.instance) {
    return isPrimaryRangedAssignment(kind.value, props.instance.id, props.primaryRanged)
  }
  return props.primaryRanged?.kind === kind.value && props.primaryRanged.instanceId == null
})

const itemCategoryText = computed(() => item.value.categories.map((cat) => categoryLabel[cat]).join(' · '))
const itemCategoryIcon = computed(() => CATEGORY_ICON[primaryItemCategory(item.value)])
const capabilityLabels = computed(() => (catalogEntry.value?.capabilities ?? []).map((cap) => CAPABILITY_LABEL[cap]))

const consumableRelief = computed(() => {
  if (!consumable.value) return 0
  return foodHungerRelief(kind.value, props.group.sourceSpecies)
})
const freshnessLabel = computed(() => {
  const stage = props.group.freshnessStage
  return stage ? FRESHNESS_STAGE_LABEL[stage] : null
})
const sourceSpeciesLabel = computed(() => {
  const species = props.group.sourceSpecies
  return species ? FOOD_SOURCE_SPECIES_LABEL[species] : null
})

const meleeSpeed = computed(() => {
  const m = melee.value
  if (!m) return null
  const cycle = m.windUp + m.hitWindow + m.recovery
  if (cycle < 0.35) return 'szybki'
  if (cycle < 0.55) return 'średni'
  return 'wolny'
})

const ammoText = computed(() => {
  const r = ranged.value
  if (!r) return null
  return r.ammoKinds
    .map((ammoKind) => `${ITEM_DEFS[ammoKind].label}: ${props.counts[ammoKind] ?? 0}`)
    .join(' · ')
})

function formatWeight(kg: number): string {
  return `${kg.toFixed(1)} kg`
}

function percent(value: number): string {
  return `${Math.round(value * 100)}%`
}

const unitWeight = computed(() => {
  if (props.instance?.effectiveWeightKg != null) return props.instance.effectiveWeightKg
  return item.value.weight
})

const presentation = computed(() => {
  const stats: DetailStatRow[] = []
  stats.push({ label: 'Kategoria', value: itemCategoryText.value })
  if (isInstanceSelection.value) {
    stats.push({ label: 'Ilość tego rodzaju', value: `×${liveKindCount.value}` })
    stats.push({ label: 'Waga sztuki', value: formatWeight(unitWeight.value) })
  } else {
    stats.push({ label: 'Ilość', value: `×${liveKindCount.value}` })
    stats.push({ label: 'Waga jednostki', value: formatWeight(item.value.weight) })
    stats.push({ label: 'Waga grupy', value: formatWeight(item.value.weight * liveKindCount.value) })
  }
  stats.push({ label: 'Wartość referencyjna', value: `${tradeValue(kind.value)} monet` })
  if (props.instance?.sellPrice != null && props.merchantOpen) {
    stats.push({ label: 'Cena sprzedaży', value: `${props.instance.sellPrice} monet` })
  }
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
      label: 'Efekt (następna porcja)',
      value: `+${consumableRelief.value} ${consumeNeedNoun(consumable.value.need)}`,
    })
  }
  if (freshnessLabel.value) stats.push({ label: 'Świeżość (następna porcja)', value: freshnessLabel.value })
  if (sourceSpeciesLabel.value) stats.push({ label: 'Źródło (następna porcja)', value: sourceSpeciesLabel.value })
  if (props.instance?.liquid !== undefined) {
    const liquid = props.instance.liquid
    stats.push({
      label: 'Zawartość',
      value: liquid == null
        ? 'pusty'
        : `${LIQUID_LABEL[liquid] ?? liquid} · ${props.instance.amountLitres?.toFixed(1) ?? 0} / ${props.instance.capacityLitres?.toFixed(1) ?? 0} l`,
    })
  }
  if (book.value) {
    stats.push({
      label: 'Umiejętność',
      value: `${SKILL_LABEL[book.value.skill]} · ${BOOK_TIER_LABEL[book.value.tier]}`,
    })
    stats.push({ label: 'Wymagane', value: percent(book.value.requiredSkillValue) })
    if (props.bookSkillValue != null) stats.push({ label: 'Twój poziom', value: percent(props.bookSkillValue) })
    stats.push({ label: 'Nauka do', value: percent(book.value.targetSkillValue) })
    if (readUse.value) stats.push({ label: 'Stan', value: readUse.value.reasonLabel || 'Możesz się nauczyć' })
  }
  if (isPrimaryMeleeSelected.value) stats.push({ label: 'Skrót', value: 'Podstawowa broń biała' })
  if (isPrimaryRangedSelected.value) stats.push({ label: 'Skrót', value: 'Podstawowa broń dystansowa' })
  if (isHeldSelected.value) stats.push({ label: 'Trzymane', value: 'W ręce' })
  if (capabilityLabels.value.length > 0) {
    stats.push({ label: 'Zastosowania', value: capabilityLabels.value.join(' · ') })
  }
  if (props.instance?.slotLabel) stats.push({ label: 'Slot', value: props.instance.slotLabel })
  if (props.instance?.qualityLabel) stats.push({ label: 'Jakość', value: props.instance.qualityLabel })
  if (isArmorItem.value && armor.value) {
    stats.push({
      label: 'Ochrona',
      value: `${props.instance?.protectionPercent ?? Math.round(armor.value.damageReduction * 100)}%`,
    })
    stats.push({
      label: 'Wysiłek ataku',
      value: props.instance?.staminaPenaltyLabel ?? '±0%',
    })
    stats.push({
      label: 'Tempo ataku',
      value: props.instance?.recoveryPenaltyLabel ?? '±0%',
    })
    stats.push({
      label: 'Ruch',
      value: props.instance?.movementPenaltyLabel ?? '±0%',
    })
  }
  if (equippedInstanceId.value) stats.push({ label: 'Stan', value: 'Założona' })
  if (isInstanceSelection.value && props.instance) {
    stats.push({ label: 'Identyfikator', value: props.instance.id.slice(-8) })
  }

  const showWeaponMeters = isWeaponMaintenanceKind(kind.value) && props.instance != null
  const showFillOrCondition = !isArmorItem.value
    && props.instance != null
    && props.instance.meterKind != null
    && !(props.instance.meterKind === 'condition' && props.instance.sharpnessPercent == null && props.instance.conditionPercent === 100 && !trapKindForItem(kind.value) && kind.value !== 'tent')

  return buildItemDetailPresentation({
    kind: kind.value,
    title: firstUpperCase(displayName.value),
    meta: isInstanceSelection.value
      ? `${itemCategoryText.value} · sztuka`
      : `${itemCategoryText.value} · ×${liveKindCount.value}`,
    description: item.value.description ?? `To jest... ${item.value.label}.`,
    lore: null,
    meterKind: showFillOrCondition || showWeaponMeters ? props.instance?.meterKind ?? null : null,
    conditionPercent: showFillOrCondition || showWeaponMeters ? props.instance?.conditionPercent ?? null : null,
    sharpnessPercent: showWeaponMeters ? props.instance?.sharpnessPercent ?? null : null,
    qualityLabel: isArmorItem.value ? (props.instance?.qualityLabel ?? null) : null,
    showArmorWearPlaceholder: isArmorItem.value,
    showDpsPlaceholder: melee.value != null || ranged.value != null,
    showResistPlaceholders: isArmorItem.value,
    stats,
  })
})

const trapKind = computed(() => trapKindForItem(kind.value))

function onDropKind(): void {
  const count = liveKindCount.value
  if (count <= 0) return
  const label = isInstanceSelection.value
    ? `Wyrzuć z rodzaju: ${displayName.value}`
    : `Wyrzuć: ${displayName.value}`
  if (count <= 1) {
    emit('drop', kind.value, count)
    return
  }
  emit('request-drop-quantity', kind.value, count, label)
}

function onUnequipHeldGuarded(): void {
  if (!isHeldSelected.value) return
  emit('unequip')
}

function onUnequipArmorGuarded(): void {
  const eq = equippedInstanceId.value
  if (!eq) return
  emit('unequip-armor', eq.slot)
}
</script>

<template>
  <ItemDetailCard
    v-if="presentation"
    :solid="solid"
    :show-return="showReturn"
    :heading-id="headingId"
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

    <template #actions>
      <div class="grid w-full grid-cols-1 gap-2 md:grid-cols-2">
        <!-- Exact instance actions -->
        <template v-if="isInstanceSelection && instance">
          <ItemsScreenItemButton
            v-if="isToolKind(kind) && !isHeldSelected"
            class="min-h-11 sm:min-h-0"
            label="Weź"
            @click="emit('equip', kind, instance.id)"
          />
          <ItemsScreenItemButton
            v-if="isToolKind(kind) && isHeldSelected"
            class="min-h-11 sm:min-h-0"
            label="Odłóż"
            @click="onUnequipHeldGuarded"
          />
          <ItemsScreenItemButton
            v-if="isArmorItem && !equippedInstanceId"
            class="min-h-11 sm:min-h-0"
            label="Załóż"
            @click="emit('equip-armor', instance.id)"
          />
          <ItemsScreenItemButton
            v-if="isArmorItem && equippedInstanceId"
            class="min-h-11 sm:min-h-0"
            label="Zdejmij"
            @click="onUnequipArmorGuarded"
          />
          <ItemsScreenItemButton
            v-if="isMeleeToolKind(kind) && !isPrimaryMeleeSelected"
            class="min-h-11 sm:min-h-0"
            label="Ustaw podstawową wręcz"
            @click="emit('set-primary-melee', kind, isInstanceBackedKind(kind) ? instance.id : null)"
          />
          <ItemsScreenItemButton
            v-if="isRangedTool(kind) && !isPrimaryRangedSelected"
            class="min-h-11 sm:min-h-0"
            label="Ustaw podstawową dystansową"
            @click="emit('set-primary-ranged', kind, isInstanceBackedKind(kind) ? instance.id : null)"
          />
          <template v-if="instance.sharpnessPercent !== null && instance.sharpnessPercent < 100">
            <ItemsScreenItemButton
              class="min-h-11 sm:min-h-0"
              :label="`Naostrz (${whetstoneCount})`"
              :disabled="whetstoneCount === 0"
              @click="whetstoneCount > 0 && emit('sharpen', instance.id)"
            />
            <span
              v-if="whetstoneCount === 0"
              class="self-center text-[11px] text-neutral-400"
            >Brak osełki</span>
          </template>
          <ItemsScreenItemButton
            v-if="merchantOpen"
            class="min-h-11 sm:min-h-0"
            :label="`Sprzedaj (${instance.sellPrice})`"
            @click="emit('sell', instance.id)"
          />
        </template>

        <!-- Group / count-kind actions (also for non-instance selection) -->
        <template v-if="!isInstanceSelection">
          <template v-if="consumeUse">
            <ItemsScreenItemButton
              class="min-h-11 sm:min-h-0"
              :label="consumeUse.label"
              :disabled="!consumeUse.enabled"
              @click="consumeUse.enabled && emit('consume', kind)"
            />
            <span
              v-if="consumeUse.reasonLabel"
              class="self-center text-[11px] text-neutral-400"
            >{{ consumeUse.reasonLabel }}</span>
          </template>
          <ItemsScreenItemButton
            v-if="isThrowableKind(kind)"
            class="min-h-11 sm:min-h-0"
            label="Rzuć"
            @click="emit('throw', kind)"
          />
          <template v-if="readUse">
            <ItemsScreenItemButton
              class="min-h-11 sm:min-h-0"
              :label="readUse.label"
              :disabled="!readUse.enabled"
              @click="readUse.enabled && emit('read', kind)"
            />
            <span
              v-if="readUse.reasonLabel"
              class="self-center text-[11px] text-neutral-400"
            >{{ readUse.reasonLabel }}</span>
          </template>
          <ItemsScreenItemButton
            v-if="treasureMap"
            class="min-h-11 sm:min-h-0"
            label="Odczytaj"
            @click="emit('read', kind)"
          />
          <ItemsScreenItemButton
            v-if="trapKind"
            class="min-h-11 sm:min-h-0"
            label="Zastaw"
            @click="emit('place-trap', kind)"
          />
          <ItemsScreenItemButton
            v-if="kind === 'chest'"
            class="min-h-11 sm:min-h-0"
            label="Postaw"
            @click="emit('place-container')"
          />
          <ItemsScreenItemButton
            v-if="kind === 'tent'"
            class="min-h-11 sm:min-h-0"
            label="Rozstaw"
            @click="emit('place-tent')"
          />
          <ItemsScreenItemButton
            v-if="isMeleeToolKind(kind) && !isWeaponMaintenanceKind(kind) && !isPrimaryMeleeSelected"
            class="min-h-11 sm:min-h-0"
            label="Ustaw jako podstawową broń białą"
            @click="emit('set-primary-melee', kind, null)"
          />
          <ItemsScreenItemButton
            v-if="isRangedTool(kind) && !isInstanceBackedKind(kind) && !isPrimaryRangedSelected"
            class="min-h-11 sm:min-h-0"
            label="Ustaw jako podstawową broń dystansową"
            @click="emit('set-primary-ranged', kind, null)"
          />
          <ItemsScreenItemButton
            v-if="isToolKind(kind) && !isInstanceBackedKind(kind) && !isHeldSelected"
            class="min-h-11 sm:min-h-0"
            label="Weź"
            @click="emit('equip', kind)"
          />
          <ItemsScreenItemButton
            v-if="isToolKind(kind) && !isInstanceBackedKind(kind) && isHeldSelected"
            class="min-h-11 sm:min-h-0"
            label="Odłóż"
            @click="onUnequipHeldGuarded"
          />
          <ItemsScreenItemButton
            class="min-h-11 sm:min-h-0"
            label="Wyrzuć"
            destructive
            @click="onDropKind"
          />
        </template>
      </div>

      <!-- Group-scoped section inside instance details -->
      <div
        v-if="isInstanceSelection"
        class="mt-4 w-full border-t border-neutral-800 pt-3"
      >
        <h3 class="mb-2 text-sm font-semibold text-neutral-300">
          Działania na rodzaju: {{ displayName }} · ×{{ liveKindCount }}
        </h3>
        <div class="grid grid-cols-1 gap-2 md:grid-cols-2">
          <template v-if="consumeUse">
            <ItemsScreenItemButton
              class="min-h-11 sm:min-h-0"
              :label="instance?.capacityLitres != null ? `Wypij z rodzaju: ${consumeUse.label}` : `${consumeUse.label} (rodzaj)`"
              :disabled="!consumeUse.enabled"
              @click="consumeUse.enabled && emit('consume', kind)"
            />
            <span class="self-center text-[11px] text-neutral-400">
              {{
                consumeUse.reasonLabel
                  || (instance?.capacityLitres != null
                    ? 'Gra wybierze pierwszy pojemnik tego rodzaju, z którego można wypić.'
                    : 'Działanie dotyczy rodzaju, nie zaznaczonej sztuki.')
              }}
            </span>
          </template>
          <ItemsScreenItemButton
            v-if="isThrowableKind(kind)"
            class="min-h-11 sm:min-h-0"
            label="Rzuć (rodzaj)"
            @click="emit('throw', kind)"
          />
          <template v-if="readUse">
            <ItemsScreenItemButton
              class="min-h-11 sm:min-h-0"
              :label="readUse.label"
              :disabled="!readUse.enabled"
              @click="readUse.enabled && emit('read', kind)"
            />
            <span
              v-if="readUse.reasonLabel"
              class="self-center text-[11px] text-neutral-400"
            >{{ readUse.reasonLabel }}</span>
          </template>
          <ItemsScreenItemButton
            v-if="treasureMap"
            class="min-h-11 sm:min-h-0"
            label="Odczytaj"
            @click="emit('read', kind)"
          />
          <template v-if="trapKind">
            <ItemsScreenItemButton
              class="min-h-11 sm:min-h-0"
              :label="`Zastaw z rodzaju: ${displayName}`"
              @click="emit('place-trap', kind)"
            />
            <span class="self-center text-[11px] text-neutral-400">
              Gra wybierze najmniej sprawną działającą pułapkę tego rodzaju.
            </span>
          </template>
          <template v-if="kind === 'tent'">
            <ItemsScreenItemButton
              class="min-h-11 sm:min-h-0"
              label="Rozstaw z rodzaju: namiot"
              @click="emit('place-tent')"
            />
            <span class="self-center text-[11px] text-neutral-400">
              Gra wybierze namiot o najniższym stanie.
            </span>
          </template>
          <ItemsScreenItemButton
            class="min-h-11 sm:min-h-0"
            label="Wyrzuć z rodzaju…"
            destructive
            @click="onDropKind"
          />
          <p class="md:col-span-2 text-[11px] text-neutral-400">
            To działanie nie wskazuje zaznaczonej sztuki. Gra wyrzuci pierwsze sztuki tego rodzaju według kolejności ekwipunku.
          </p>
        </div>
      </div>
    </template>
  </ItemDetailCard>
</template>
