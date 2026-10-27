<script setup lang="ts">
/**
 * Thin live adapter — D2(c)/D5: full detail+actions chrome lives in shared
 * `InventoryItemDetails`. Parent resolves exact selection and dispatches.
 */
import type { EquipmentSlot } from '../../items/equipment'
import type { InventoryGroupView, InventoryInstanceRow } from '../../items/inventoryView'
import type { PrimaryWeaponChoice } from '../../items/primaryWeapons'
import type { InventorySelection } from '../components/items/inventoryPresentation'
import InventoryItemDetails from '../components/items/InventoryItemDetails.vue'

defineProps<{
  selection: Exclude<InventorySelection, null>
  group: InventoryGroupView
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
}>()

defineEmits<{
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
</script>

<template>
  <InventoryItemDetails
    v-bind="$props"
    @return-to-list="$emit('return-to-list')"
    @drop="(...args) => $emit('drop', ...args)"
    @request-drop-quantity="(...args) => $emit('request-drop-quantity', ...args)"
    @equip="(...args) => $emit('equip', ...args)"
    @unequip="$emit('unequip')"
    @equip-armor="$emit('equip-armor', $event)"
    @unequip-armor="$emit('unequip-armor', $event)"
    @consume="$emit('consume', $event)"
    @throw="$emit('throw', $event)"
    @read="$emit('read', $event)"
    @place-trap="$emit('place-trap', $event)"
    @place-container="$emit('place-container')"
    @place-tent="$emit('place-tent')"
    @sharpen="$emit('sharpen', $event)"
    @sell="$emit('sell', $event)"
    @set-primary-melee="(...args) => $emit('set-primary-melee', ...args)"
    @set-primary-ranged="(...args) => $emit('set-primary-ranged', ...args)"
  />
</template>
