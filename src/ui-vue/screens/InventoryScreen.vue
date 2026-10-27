<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { EquipmentSlot } from '../../items/equipment'
import { previewEquipLoadoutFromSnapshot } from '../../items/equipmentPreview'
import { ITEM_CATALOG } from '../../items/itemCatalog'
import { itemDisplayName } from '../../items/itemDisplay'
import { isInstanceBackedKind } from '../../items/itemInstances'
import { type ItemKind } from '../../items/items'
import { trapKindForItem } from '../../world/animalTraps'
import {
  buildEquipmentSlotViews,
  collectArmorPreviewInstances,
} from '../components/items/collectArmorPreviewInstances'
import EquipmentPanel from '../components/items/EquipmentPanel.vue'
import InventoryItemDetails from '../components/items/InventoryItemDetails.vue'
import InventoryList from '../components/items/InventoryList.vue'
import {
  deriveCompareInstanceId,
  findPresentationRow,
  type InventoryCategoryFilter,
  type InventorySelection,
  type InventorySortMode,
  projectInventoryRows,
  reconcileInventorySelection,
} from '../components/items/inventoryPresentation'
import { useOverlayScreen } from '../composables/useOverlayScreen'
import { useTouchScroll } from '../composables/useTouchScroll'
import { closeInventory, emitUiClick, getSkillValue, isInventoryOpen, openQuantityDialog, showToast, ui } from '../store'

const DESKTOP_MIN_PX = 1200

const selection = ref<InventorySelection>(null)
const filter = ref<InventoryCategoryFilter>('all')
const sortMode = ref<InventorySortMode>('category')
const narrowPage = ref<'list' | 'details'>('list')
const isDesktop = ref(typeof window !== 'undefined' ? window.innerWidth >= DESKTOP_MIN_PX : true)
const detailHeadingId = 'inventory-detail-heading'
const inventorySession = ref(0)
const pendingDropSession = ref<number | null>(null)
const listScrollTop = ref(0)
const listPanelRef = ref<HTMLElement | null>(null)
const shellRef = ref<HTMLElement | null>(null)
const inventoryListRef = ref<InstanceType<typeof InventoryList> | null>(null)

useTouchScroll(shellRef)

const allRows = computed(() => projectInventoryRows(ui.inventory.groups))

const selectedRow = computed(() => findPresentationRow(allRows.value, selection.value))

const compareInstanceId = computed(() =>
  deriveCompareInstanceId(selection.value, allRows.value),
)

const armorInstances = computed(() => collectArmorPreviewInstances(ui.inventory.groups))

const equipmentSlots = computed(() =>
  buildEquipmentSlotViews(ui.inventory.equippedSlots, armorInstances.value),
)

const loadoutPreview = computed(() =>
  previewEquipLoadoutFromSnapshot(
    ui.inventory.equippedSlots,
    armorInstances.value,
    compareInstanceId.value,
  ),
)

const equippedInstanceIds = computed(() =>
  Object.values(ui.inventory.equippedSlots).filter((id): id is string => typeof id === 'string'),
)

const heldLabel = computed(() => {
  const kind = ui.inventory.heldTool
  return kind ? itemDisplayName(kind) : null
})

const primaryMeleeLabel = computed(() => {
  const choice = ui.inventory.primaryMelee
  return choice ? itemDisplayName(choice.kind) : null
})

const primaryRangedLabel = computed(() => {
  const choice = ui.inventory.primaryRanged
  return choice ? itemDisplayName(choice.kind) : null
})

const carryingLabel = computed(() =>
  `Waga: ${ui.inventory.totalWeight.toFixed(1)} / ${ui.inventory.maxWeight.toFixed(1)} kg · Pojemność: ${ui.inventory.totalSize.toFixed(2)} / ${ui.inventory.maxSize.toFixed(2)}`,
)

const detailGroup = computed(() => selectedRow.value?.group ?? null)
const detailInstance = computed(() =>
  selectedRow.value?.type === 'instance' ? selectedRow.value.instance : null,
)

const bookSkillValue = computed(() => {
  if (!selection.value) return null
  const book = ITEM_CATALOG[selection.value.kind]?.book
  return book ? getSkillValue(book.skill) : null
})

