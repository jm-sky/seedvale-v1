// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createApp, h, nextTick } from 'vue'
import { createKeyboard } from '../../input/Keyboard'
import { createArmorInstance } from '../../items/armorItemInstances'
import { Inventory } from '../../items/Inventory'
import { buildInventoryGroups } from '../../items/inventoryView'
import { closeQuantityDialog, closeTopOverlay, invalidateWorldBoundUiSessions, openQuantityDialog, ui } from '../store'
import InventoryScreen from './InventoryScreen.vue'

let app: ReturnType<typeof createApp> | undefined
let el: HTMLElement

afterEach(() => {
  app?.unmount()
  el?.remove()
  invalidateWorldBoundUiSessions()
})

async function mount(width: number) {
  Object.defineProperty(window, 'innerWidth', { value: width, configurable: true })
  const inventory = new Inventory({})
  inventory.addInstance(createArmorInstance('leather_armor', 'poor', 'armor:first'))
  inventory.addInstance(createArmorInstance('leather_armor', 'good', 'armor:second'))
  ui.inventory.groups = buildInventoryGroups(inventory)
  ui.inventory.equippedSlots = { body: 'armor:first' }
  ui.inventory.onEquipArmor = vi.fn()
  ui.inventory.open = true
  el = document.createElement('div')
  document.body.appendChild(el)
  app = createApp({ render: () => h(InventoryScreen) })
  app.mount(el)
  await nextTick()
  return Array.from(el.querySelectorAll<HTMLButtonElement>('ul[role="list"] button'))
}

describe('current inventory review 026 regressions (F2/F3)', () => {
  it.each([false, true])('keeps details Tab navigation out of gameplay (shift: %s)', async (shiftKey) => {
    const keyboard = createKeyboard()
    try {
      const rows = await mount(390)
      rows[1]!.click()
      await nextTick()
      await nextTick()
      const heading = document.activeElement!
      expect(heading.id).toBe('inventory-detail-heading')
      for (const type of ['keydown', 'keyup']) {
        const event = new KeyboardEvent(type, { key: 'Tab', code: 'Tab', shiftKey, bubbles: true, cancelable: true })
        heading.dispatchEvent(event)
        expect(event.defaultPrevented).toBe(false)
        expect(keyboard.consumeCycleTarget()).toBe(false)
      }
    } finally {
      keyboard.dispose()
    }
  })

  it.each([1366, 390])('equips the selected second armor ID at width %i', async (width) => {
    const rows = await mount(width)
    rows[1]!.click()
    await nextTick()
    const equip = Array.from(el.querySelectorAll('button')).find((button) => button.textContent?.trim() === 'Załóż')
    expect(equip).toBeDefined()
    expect(ui.inventory.onEquipArmor).not.toHaveBeenCalled()
    equip!.click()
    expect(ui.inventory.onEquipArmor).toHaveBeenCalledExactlyOnceWith('armor:second')
  })

  it('previews the second same-kind armor by ID without equipping or opening another dialog', async () => {
    const rows = await mount(1366)
    expect(rows).toHaveLength(2)
    rows[1]!.focus()
    rows[1]!.click()
    await nextTick()
    expect(rows[1]!.getAttribute('aria-current')).toBe('true')
    expect(el.querySelector('#inventory-loadout-context')?.textContent).toContain('Zastępuje:')
    expect(el.querySelector('#inventory-detail-heading')?.textContent).toBeTruthy()
    expect(el.querySelectorAll('[role="dialog"]')).toHaveLength(1)
    expect(ui.inventory.onEquipArmor).not.toHaveBeenCalled()
    expect(ui.inventory.equippedSlots.body).toBe('armor:first')
    expect(document.activeElement).toBe(rows[1])
  })

  it('hides the narrow covered list, transfers focus, and returns to the origin before closing', async () => {
    const rows = await mount(390)
    rows[1]!.focus()
    rows[1]!.click()
    await nextTick()
    await nextTick()
    expect(document.activeElement?.id).toBe('inventory-detail-heading')
    const listPane = rows[1]!.closest('ul')!.parentElement!
    // v-show removes the entire list/equipment pane from keyboard navigation.
    let ancestor: HTMLElement | null = listPane
    while (ancestor && ancestor.style.display !== 'none') ancestor = ancestor.parentElement
    expect(ancestor).not.toBeNull()
    expect(el.querySelectorAll('[role="dialog"]')).toHaveLength(1)
    openQuantityDialog('Wyrzuć', 2, vi.fn())
    await nextTick()
    expect(el.querySelector('[role="dialog"]')?.hasAttribute('inert')).toBe(true)
    // The quantity dialog owns Escape; inventory navigation must wait.
    closeTopOverlay()
    expect(ui.inventory.open).toBe(true)
    expect(document.activeElement?.id).toBe('inventory-detail-heading')
    closeQuantityDialog()
    closeTopOverlay()
    await nextTick()
    await nextTick()
    expect(document.activeElement).toBe(rows[1])
    expect(ui.inventory.open).toBe(true)
    closeTopOverlay()
    expect(ui.inventory.open).toBe(false)
  })
})
