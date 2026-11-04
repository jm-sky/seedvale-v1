// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest'
import { createApp, h, nextTick } from 'vue'
import type { EquipmentPositionKey } from '../../../items/equipmentTypes'
import { emptyLoadoutStats } from '../../../items/equipmentPreview'
import { buildEquipmentSlotViews } from './collectArmorPreviewInstances'
import EquipmentPanel from './EquipmentPanel.vue'

let app: ReturnType<typeof createApp> | undefined
let el: HTMLElement

afterEach(() => {
  app?.unmount()
  el?.remove()
})

async function mount(emitted: { unequip: EquipmentPositionKey[], select: [EquipmentPositionKey, string][] }, highlight: EquipmentPositionKey | null = null) {
  const slots = buildEquipmentSlotViews(
    { 'body:under': 'u1', 'body:outer': 'o1' },
    [
      { id: 'u1', kind: 'padded_jacket', quality: 'common', label: 'pikowana kurta' },
      { id: 'o1', kind: 'chainmail', quality: 'good', label: 'kolczuga' },
    ],
  )
  el = document.createElement('div')
  document.body.appendChild(el)
  app = createApp({
    render: () => h(EquipmentPanel, {
      slots,
      heldTool: null,
      heldLabel: null,
      primaryMelee: null,
      primaryRanged: null,
      primaryMeleeLabel: null,
      primaryRangedLabel: null,
      counts: {},
      loadoutCurrent: emptyLoadoutStats(),
      loadoutContext: '—',
      highlightPosition: highlight,
      positionsWithCandidates: new Set<EquipmentPositionKey>(['head:outer']),
      'onUnequip-armor': (position: EquipmentPositionKey) => emitted.unequip.push(position),
      'onSelect-slot': (position: EquipmentPositionKey, id: string) => emitted.select.push([position, id]),
    }),
  })
  app.mount(el)
  await nextTick()
}

describe('EquipmentPanel layer rows', () => {
  it('renders Spód before Wierzch in each armor cell and removes the exact position', async () => {
    const emitted = { unequip: [] as EquipmentPositionKey[], select: [] as [EquipmentPositionKey, string][] }
    await mount(emitted)
    const bodyRows = Array.from(el.querySelectorAll<HTMLElement>('[data-position^="body:"]'))
    expect(bodyRows.map((row) => row.dataset.position)).toEqual(['body:under', 'body:outer'])
    el.querySelector<HTMLButtonElement>('[data-position="body:under"] button[aria-label^="Zdejmij"]')!.click()
    el.querySelector<HTMLButtonElement>('[data-position="body:outer"] button:not([aria-label])')!.click()
    expect(emitted.unequip).toEqual(['body:under'])
    expect(emitted.select).toEqual([['body:outer', 'o1']])
  })

  it('distinguishes empty rows, keeps the shield disabled and highlights only the target position', async () => {
    await mount({ unequip: [], select: [] }, 'body:outer')
    expect(el.querySelector('[data-position="head:outer"]')?.textContent).toContain('—')
    expect(el.querySelector('[data-position="head:under"]')?.textContent).toContain('Brak pasujących')
    expect(el.querySelector('[aria-label="Tarcza"]')?.textContent).toContain('N/A')
    expect(el.querySelectorAll('.ring-primary')).toHaveLength(1)
    expect(el.querySelector('[data-position="body:outer"]')?.classList.contains('ring-primary')).toBe(true)
  })
})