function resetLocalUi(): void {
  selection.value = null
  filter.value = 'all'
  sortMode.value = 'category'
  narrowPage.value = 'list'
  listScrollTop.value = 0
  pendingDropSession.value = null
}

function onEscape(): void {
  if (ui.quantityDialog.open) return
  if (!isDesktop.value && narrowPage.value === 'details') {
    returnToList()
    return
  }
  closeInventory()
}

useOverlayScreen('inventory', isInventoryOpen, onEscape)

watch(() => ui.inventory.open, (open) => {
  if (open) {
    inventorySession.value += 1
    resetLocalUi()
  } else {
    pendingDropSession.value = null
    resetLocalUi()
  }
})

watch(
  () => ui.inventory.groups,
  () => {
    const next = reconcileInventorySelection(selection.value, allRows.value)
    if (next !== selection.value) {
      selection.value = next
      if (!next && !isDesktop.value) narrowPage.value = 'list'
    }
  },
)

function updateDesktop(): void {
  const next = window.innerWidth >= DESKTOP_MIN_PX
  const wasDesktop = isDesktop.value
  isDesktop.value = next
  if (wasDesktop === next) return
  // Preserve selection across breakpoint; map page accordingly.
  if (next) {
    narrowPage.value = 'list'
  } else if (selection.value) {
    narrowPage.value = 'details'
  }
}

onMounted(() => {
  updateDesktop()
  window.addEventListener('resize', updateDesktop)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateDesktop)
  pendingDropSession.value = null
})

function onSelect(next: Exclude<InventorySelection, null>): void {
  emitUiClick()
  const changed = !(
    selection.value
    && selection.value.type === next.type
    && selection.value.kind === next.kind
    && (next.type === 'instance'
      ? selection.value.type === 'instance' && selection.value.instanceId === next.instanceId
      : true)
  )
  selection.value = next
  if (!isDesktop.value) {
    if (listPanelRef.value) listScrollTop.value = listPanelRef.value.scrollTop
    narrowPage.value = 'details'
    void nextTick(() => {
      document.getElementById(detailHeadingId)?.focus()
    })
  } else if (changed) {
    // Keep focus on the row button (InventoryList handles it); reset detail scroll via key.
  }
}

function returnToList(): void {
  narrowPage.value = 'list'
  void nextTick(() => {
    if (listPanelRef.value) listPanelRef.value.scrollTop = listScrollTop.value
    inventoryListRef.value?.focusSelectedRow?.()
  })
}

function onBackdrop(): void {
  if (ui.quantityDialog.open) return
  if (!isDesktop.value && narrowPage.value === 'details') {
    returnToList()
    return
  }
  closeInventory()
}

function selectExactId(kind: ItemKind, instanceId: string | null): void {
  if (instanceId && isInstanceBackedKind(kind)) {
    onSelect({ type: 'instance', kind, instanceId })
    return
  }
  if (!isInstanceBackedKind(kind)) {
    onSelect({ type: 'group', kind })
  }
}

function onSelectSlot(_slot: EquipmentSlot, instanceId: string): void {
  const row = allRows.value.find((r) => r.type === 'instance' && r.instanceId === instanceId)
  if (!row || row.type !== 'instance') return
  onSelect({ type: 'instance', kind: row.kind, instanceId })
}

function onSelectHeld(): void {
  const kind = ui.inventory.heldTool
  if (!kind) return
  selectExactId(kind, ui.inventory.heldInstanceId)
}

function onSelectPrimaryMelee(): void {
  const choice = ui.inventory.primaryMelee
  if (!choice) return
  selectExactId(choice.kind, choice.instanceId)
}

function onSelectPrimaryRanged(): void {
  const choice = ui.inventory.primaryRanged
  if (!choice) return
  selectExactId(choice.kind, choice.instanceId)
}

function requestDropQuantity(kind: string, max: number, label: string): void {
  const session = inventorySession.value
  pendingDropSession.value = session
  openQuantityDialog(label, max, (amount) => {
    if (!ui.inventory.open || pendingDropSession.value !== session || inventorySession.value !== session) {
      return
    }
    const live = ui.inventory.counts[kind as ItemKind]
      ?? ui.inventory.groups.find((g) => g.kind === kind)?.count
      ?? 0
    if (live <= 0) return
    const clamped = Math.min(amount, live)
    if (clamped <= 0) return
    ui.inventory.onDrop?.(kind as ItemKind, clamped)
  })
}

