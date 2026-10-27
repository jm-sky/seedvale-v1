import { afterEach, describe, expect, it } from 'vitest'
// @vitest-environment jsdom
import { createApp, h, nextTick } from 'vue'
import { createArmorInstance } from '../../../items/armorItemInstances'
import { Inventory } from '../../../items/Inventory'
import { buildInventoryGroups } from '../../../items/inventoryView'
import { createWeaponInstance } from '../../../items/weaponMaintenance'
import InventoryItemDetails from './InventoryItemDetails.vue'
import InventoryList from './InventoryList.vue'
import {
  type InventorySelection,
  projectInventoryRows,
} from './inventoryPresentation'

const mounts: Array<{ app: ReturnType<typeof createApp>; el: HTMLElement }> = []

function mountComponent(component: unknown, props: Record<string, unknown>): {
  el: HTMLElement
  emitted: Record<string, unknown[][]>
  unmount: () => void
} {
  const el = document.createElement('div')
  document.body.appendChild(el)
  const emitted: Record<string, unknown[][]> = {}
  const app = createApp({
    render: () => h(component as object, {
      ...props,
      onSelect: (...args: unknown[]) => {
        ;(emitted.select ??= []).push(args)
      },
      onDrop: (...args: unknown[]) => {
        ;(emitted.drop ??= []).push(args)
      },
      onRequestDropQuantity: (...args: unknown[]) => {
        ;(emitted['request-drop-quantity'] ??= []).push(args)
      },
      onEquip: (...args: unknown[]) => {
        ;(emitted.equip ??= []).push(args)
      },
    }),
  })
  app.mount(el)
  mounts.push({ app, el })
  return {
    el,
    emitted,
    unmount: () => {
      app.unmount()
      el.remove()
    },
  }
}

afterEach(() => {
  while (mounts.length > 0) {
    const entry = mounts.pop()!
    entry.app.unmount()
    entry.el.remove()
  }
})

describe('hybrid inventory UI actions (D2c)', () => {
  it('selecting a list row emits selection and leaves inventory unchanged', async () => {
    const inventory = new Inventory({}, 100, undefined, undefined, 100)
    inventory.addInstance(createArmorInstance('leather_armor', 'common', 'a1'))
    inventory.add('arrow', 3)
    const before = inventory.getInstances('leather_armor').map((i) => i.id)
    const rows = projectInventoryRows(buildInventoryGroups(inventory))
    const { el, emitted } = mountComponent(InventoryList, {
      rows,
      selection: null,
      filter: 'all',
      sortMode: 'category',
      heldTool: null,
      heldInstanceId: null,
      primaryMelee: null,
      primaryRanged: null,
      equippedInstanceIds: [],
    })
    await nextTick()
    const rowBtn = el.querySelector('ul button')
    expect(rowBtn).toBeTruthy()
    ;(rowBtn as HTMLButtonElement).click()
    await nextTick()
    expect(emitted.select?.length).toBe(1)
    expect(inventory.getInstances('leather_armor').map((i) => i.id)).toEqual(before)
    expect(inventory.count('arrow')).toBe(3)
  })

  it('instance details show group-drop warning and request kind-scoped quantity', async () => {
    const inventory = new Inventory({}, 100, undefined, undefined, 100)
    const first = createWeaponInstance('knife')
    const second = createWeaponInstance('knife')
    inventory.addInstance(first)
    inventory.addInstance(second)
    const groups = buildInventoryGroups(inventory)
    const rows = projectInventoryRows(groups)
    const selected = rows.find((r) => r.type === 'instance' && r.instanceId === second.id)!
    const selection: Exclude<InventorySelection, null> = {
      type: 'instance',
      kind: 'knife',
      instanceId: second.id,
    }
    const { el, emitted } = mountComponent(InventoryItemDetails, {
      selection,
      group: selected.group,
      instance: selected.type === 'instance' ? selected.instance : null,
      heldTool: null,
      heldInstanceId: null,
      primaryMelee: null,
      primaryRanged: null,
      equippedSlots: {},
      counts: { knife: 2 },
      whetstoneCount: 0,
      merchantOpen: false,
      bookSkillValue: null,
      showReturn: false,
    })
    await nextTick()
    expect(el.textContent).toMatch(/kolejności ekwipunku/i)
    const dropBtn = Array.from(el.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Wyrzuć z rodzaju'),
    )
    expect(dropBtn).toBeTruthy()
    ;(dropBtn as HTMLButtonElement).click()
    await nextTick()
    expect(emitted['request-drop-quantity']?.[0]?.[0]).toBe('knife')
    expect(String(emitted['request-drop-quantity']?.[0]?.[2] ?? '')).toMatch(/rodzaju/i)
  })

  it('group drop with inventory order A,B removes A first while B stays selectable', () => {
    const inventory = new Inventory({}, 100, undefined, undefined, 100)
    const a = createWeaponInstance('knife')
    const b = createWeaponInstance('knife')
    inventory.addInstance(a)
    inventory.addInstance(b)
    expect(inventory.getInstances('knife').map((i) => i.id)).toEqual([a.id, b.id])
    inventory.removeInstance(inventory.getInstances('knife')[0]!.id)
    expect(inventory.getInstance(a.id)).toBeNull()
    expect(inventory.getInstance(b.id)).not.toBeNull()
    const rows = projectInventoryRows(buildInventoryGroups(inventory))
    expect(rows.some((r) => r.type === 'instance' && r.instanceId === b.id)).toBe(true)
    expect(rows.some((r) => r.type === 'instance' && r.instanceId === a.id)).toBe(false)
  })

  it('equip intent from exact instance passes that ID', async () => {
    const inventory = new Inventory({}, 100, undefined, undefined, 100)
    inventory.addInstance(createWeaponInstance('knife'))
    const id = inventory.getInstances('knife')[0]!.id
    const groups = buildInventoryGroups(inventory)
    const rows = projectInventoryRows(groups)
    const selected = rows.find((r) => r.type === 'instance' && r.instanceId === id)!
    const { el, emitted } = mountComponent(InventoryItemDetails, {
      selection: { type: 'instance', kind: 'knife', instanceId: id },
      group: selected.group,
      instance: selected.type === 'instance' ? selected.instance : null,
      heldTool: null,
      heldInstanceId: null,
      primaryMelee: null,
      primaryRanged: null,
      equippedSlots: {},
      counts: { knife: 1 },
      whetstoneCount: 1,
      merchantOpen: false,
      bookSkillValue: null,
      showReturn: false,
    })
    await nextTick()
    const take = Array.from(el.querySelectorAll('button')).find((b) => b.textContent?.trim() === 'Weź')
    expect(take).toBeTruthy()
    ;(take as HTMLButtonElement).click()
    await nextTick()
    expect(emitted.equip?.[0]).toEqual(['knife', id])
  })
})
