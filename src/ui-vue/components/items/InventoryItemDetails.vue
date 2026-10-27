<script setup lang="ts">
import { computed } from 'vue'
import ItemsScreenItemButton from '@/components/ItemsScreenItemButton.vue'
import { useItemCategoryLabels } from '@/composables/useItemCategoryLabels'
import { firstUpperCase } from '@/lib/firstUpperCase'
import type { EquipmentSlot } from '../../../items/equipment'
import type { InventoryGroupView, InventoryInstanceRow } from '../../../items/inventoryView'
import type { PrimaryWeaponChoice } from '../../../items/primaryWeapons'
import type { InventorySelection } from './inventoryPresentation'
import { isToolKind } from '../../../items/HeldTool'
import { isMeleeToolKind, isRangedTool, isThrowableKind, ITEM_CATALOG } from '../../../items/itemCatalog'
import { itemDisplayName } from '../../../items/itemDisplay'
import { isArmorKind, isInstanceBackedKind, isWeaponMaintenanceKind } from '../../../items/itemInstances'
import { ITEM_DEFS, primaryItemCategory } from '../../../items/items'
import { resolveReadBookUseView } from '../../../items/itemUseView'
import { isPrimaryMeleeAssignment, isPrimaryRangedAssignment } from '../../../items/primaryWeapons'
import { tradeValue } from '../../../items/tradeCatalog'
import { trapKindForItem } from '../../../world/animalTraps'
import { buildInventoryDetailStatRows } from './buildInventoryDetailStatRows'
import { buildItemDetailPresentation } from './buildItemDetailPresentation'
import ItemDetailCard from './ItemDetailCard.vue'
import ItemInstanceMeters from './ItemInstanceMeters.vue'

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

const kind = computed(() => props.selection.kind)
const item = computed(() => ITEM_DEFS[kind.value])
const displayName = computed(() => itemDisplayName(kind.value))
const catalogEntry = computed(() => ITEM_CATALOG[kind.value])
const isInstanceSelection = computed(() => props.selection.type === 'instance')
const liveKindCount = computed(() => props.group.count)
const melee = computed(() => catalogEntry.value?.melee ?? null)
const ranged = computed(() => catalogEntry.value?.ranged ?? null)
const isArmorItem = computed(() => isArmorKind(kind.value))
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
const itemPrimaryCategory = computed(() => primaryItemCategory(item.value))

const unitWeight = computed(() => {
  if (props.instance?.effectiveWeightKg != null) return props.instance.effectiveWeightKg
  return item.value.weight
})

const presentation = computed(() => {
  const unitValue = tradeValue(kind.value)
  const stats = buildInventoryDetailStatRows({
    kind: kind.value,
    selectionType: isInstanceSelection.value ? 'instance' : 'group',
    liveKindCount: liveKindCount.value,
    unitWeightKg: unitWeight.value,
    catalog: catalogEntry.value,
    group: props.group,
    instance: props.instance,
    counts: props.counts,
    bookSkillValue: props.bookSkillValue,
    merchantOpen: props.merchantOpen,
    isArmor: isArmorItem.value,
  })

  const showWeaponMeters = isWeaponMaintenanceKind(kind.value) && props.instance != null
  // Generic identity / ranged rows carry a display-only 100% condition — never treat as wear.
  const isDisplayOnlyFullCondition = props.instance != null
    && props.instance.meterKind === 'condition'
    && props.instance.sharpnessPercent == null
    && props.instance.conditionPercent === 100
    && !trapKindForItem(kind.value)
    && kind.value !== 'tent'
  const showFillOrCondition = !isArmorItem.value
    && props.instance != null
    && props.instance.meterKind != null
    && !isDisplayOnlyFullCondition

  // V3 Worth: instance = unit reference; group = unit × live count.
  const worthCoins = isInstanceSelection.value
    ? unitValue
    : unitValue * liveKindCount.value

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
    quality: isArmorItem.value ? (props.instance?.quality ?? null) : null,
    worthCoins,
    stackCount: !isInstanceSelection.value && liveKindCount.value > 1 ? liveKindCount.value : null,
    showArmorWearPlaceholder: isArmorItem.value,
    showConditionUnavailablePlaceholder: isDisplayOnlyFullCondition && !isArmorItem.value,
    showDpsPlaceholder: melee.value != null || ranged.value != null,
    showResistPlaceholders: isArmorItem.value,
    stats,
  })
})