function onDrop(kind: string, amount: number): void {
  if (!ui.inventory.open) return
  ui.inventory.onDrop?.(kind as ItemKind, amount)
}

function onEquip(kind: string, instanceId?: string): void {
  ui.inventory.onEquip?.(kind as ItemKind, instanceId)
}

function onUnequip(): void {
  if (selection.value?.type === 'instance') {
    if (ui.inventory.heldInstanceId !== selection.value.instanceId) return
  } else if (selection.value?.type === 'group') {
    if (ui.inventory.heldTool !== selection.value.kind) return
  }
  ui.inventory.onUnequip?.()
}

function onEquipArmor(instanceId: string): void {
  ui.inventory.onEquipArmor?.(instanceId)
}

function onUnequipArmor(slot: EquipmentSlot): void {
  if (selection.value?.type === 'instance') {
    if (ui.inventory.equippedSlots[slot] !== selection.value.instanceId) return
  }
  ui.inventory.onUnequipArmor?.(slot)
}

function onConsume(kind: string): void {
  ui.inventory.onConsume?.(kind as ItemKind)
}

function onThrow(kind: string): void {
  ui.inventory.onThrow?.(kind as ItemKind)
}

function onRead(kind: string): void {
  ui.inventory.onRead?.(kind as ItemKind)
}

function onPlaceTrap(kind: string): void {
  const trapKind = trapKindForItem(kind as ItemKind)
  if (trapKind) ui.inventory.onPlaceTrap?.(trapKind)
}

function onPlaceContainer(): void {
  ui.inventory.onPlaceContainer?.()
}

function onPlaceTent(): void {
  ui.inventory.onPlaceTent?.()
}

function onSharpen(instanceId: string): void {
  const result = ui.inventory.onSharpen?.(instanceId) ?? 'invalid'
  if (result === 'ok') return
  if (result === 'no_whetstone') showToast('Brak osełki.', 'error')
  else if (result === 'already_max') showToast('Ostrość jest już maksymalna.', 'error')
  else showToast('Nie można naostrzyć tej broni.', 'error')
}

function onSell(instanceId: string): void {
  const result = ui.inventory.onSellInstances?.([instanceId]) ?? 'invalid_offer'
  if (result === 'ok') return
  if (result === 'invalid_offer') showToast('Nie masz tego przedmiotu.', 'error')
  else if (result === 'full') showToast('Ekwipunek jest za ciężki.', 'error')
  else if (result === 'not_sold') showToast('Kupiec tego nie kupi.', 'error')
}

function onSetPrimaryMelee(kind: string, instanceId: string | null): void {
  ui.inventory.onSetPrimaryMelee?.(kind as ItemKind, instanceId)
}

function onSetPrimaryRanged(kind: string, instanceId: string | null): void {
  ui.inventory.onSetPrimaryRanged?.(kind as ItemKind, instanceId)
}

const showListPane = computed(() => isDesktop.value || narrowPage.value === 'list')
const showDetailsPane = computed(() =>
  isDesktop.value || narrowPage.value === 'details',
)
</script>

