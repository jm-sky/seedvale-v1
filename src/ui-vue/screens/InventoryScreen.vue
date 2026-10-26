<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { EquipmentSlot } from '../../items/equipment'
import { isTouchDevice } from '../../input/isTouchDevice'
import { previewEquipLoadoutFromSnapshot } from '../../items/equipmentPreview'
import { isArmorCatalogKind, ITEM_CATALOG } from '../../items/itemCatalog'
import { itemDisplayName } from '../../items/itemDisplay'
import { type ItemKind } from '../../items/items'
import {
  buildEquipmentSlotViews,
  collectArmorPreviewInstances,
} from '../components/items/collectArmorPreviewInstances'
import EquipmentPanel from '../components/items/EquipmentPanel.vue'
import { useOverlayScreen } from '../composables/useOverlayScreen'
import { useTouchScroll } from '../composables/useTouchScroll'
import { closeInventory, emitUiClick, isInventoryOpen, ui } from '../store'
import InventoryScreenItemDetails from './InventoryScreenItemDetails.vue'
import InventoryScreenItemList from './InventoryScreenItemList.vue'

const selectedItem = ref<ItemKind | null>(null)
/** Armor instance id for loadout compare — never equips by itself. */
const compareInstanceId = ref<string | null>(null)

const panel = ref<HTMLElement | null>(null)
const touchDevice = isTouchDevice()

const detailsOpen = computed(() => selectedItem.value != null)

function closeDetails(): void {
  selectedItem.value = null
}

function onEscape(): void {
  if (detailsOpen.value) {
    closeDetails()
  } else {
    closeInventory()
  }
}

useOverlayScreen('inventory', isInventoryOpen, onEscape)
useTouchScroll(panel)

watch(() => ui.inventory.open, (open) => {
  if (!open) {
    selectedItem.value = null
    compareInstanceId.value = null
  }
})

watch(
  () => ui.inventory.groups,
  () => {
    if (!compareInstanceId.value) return
    const ids = new Set(
      ui.inventory.groups.flatMap((g) => g.instances.map((row) => row.id)),
    )
    if (!ids.has(compareInstanceId.value)) compareInstanceId.value = null
  },
)

const onSelectItem = (item: ItemKind) => {
  emitUiClick()
  selectedItem.value = item
}

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

const ammoLines = computed(() => {
  const choice = ui.inventory.primaryRanged
  if (!choice) return [] as string[]
  const ranged = ITEM_CATALOG[choice.kind]?.ranged
  if (!ranged) return [] as string[]
  return ranged.ammoKinds.map((kind) => {
    const count = ui.inventory.counts[kind] ?? 0
    return `${itemDisplayName(kind)} ×${count}`
  })
})

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

function onCompareInstance(instanceId: string): void {
  emitUiClick()
  compareInstanceId.value = instanceId
}

function onSelectSlot(_slot: EquipmentSlot, instanceId: string): void {
  emitUiClick()
  compareInstanceId.value = instanceId
}

function onUnequipArmor(slot: EquipmentSlot): void {
  emitUiClick()
  ui.inventory.onUnequipArmor?.(slot)
}

function onUnequipHeld(): void {
  emitUiClick()
  ui.inventory.onUnequip?.()
}

function onSelectHeld(): void {
  if (!ui.inventory.heldTool) return
  emitUiClick()
  selectedItem.value = ui.inventory.heldTool
}

function onCompareKind(kind: ItemKind): void {
  if (!isArmorCatalogKind(kind)) return
  const group = ui.inventory.groups.find((g) => g.kind === kind)
  const first = group?.instances[0]
  if (!first) return
  onCompareInstance(first.id)
}
</script>

<template>
  <div
    v-if="ui.inventory.open"
    class="pointer-events-auto fixed inset-0 z-20 flex items-center justify-center bg-panel-backdrop backdrop-blur-[2px]"
    @click.self="closeInventory"
  >
    <!-- Fixed shell so category filters do not resize the inventory panel. -->
    <div
      ref="panel"
      class="sv-inventory-stage-b flex h-[min(42rem,calc(100dvh-3rem))] w-full max-w-5xl flex-col overflow-hidden rounded-[10px] border border-neutral-700 bg-(--surface-solid) p-5 text-neutral-100 shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
      style="touch-action: pan-y"
    >
      <div class="grid min-h-0 flex-1 gap-4 overflow-hidden lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div class="min-h-0 overflow-y-auto">
          <InventoryScreenItemList
            embedded
            :compare-instance-id="compareInstanceId"
            @select-item="onSelectItem"
            @compare-instance="onCompareInstance"
            @compare-kind="onCompareKind"
          />
        </div>
        <div class="min-h-0 overflow-y-auto">
          <EquipmentPanel
            :slots="equipmentSlots"
            :held-tool="ui.inventory.heldTool"
            :held-label="heldLabel"
            :primary-melee="ui.inventory.primaryMelee"
            :primary-ranged="ui.inventory.primaryRanged"
            :primary-melee-label="primaryMeleeLabel"
            :primary-ranged-label="primaryRangedLabel"
            :ammo-lines="ammoLines"
            :loadout-current="loadoutPreview.current"
            :loadout-delta="loadoutPreview.delta"
            :loadout-context="loadoutPreview.context"
            :compare-instance-id="compareInstanceId"
            @select-slot="onSelectSlot"
            @unequip-armor="onUnequipArmor"
            @unequip-held="onUnequipHeld"
            @select-held="onSelectHeld"
          />
        </div>
      </div>
    </div>

    <!-- Details as a nested modal over inventory; click-outside closes details only. -->
    <div
      v-if="detailsOpen"
      class="pointer-events-auto absolute inset-0 z-30 flex items-center justify-center bg-black/50"
      @click.self="closeDetails"
    >
      <InventoryScreenItemDetails
        :selected-item="selectedItem"
        @return-to-list="closeDetails"
      />
    </div>

    <div
      v-if="!detailsOpen"
      class="absolute bottom-3 left-0 right-0 text-center text-[11px] opacity-60"
    >
      {{ touchDevice ? 'Dotknij poza oknem — zamknij' : 'Esc — zamknij' }}
    </div>
    <div
      v-else
      class="absolute bottom-3 left-0 right-0 z-30 text-center text-[11px] opacity-60"
    >
      {{ touchDevice ? 'Dotknij poza kartą — wróć do ekwipunku' : 'Esc — wróć do ekwipunku' }}
    </div>
  </div>
</template>
