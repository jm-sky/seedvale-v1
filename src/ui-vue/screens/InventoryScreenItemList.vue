<script setup lang="ts">
import type { PrimaryWeaponChoice } from '../../items/primaryWeapons'
import type {
  InventoryCategoryFilter,
  InventoryPresentationRow,
  InventorySelection,
  InventorySortMode,
} from '../components/items/inventoryPresentation'
/**
 * Thin live adapter — D2(c)/D5: list chrome lives in shared `InventoryList`.
 * InventoryScreen owns projection, selection and filter/sort state.
 */
import InventoryList from '../components/items/InventoryList.vue'

defineProps<{
  rows: readonly InventoryPresentationRow[]
  selection: InventorySelection
  filter: InventoryCategoryFilter
  sortMode: InventorySortMode
  heldTool: string | null
  heldInstanceId: string | null
  primaryMelee: PrimaryWeaponChoice | null
  primaryRanged: PrimaryWeaponChoice | null
  equippedInstanceIds: readonly string[]
  carryingLabel?: string | null
}>()

defineEmits<{
  select: [selection: Exclude<InventorySelection, null>]
  'update:filter': [filter: InventoryCategoryFilter]
  'update:sortMode': [mode: InventorySortMode]
  reveal: []
}>()
</script>

<template>
  <InventoryList
    v-bind="$props"
    @select="$emit('select', $event)"
    @update:filter="$emit('update:filter', $event)"
    @update:sort-mode="$emit('update:sortMode', $event)"
    @reveal="$emit('reveal')"
  />
</template>