const trapKind = computed(() => trapKindForItem(kind.value))

/** Kind-scoped chips (drink/place/throw/read) — not for plain weapon/tool/armor instance rows. */
const hasKindScopedGameplayActions = computed(() => (
  consumeUse.value != null
  || isThrowableKind(kind.value)
  || readUse.value != null
  || treasureMap.value != null
  || trapKind.value != null
  || kind.value === 'tent'
))

const showInstanceKindScopedSection = computed(() => (
  isInstanceSelection.value && hasKindScopedGameplayActions.value
))

function onDropKind(): void {
  const count = liveKindCount.value
  if (count <= 0) return
  const label = showInstanceKindScopedSection.value
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
    :illustration-src="presentation.illustrationSrc"
    :kind="kind"
    :category="itemPrimaryCategory"
    :stat-rows="presentation.stats"
    @return-to-list="emit('return-to-list')"
  >
    <template #controls>
      <ItemInstanceMeters
        :meters="presentation.meters"
        :quality="presentation.quality"
        :quality-label="presentation.qualityLabel"
        :worth-coins="presentation.worthCoins"
        :stack-count="presentation.stackCount"
      />
    </template>

    <template #actions>
      <!-- Exact instance actions — compact V3 footer chips -->
      <template v-if="isInstanceSelection && instance">
        <ItemsScreenItemButton
          v-if="isToolKind(kind) && !isHeldSelected"
          label="Weź"
          selected
          @click="emit('equip', kind, instance.id)"
        />
        <ItemsScreenItemButton
          v-if="isToolKind(kind) && isHeldSelected"
          label="Odłóż"
          @click="onUnequipHeldGuarded"
        />
        <ItemsScreenItemButton
          v-if="isArmorItem && !equippedInstanceId"
          label="Załóż"
          selected
          @click="emit('equip-armor', instance.id)"
        />
        <ItemsScreenItemButton
          v-if="isArmorItem && equippedInstanceId"
          label="Zdejmij"
          @click="onUnequipArmorGuarded"
        />
        <ItemsScreenItemButton
          v-if="isMeleeToolKind(kind) && !isPrimaryMeleeSelected"
          label="Podst. wręcz"
          @click="emit('set-primary-melee', kind, isInstanceBackedKind(kind) ? instance.id : null)"
        />
        <ItemsScreenItemButton
          v-if="isRangedTool(kind) && !isPrimaryRangedSelected"
          label="Podst. dystans"
          @click="emit('set-primary-ranged', kind, isInstanceBackedKind(kind) ? instance.id : null)"
        />
        <ItemsScreenItemButton
          v-if="instance.sharpnessPercent !== null && instance.sharpnessPercent < 100"
          :label="`Naostrz (${whetstoneCount})`"
          :disabled="whetstoneCount === 0"
          :title="whetstoneCount === 0 ? 'Brak osełki' : undefined"
          @click="whetstoneCount > 0 && emit('sharpen', instance.id)"
        />
        <ItemsScreenItemButton
          v-if="merchantOpen"
          :label="`Sprzedaj (${instance.sellPrice})`"
          @click="emit('sell', instance.id)"
        />
        <!-- Weapons/tools/armor: plain drop (no „rodzaj” chrome — rows are already instances). -->
        <ItemsScreenItemButton
          v-if="!showInstanceKindScopedSection"
          label="Wyrzuć"
          destructive
          @click="onDropKind"
        />
      </template>

      <!-- Group / count-kind actions -->
      <template v-if="!isInstanceSelection">
        <ItemsScreenItemButton
          v-if="consumeUse"
          :label="consumeUse.label"
          :disabled="!consumeUse.enabled"
          :title="consumeUse.reasonLabel ?? undefined"
          selected
          @click="consumeUse.enabled && emit('consume', kind)"
        />
        <ItemsScreenItemButton
          v-if="isThrowableKind(kind)"
          label="Rzuć"
          @click="emit('throw', kind)"
        />
        <ItemsScreenItemButton
          v-if="readUse"
          :label="readUse.label"
          :disabled="!readUse.enabled"
          :title="readUse.reasonLabel ?? undefined"
          @click="readUse.enabled && emit('read', kind)"
        />
        <ItemsScreenItemButton
          v-if="treasureMap"
          label="Odczytaj"
          @click="emit('read', kind)"
        />
        <ItemsScreenItemButton
          v-if="trapKind"
          label="Zastaw"
          @click="emit('place-trap', kind)"
        />
        <ItemsScreenItemButton
          v-if="kind === 'chest'"
          label="Postaw"
          @click="emit('place-container')"
        />
        <ItemsScreenItemButton
          v-if="kind === 'tent'"
          label="Rozstaw"
          @click="emit('place-tent')"
        />
        <ItemsScreenItemButton
          v-if="isMeleeToolKind(kind) && !isWeaponMaintenanceKind(kind) && !isPrimaryMeleeSelected"
          label="Podst. wręcz"
          @click="emit('set-primary-melee', kind, null)"
        />
        <ItemsScreenItemButton
          v-if="isRangedTool(kind) && !isInstanceBackedKind(kind) && !isPrimaryRangedSelected"
          label="Podst. dystans"
          @click="emit('set-primary-ranged', kind, null)"
        />
        <ItemsScreenItemButton
          v-if="isToolKind(kind) && !isInstanceBackedKind(kind) && !isHeldSelected"
          label="Weź"
          selected
          @click="emit('equip', kind)"
        />
        <ItemsScreenItemButton
          v-if="isToolKind(kind) && !isInstanceBackedKind(kind) && isHeldSelected"
          label="Odłóż"
          @click="onUnequipHeldGuarded"
        />
        <ItemsScreenItemButton
          label="Wyrzuć"
          destructive
          @click="onDropKind"
        />
      </template>

      <!-- Kind-scoped chips only when drink/place/throw/read apply (not bare weapon/tool/armor). -->
      <template v-if="showInstanceKindScopedSection">
        <div class="basis-full text-left text-[11px] leading-snug text-neutral-500">
          Działania na rodzaju: {{ displayName }} · ×{{ liveKindCount }}.
          To działanie nie wskazuje zaznaczonej sztuki. Gra wyrzuci pierwsze sztuki tego rodzaju według kolejności ekwipunku.
        </div>
        <ItemsScreenItemButton
          v-if="consumeUse"
          :label="instance?.capacityLitres != null ? `Wypij (rodzaj)` : `${consumeUse.label} (rodzaj)`"
          :disabled="!consumeUse.enabled"
          :title="consumeUse.reasonLabel
            || (instance?.capacityLitres != null
              ? 'Gra wybierze pierwszy pojemnik tego rodzaju, z którego można wypić.'
              : 'Działanie dotyczy rodzaju, nie zaznaczonej sztuki.')"
          @click="consumeUse.enabled && emit('consume', kind)"
        />
        <ItemsScreenItemButton
          v-if="isThrowableKind(kind)"
          label="Rzuć"
          @click="emit('throw', kind)"
        />
        <ItemsScreenItemButton
          v-if="readUse"
          :label="readUse.label"
          :disabled="!readUse.enabled"
          :title="readUse.reasonLabel ?? undefined"
          @click="readUse.enabled && emit('read', kind)"
        />
        <ItemsScreenItemButton
          v-if="treasureMap"
          label="Odczytaj"
          @click="emit('read', kind)"
        />
        <ItemsScreenItemButton
          v-if="trapKind"
          label="Zastaw (rodzaj)"
          title="Gra wybierze najmniej sprawną działającą pułapkę tego rodzaju."
          @click="emit('place-trap', kind)"
        />
        <ItemsScreenItemButton
          v-if="kind === 'tent'"
          label="Rozstaw (rodzaj)"
          title="Gra wybierze namiot o najniższym stanie."
          @click="emit('place-tent')"
        />
        <ItemsScreenItemButton
          label="Wyrzuć z rodzaju…"
          destructive
          title="To działanie nie wskazuje zaznaczonej sztuki. Gra wyrzuci pierwsze sztuki tego rodzaju według kolejności ekwipunku."
          @click="onDropKind"
        />
      </template>
    </template>
  </ItemDetailCard>
</template>