<template>
  <div
    v-if="ui.inventory.open"
    class="pointer-events-auto fixed inset-0 z-20 flex items-center justify-center bg-panel-backdrop backdrop-blur-[2px]"
    :aria-hidden="ui.quantityDialog.open ? 'true' : undefined"
    @click.self="onBackdrop"
  >
    <div
      ref="shellRef"
      role="dialog"
      aria-modal="true"
      aria-labelledby="inventory-dialog-title"
      class="sv-inventory-stage-b flex w-full max-w-7xl flex-col overflow-hidden rounded-[10px] border border-neutral-700 bg-(--surface-solid) p-5 text-neutral-100 shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
      :class="isDesktop
        ? 'h-[min(42rem,calc(100dvh-3rem))]'
        : 'h-[min(100dvh,100dvh)] max-h-[100dvh] w-[calc(100vw-1rem)] max-w-none pb-[max(1rem,env(safe-area-inset-bottom))]'"
      style="touch-action: pan-y"
      :inert="ui.quantityDialog.open ? true : undefined"
      @keydown.tab.stop
      @keyup.tab.stop
    >
      <header class="mb-3 flex shrink-0 items-start justify-between gap-3">
        <div>
          <h1
            id="inventory-dialog-title"
            class="text-lg font-semibold text-neutral-100"
          >
            Ekwipunek
          </h1>
          <p class="text-[13px] text-neutral-400">
            {{ carryingLabel }}
          </p>
        </div>
        <div class="flex items-center gap-2">
          <button
            v-if="!isDesktop && narrowPage === 'details'"
            type="button"
            class="min-h-11 rounded-md border border-neutral-600 px-2.5 py-1 text-xs hover:bg-neutral-800 sm:min-h-0"
            @click="returnToList"
          >
            Powrót
          </button>
          <button
            type="button"
            class="min-h-11 rounded-md border border-neutral-600 px-2.5 py-1 text-xs hover:bg-neutral-800 sm:min-h-0"
            aria-label="Zamknij ekwipunek"
            @click="closeInventory"
          >
            Zamknij
          </button>
        </div>
      </header>

      <!-- Desktop: V3 two-column — list | (details above equipment) -->
      <div
        v-if="isDesktop"
        class="grid min-h-0 flex-1 gap-4 overflow-hidden"
        style="grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr)"
      >
        <div class="flex min-h-0 min-w-0 flex-col overflow-hidden">
          <InventoryList
            ref="inventoryListRef"
            class="min-h-0 flex-1"
            :rows="allRows"
            :selection="selection"
            :filter="filter"
            :sort-mode="sortMode"
            :held-tool="ui.inventory.heldTool"
            :held-instance-id="ui.inventory.heldInstanceId"
            :primary-melee="ui.inventory.primaryMelee"
            :primary-ranged="ui.inventory.primaryRanged"
            :equipped-instance-ids="equippedInstanceIds"
            @select="onSelect"
            @update:filter="filter = $event"
            @update:sort-mode="sortMode = $event"
            @reveal="filter = 'all'"
          />
        </div>
        <div class="flex min-h-0 min-w-0 flex-col gap-4 overflow-y-auto">
          <InventoryItemDetails
            v-if="selection && detailGroup"
            :key="selection.type === 'instance' ? selection.instanceId : selection.kind"
            :selection="selection"
            :group="detailGroup"
            :instance="detailInstance"
            :held-tool="ui.inventory.heldTool"
            :held-instance-id="ui.inventory.heldInstanceId"
            :primary-melee="ui.inventory.primaryMelee"
            :primary-ranged="ui.inventory.primaryRanged"
            :equipped-slots="ui.inventory.equippedSlots"
            :counts="ui.inventory.counts"
            :whetstone-count="ui.inventory.counts.whetstone ?? 0"
            :merchant-open="ui.merchant.open"
            :book-skill-value="bookSkillValue"
            :show-return="false"
            :heading-id="detailHeadingId"
            :solid="false"
            @drop="onDrop"
            @request-drop-quantity="requestDropQuantity"
            @equip="onEquip"
            @unequip="onUnequip"
            @equip-armor="onEquipArmor"
            @unequip-armor="onUnequipArmor"
            @consume="onConsume"
            @throw="onThrow"
            @read="onRead"
            @place-trap="onPlaceTrap"
            @place-container="onPlaceContainer"
            @place-tent="onPlaceTent"
            @sharpen="onSharpen"
            @sell="onSell"
            @set-primary-melee="onSetPrimaryMelee"
            @set-primary-ranged="onSetPrimaryRanged"
          />
          <div
            v-else
            class="flex min-h-[12rem] items-center justify-center rounded-lg border border-dashed border-neutral-700 text-sm text-neutral-500"
          >
            Wybierz przedmiot
          </div>
          <a
            v-if="selection"
            :href="`#${detailHeadingId}`"
            class="sr-only focus:not-sr-only focus:absolute focus:z-10 focus:rounded focus:bg-neutral-900 focus:px-2 focus:py-1 focus:text-xs"
          >
            Przejdź do szczegółów
          </a>
          <EquipmentPanel
            :slots="equipmentSlots"
            :held-tool="ui.inventory.heldTool"
            :held-label="heldLabel"
            :held-instance-id="ui.inventory.heldInstanceId"
            :primary-melee="ui.inventory.primaryMelee"
            :primary-ranged="ui.inventory.primaryRanged"
            :primary-melee-label="primaryMeleeLabel"
            :primary-ranged-label="primaryRangedLabel"
            :selected-kind="selection?.kind ?? null"
            :counts="ui.inventory.counts"
            :loadout-current="loadoutPreview.current"
            :loadout-delta="loadoutPreview.delta"
            :loadout-context="loadoutPreview.context"
            :compare-instance-id="compareInstanceId"
            @select-slot="onSelectSlot"
            @select-held="onSelectHeld"
            @select-primary-melee="onSelectPrimaryMelee"
            @select-primary-ranged="onSelectPrimaryRanged"
            @unequip-armor="onUnequipArmor"
            @unequip="onUnequip"
          />
        </div>
      </div>

      <!-- Narrow List / Details -->
      <div
        v-else
        class="min-h-0 flex-1 overflow-hidden"
      >
        <div
          v-show="showListPane"
          ref="listPanelRef"
          class="flex h-full min-h-0 flex-col gap-3 overflow-y-auto"
        >
          <InventoryList
            ref="inventoryListRef"
            :rows="allRows"
            :selection="selection"
            :filter="filter"
            :sort-mode="sortMode"
            :held-tool="ui.inventory.heldTool"
            :held-instance-id="ui.inventory.heldInstanceId"
            :primary-melee="ui.inventory.primaryMelee"
            :primary-ranged="ui.inventory.primaryRanged"
            :equipped-instance-ids="equippedInstanceIds"
            @select="onSelect"
            @update:filter="filter = $event"
            @update:sort-mode="sortMode = $event"
            @reveal="filter = 'all'"
          />
          <EquipmentPanel
            :slots="equipmentSlots"
            :held-tool="ui.inventory.heldTool"
            :held-label="heldLabel"
            :held-instance-id="ui.inventory.heldInstanceId"
            :primary-melee="ui.inventory.primaryMelee"
            :primary-ranged="ui.inventory.primaryRanged"
            :primary-melee-label="primaryMeleeLabel"
            :primary-ranged-label="primaryRangedLabel"
            :selected-kind="selection?.kind ?? null"
            :counts="ui.inventory.counts"
            :loadout-current="loadoutPreview.current"
            :loadout-delta="loadoutPreview.delta"
            :loadout-context="loadoutPreview.context"
            :compare-instance-id="compareInstanceId"
            @select-slot="onSelectSlot"
            @select-held="onSelectHeld"
            @select-primary-melee="onSelectPrimaryMelee"
            @select-primary-ranged="onSelectPrimaryRanged"
            @unequip-armor="onUnequipArmor"
            @unequip="onUnequip"
          />
        </div>
        <div
          v-show="showDetailsPane"
          class="h-full min-h-0 overflow-y-auto"
        >
          <InventoryItemDetails
            v-if="selection && detailGroup"
            :key="selection.type === 'instance' ? selection.instanceId : selection.kind"
            :selection="selection"
            :group="detailGroup"
            :instance="detailInstance"
            :held-tool="ui.inventory.heldTool"
            :held-instance-id="ui.inventory.heldInstanceId"
            :primary-melee="ui.inventory.primaryMelee"
            :primary-ranged="ui.inventory.primaryRanged"
            :equipped-slots="ui.inventory.equippedSlots"
            :counts="ui.inventory.counts"
            :whetstone-count="ui.inventory.counts.whetstone ?? 0"
            :merchant-open="ui.merchant.open"
            :book-skill-value="bookSkillValue"
            :show-return="true"
            :heading-id="detailHeadingId"
            @return-to-list="returnToList"
            @drop="onDrop"
            @request-drop-quantity="requestDropQuantity"
            @equip="onEquip"
            @unequip="onUnequip"
            @equip-armor="onEquipArmor"
            @unequip-armor="onUnequipArmor"
            @consume="onConsume"
            @throw="onThrow"
            @read="onRead"
            @place-trap="onPlaceTrap"
            @place-container="onPlaceContainer"
            @place-tent="onPlaceTent"
            @sharpen="onSharpen"
            @sell="onSell"
            @set-primary-melee="onSetPrimaryMelee"
            @set-primary-ranged="onSetPrimaryRanged"
          />
        </div>
      </div>
    </div>
  </div>
</template>
