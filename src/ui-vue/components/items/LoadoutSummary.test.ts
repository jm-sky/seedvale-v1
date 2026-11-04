// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest'
import { createApp, h, nextTick } from 'vue'
import { createArmorInstance } from '../../../items/armorItemInstances'
import { createEquipmentState, resolveProtectionSnapshot } from '../../../items/equipment'
import { emptyLoadoutStats, type LoadoutStatView } from '../../../items/equipmentPreview'
import { Inventory } from '../../../items/Inventory'
import { equipmentSnapshotToCharacterView } from '../../../player/characterPresentation'
import LoadoutSummary from './LoadoutSummary.vue'

let app: ReturnType<typeof createApp> | undefined
let el: HTMLElement

afterEach(() => {
  app?.unmount()
  el?.remove()
})

function mailStats(): LoadoutStatView {
  const inventory = new Inventory({}, Infinity, undefined, undefined, Infinity)
  const equipment = createEquipmentState(inventory)
  for (const kind of ['chainmail', 'leather_trousers'] as const) {
    const instance = createArmorInstance(kind, 'common')
    inventory.addInstance(instance)
    equipment.equip(instance.id, inventory)
  }
  return { ...equipmentSnapshotToCharacterView(resolveProtectionSnapshot(equipment, inventory)), gearWeightKg: 10.8 }
}

async function mount(current: LoadoutStatView, extra: Record<string, unknown> = {}) {
  el = document.createElement('div')
  document.body.appendChild(el)
  app = createApp({ render: () => h(LoadoutSummary, { current, context: 'ctx', ...extra }) })
  app.mount(el)
  await nextTick()
}

describe('LoadoutSummary', () => {
  it('shows reference expected protection, switches profile in the UI only and expands the 7x3 table', async () => {
    const current = mailStats()
    await mount(current, { carriedWeightKg: 21.5, carryCapacityKg: 60 })
    const text = () => el.textContent ?? ''
    expect(text()).toContain('cięcie (referencyjny)')
    expect(text()).toContain(`${Math.round(current.expectedByProfile.reference.cut * 100)}%`)
    expect(text()).toContain('21.5 / 60.0 kg')
    expect(text()).toContain('Waga zbroi')
    expect(text()).not.toMatch(/redukcj/i)

    const lowBite = Array.from(el.querySelectorAll('button')).find((b) => b.textContent === 'Gryzienie nisko')!
    lowBite.click()
    await nextTick()
    expect(text()).toContain('cięcie (gryzienie nisko)')
    expect(text()).toContain(`${Math.round(current.expectedByProfile['low-bite'].cut * 100)}%`)

    expect(el.querySelector('[data-testid="protection-table"]')).toBeNull()
    Array.from(el.querySelectorAll('button')).find((b) => b.textContent?.includes('Tabela regionów'))!.click()
    await nextTick()
    expect(el.querySelectorAll('[data-testid="protection-table"] tbody tr')).toHaveLength(7)
    expect(el.querySelectorAll('[data-testid="protection-table"] thead th')).toHaveLength(4)
  })

  it('shows the unavailable reason instead of the context for a stale candidate', async () => {
    await mount(emptyLoadoutStats(), { unavailableReason: 'Przedmiot niedostępny' })
    expect(el.querySelector('#inventory-loadout-context')?.textContent?.trim()).toBe('Przedmiot niedostępny')
  })
})
