// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createApp, h, nextTick } from 'vue'
import type { NpcAgent } from '../ai/NpcAgent'
import type { Settlement } from '../settlement/createSettlement'
import { Inventory } from '../items/Inventory'
import { QuestManager } from '../quests/QuestManager'
import NpcDialogueMenu from './NpcDialogueMenu.vue'
import { closeNpcDialogueMenu, configureNpcVoiceSounds, invalidateWorldBoundUiSessions, openNpcDialogueMenu, ui } from './store'

const settlement = { isHome: false, name: 'Test' } as Settlement

function stubNpc(id: string): NpcAgent {
  return {
    id,
    name: id,
    displayName: id,
    gender: 'male',
    role: 'farmer',
    age: 40,
    health: { dead: false },
    personality: { openness: 0.5, conscientiousness: 0.5, extraversion: 0.5, agreeableness: 0.5, neuroticism: 0.5 },
    familyMembers: [],
    getCurrentActivity: () => ({ kind: 'idle' }),
    voiceProfileId: 'general:male',
    getDialogueLine: () => 'hello',
    preparePaymentRequest: () => null,
    pendingVoluntaryJoinProposal: () => null,
    pendingPlayerFollowUp: () => null,
    mesh: { position: { x: 0, y: 0, z: 0 } },
    stopPlayerReactionVoice: () => {},
  } as unknown as NpcAgent
}

let app: ReturnType<typeof createApp> | undefined
let el: HTMLElement

afterEach(() => {
  app?.unmount()
  el?.remove()
  invalidateWorldBoundUiSessions()
  configureNpcVoiceSounds(null)
})

async function mount() {
  el = document.createElement('div')
  document.body.appendChild(el)
  app = createApp({ render: () => h(NpcDialogueMenu) })
  app.mount(el)
  await nextTick()
}

function open(id = 'npc-1') {
  openNpcDialogueMenu(stubNpc(id), settlement, new QuestManager([], undefined, new Inventory()), 0.4)
}

async function flush() {
  await nextTick()
  await nextTick()
}

function choice(label: string): HTMLButtonElement {
  const btn = Array.from(el.querySelectorAll<HTMLButtonElement>('button')).find((b) => b.textContent?.includes(label))
  if (!btn) throw new Error(`no choice "${label}"`)
  return btn
}

describe('NpcDialogueMenu history', () => {
  it('shows one greeting per open and resets on reopening the same NPC', async () => {
    await mount()
    open()
    await flush()
    const first = el.textContent ?? ''
    expect(ui.npcDialogueMenu.greetingText).not.toBe('')
    expect(first.split(ui.npcDialogueMenu.greetingText).length - 1).toBe(1)
    choice('Rozmowa').click()
    await flush()
    choice('Co teraz robisz?').click()
    await flush()
    open()
    await flush()
    expect(el.textContent).not.toContain('Co teraz robisz?')
  })

  it('does not echo navigation labels or replay on back', async () => {
    await mount()
    open()
    await flush()
    choice('Rozmowa').click()
    await flush()
    expect(el.querySelector('ul[aria-live]')?.textContent ?? '').not.toContain('Rozmowa')
    choice('Powiedz coś o sobie.').click()
    await flush()
    const count = () => el.querySelectorAll('ul[aria-live] li').length
    const before = count()
    choice('Wróć').click()
    await flush()
    expect(count()).toBe(before)
  })

  it('commits an expedition invitation once, with a full line and not the duration label', async () => {
    await mount()
    const onProposeJoin = vi.fn(() => 'Chętnie.')
    ui.npcDialogueMenu.onProposeJoin = onProposeJoin
    open()
    await flush()
    choice('Działania').click()
    await flush()
    choice('Zaproponuj udział w wyprawie').click()
    await flush()
    expect(onProposeJoin).not.toHaveBeenCalled()
    const days = choice('2 dni')
    days.click()
    days.click()
    await flush()
    expect(onProposeJoin).toHaveBeenCalledTimes(1)
    expect(onProposeJoin).toHaveBeenCalledWith(2)
    expect(el.textContent).toContain('na dwa dni')
    expect(el.textContent).toContain('Chętnie.')
  })

  it('ignores a late area reply after the session was replaced', async () => {
    await mount()
    let resolveArea!: (v: string) => void
    ui.npcDialogueMenu.onAskAboutArea = () => new Promise<string>((r) => { resolveArea = r })
    ui.npcDialogueMenu.onRequestFood = () => 'food'
    open('hunter')
    ;(ui.npcDialogueMenu.npc as { role: string }).role = 'hunter'
    await flush()
    choice('Rozmowa').click()
    await flush()
    choice('Opowiedz mi coś o okolicy.').click()
    await flush()
    closeNpcDialogueMenu({ decline: false })
    open('other')
    await flush()
    resolveArea('STALE AREA LINE')
    await flush()
    expect(el.textContent).not.toContain('STALE AREA LINE')
  })
})
