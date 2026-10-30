<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { NpcAgent } from '../ai/NpcAgent'
import type { QuestDialoguePreviewEntry } from '../quests/QuestManager'
import { nearestArchetype } from '../ai/dialogue'
import {
  aboutSelfLine,
  aboutVillageLine,
  currentActivityLine,
  goodbyeLine,
  playerAssistanceRequestLine,
  playerGuardRewardRequestLine,
  playerJoinInvitationLine,
  playerJoinProposalAnswerLine,
  playerPayWageLine,
  playerQuestOfferAnswerLine,
} from '../ai/dialogueTemplates'
import { isAdultAge } from '../settlement/professionStaffing'
import DialogueWindow, { type DialogueChoice, type DialogueMessage } from './components/DialogueWindow.vue'
import { useOverlayScreen } from './composables/useOverlayScreen'
import {
  acceptNpcDialogueOffer,
  applyNpcDialogueQuestOverride,
  closeNpcDialogueMenu,
  emitUiClick,
  getNpcDialogueQuestPreview,
  isNpcDialogueMenuOpen,
  resolveNpcDialogueHelp,
  resolveNpcDialogueOpenTopic,
  selectNpcDialogueHelpAction,
  selectNpcDialogueHelpTopic,
  ui,
} from './store'

const BACKDROP_CLOSE_GUARD_MS = 300

type Topic =
  | 'aboutSelf'
  | 'aboutVillage'
  | 'currentActivity'
  | 'goodbye'
  | 'help'
  | 'guardReward'
  | 'requestFood'
  | 'requestWater'
  | 'aboutArea'
  | 'payment'
  | 'proposeJoin'
  | 'proposeJoinResult'
  | 'joinProposal'
  | 'activeMatters'

/** One presentation-level category above existing topics (plan ui-input-024). */
type DialogueGroup = 'help' | 'conversation' | 'actions'

/** Duration presets offered when the player proposes a voluntary expedition
 *  (plan npc-031) — presentation-only, mirrors the shape of the paid
 *  escort's own duration presets without importing anything from the Work
 *  Contract UI (voluntary joining has no economics to share with it). */
const JOIN_DURATION_OPTIONS = [
  { days: 0.5, label: 'pół dnia' },
  { days: 1, label: '1 dzień' },
  { days: 2, label: '2 dni' },
  { days: 3, label: '3 dni' },
] as const
const state = ui.npcDialogueMenu
const topic = ref<Topic | null>(null)
const group = ref<DialogueGroup | null>(null)
/** Group to restore when leaving a topic opened from a category (plan ui-input-024). */
const topicOriginGroup = ref<DialogueGroup | null>(null)
const openedAt = ref(0)
/** Bumped so live quest preview re-reads after in-menu quest mutations. */
const previewEpoch = ref(0)

useOverlayScreen('npc-dialogue', isNpcDialogueMenuOpen, closeNpcDialogueMenu)

const archetype = computed(() => (state.npc ? nearestArchetype(state.npc.personality) : 'calm'))
const hasOffer = computed(() => state.helpResult?.offer != null)
const helpActions = computed(() => state.helpResult?.actions ?? [])
/** Other quest contexts this NPC has right now (plan quests-progression-020)
 *  — a pure navigation layer over `QuestDialogOverride.topics`. */
const helpTopics = computed(() => state.helpResult?.topics ?? [])
/** Whether the "help" topic is currently showing one selected quest's
 *  override rather than the top-level (possibly multi-topic) payload — drives
 *  what "Wróć" does inside "help" (plan quests-progression-020). */
const helpDrilled = ref(false)
/** When true, leaving a drilled help payload returns to Aktywne zadania. */
const activeMattersOrigin = ref(false)
const isHomeGuard = computed(() => state.npc?.role === 'guard' && state.settlement?.isHome === true)
/** "Opowiedz mi coś o okolicy" eligibility (plan world-012 §7, extended to
 *  living local hunters by npc-050 §9) — same canonical `role` other quest
 *  modules already key off, no separate "knows area" flag. */
const canAskAboutArea = computed(() => {
  const npc = state.npc
  if (!npc || npc.health.dead) return false
  if (isHomeGuard.value) return true
  return npc.role === 'hunter' && isAdultAge(npc.age)
})
const guardRewardLine = ref('')
const foodLine = ref('')
const waterLine = ref('')
const areaLine = ref('')
const paymentLine = ref('')
const joinProposeLine = ref('')
const joinProposalLine = ref('')
const discoveringArea = ref(false)

const questPreview = computed(() => {
  void previewEpoch.value
  return getNpcDialogueQuestPreview()
})
const reportShortcuts = computed(() => questPreview.value.filter((entry) => entry.kind === 'report'))
const requiredActionShortcuts = computed(() => (
  questPreview.value.filter((entry) => entry.kind === 'required-action')
))
const activeMatters = computed(() => questPreview.value.filter((entry) => (
  entry.kind === 'active' || entry.kind === 'required-action' || entry.kind === 'report'
)))

const showAboutVillage = computed(() => state.settlement != null)

/** Conversation log shown in the dialogue window; ephemeral, reset on every session.
 *  Written only by explicit commits (open / choice / reply), never by a watcher
 *  of changing response strings (plan ui-input-047 §D). */
const messages = ref<DialogueMessage[]>([])
let nextMessageId = 1

function pushMessage(speaker: DialogueMessage['speaker'], text: string): void {
  if (!text) return
  messages.value = [...messages.value, { id: nextMessageId++, speaker, text }]
}

function pushNpc(text: string): void {
  pushMessage('npc', text)
}

/** Stable seed for a newly authored line: NPC identity + session + turn ordinal. */
function lineSeed(): string {
  return `${state.npc?.id ?? ''}|${state.sessionRevision}|${messages.value.length}`
}

/** Session/turn ticket for async replies — stale completions must not write. */
let turn = 0
let pendingTicket: { session: number, turn: number } | null = null
/** Bumped (sync) on every view change; one-shot choices are consumed per view. */
let viewGen = 0
let consumedKey = ''

function ticketIsCurrent(ticket: { session: number, turn: number }): boolean {
  return state.open && state.sessionRevision === ticket.session && turn === ticket.turn
}

function bumpPreview(): void {
  previewEpoch.value += 1
}

function resetMenu(): void {
  topic.value = null
  group.value = null
  topicOriginGroup.value = null
  guardRewardLine.value = ''
  foodLine.value = ''
  waterLine.value = ''
  areaLine.value = ''
  paymentLine.value = ''
  joinProposeLine.value = ''
  joinProposalLine.value = ''
  helpDrilled.value = false
  activeMattersOrigin.value = false
  discoveringArea.value = false
  pendingTicket = null
}

function enterGroup(next: DialogueGroup): void {
  emitUiClick()
  group.value = next
  topic.value = null
  topicOriginGroup.value = null
  helpDrilled.value = false
  activeMattersOrigin.value = false
}

function leaveGroup(): void {
  emitUiClick()
  group.value = null
  topic.value = null
  topicOriginGroup.value = null
}

function backToTopics(): void {
  emitUiClick()
  bumpPreview()
  topic.value = null
  helpDrilled.value = false
  activeMattersOrigin.value = false
  if (topicOriginGroup.value) {
    group.value = topicOriginGroup.value
    topicOriginGroup.value = null
    return
  }
  group.value = null
}

function selectTopic(next: Topic): void {
  emitUiClick()
  const npc = state.npc as NpcAgent | null
  if (next === 'help') {
    helpDrilled.value = false
    activeMattersOrigin.value = false
    topicOriginGroup.value = group.value
    resolveNpcDialogueHelp()
    bumpPreview()
    pushNpc(state.helpResult?.line ?? '')
  } else if (next === 'activeMatters') {
    topicOriginGroup.value = group.value
    helpDrilled.value = false
    activeMattersOrigin.value = false
    bumpPreview()
    pushNpc('Którą sprawę chcesz omówić?')
  } else {
    topicOriginGroup.value = group.value
    if (npc) pushNpc(topicLine(next, npc))
  }
  topic.value = next
}

/** Snapshot of the NPC's reply, resolved once when the topic is entered. */
function topicLine(next: Topic, npc: NpcAgent): string {
  switch (next) {
    case 'aboutSelf': return aboutSelfLine(npc.displayName, npc.role, npc.familyMembers, archetype.value)
    case 'aboutVillage': return state.settlement ? aboutVillageLine(state.settlement.name, state.settlement.size, state.settlement.terrain, state.settlement.foodSourceType, state.settlement.dominantResource, archetype.value) : ''
    case 'currentActivity': return currentActivityLine(npc.getCurrentActivity(state.timeOfDay), archetype.value)
    case 'goodbye': return goodbyeLine(archetype.value)
    default: return ''
  }
}

function selectHelpAction(index: number): void {
  emitUiClick()
  selectNpcDialogueHelpAction(index)
  bumpPreview()
  pushNpc(state.helpResult?.line ?? '')
}

/** Drills into one quest/topic entry from the multi-quest picker (plan
 *  quests-progression-020) — replaces the shown "help" payload with that
 *  quest's own live override. */
function selectHelpTopic(index: number): void {
  emitUiClick()
  helpDrilled.value = true
  activeMattersOrigin.value = false
  selectNpcDialogueHelpTopic(index)
  bumpPreview()
  pushNpc(state.helpResult?.line ?? '')
}

function selectActiveMatter(entry: QuestDialoguePreviewEntry): void {
  emitUiClick()
  applyNpcDialogueQuestOverride(entry.resolve())
  topic.value = 'help'
  helpDrilled.value = true
  activeMattersOrigin.value = true
  bumpPreview()
  pushNpc(state.helpResult?.line ?? '')
}

function openQuestShortcut(entry: QuestDialoguePreviewEntry): void {
  emitUiClick()
  group.value = null
  topicOriginGroup.value = null
  helpDrilled.value = false
  activeMattersOrigin.value = false
  applyNpcDialogueQuestOverride(entry.resolve())
  topic.value = 'help'
  bumpPreview()
  pushNpc(state.helpResult?.line ?? '')
}

/** "Wróć" inside the "help" topic: from a drilled-in quest, return to the
 *  (possibly still multi-quest) top-level payload by re-resolving it live;
 *  otherwise behave like the generic "Wróć" and leave "help" entirely. */
function helpBack(): void {
  emitUiClick()
  bumpPreview()
  if (helpDrilled.value) {
    helpDrilled.value = false
    if (activeMattersOrigin.value) {
      activeMattersOrigin.value = false
      topic.value = 'activeMatters'
      return
    }
    resolveNpcDialogueHelp()
    return
  }
  topic.value = null
  activeMattersOrigin.value = false
  if (topicOriginGroup.value) {
    group.value = topicOriginGroup.value
    topicOriginGroup.value = null
    return
  }
  group.value = null
}

function claimGuardReward(): void {
  emitUiClick()
  topicOriginGroup.value = group.value
  guardRewardLine.value = state.onClaimGuardReward?.() ?? ''
  pushNpc(guardRewardLine.value)
  topic.value = 'guardReward'
  state.canClaimGuardReward = state.getCanClaimGuardReward?.() ?? false
}

function requestFood(): void {
  emitUiClick()
  topicOriginGroup.value = group.value
  const npc = state.npc as NpcAgent | null
  if (npc) foodLine.value = state.onRequestFood?.(npc) ?? ''
  pushNpc(foodLine.value)
  topic.value = 'requestFood'
}

function requestWater(): void {
  emitUiClick()
  topicOriginGroup.value = group.value
  const npc = state.npc as NpcAgent | null
  if (npc) waterLine.value = state.onRequestWater?.(npc) ?? ''
  pushNpc(waterLine.value)
  topic.value = 'requestWater'
}

async function askAboutArea(): Promise<void> {
  const npc = state.npc as NpcAgent | null
  if (discoveringArea.value || !npc) return
  emitUiClick()
  topicOriginGroup.value = group.value
  const ticket = { session: state.sessionRevision, turn }
  pendingTicket = ticket
  discoveringArea.value = true
  try {
    const line = await state.onAskAboutArea?.(npc) ?? ''
    if (!ticketIsCurrent(ticket)) return
    areaLine.value = line
    pushNpc(line)
    topic.value = 'aboutArea'
  } catch {
    // No invented NPC reply; allow a deliberate retry.
    if (ticketIsCurrent(ticket)) consumedKey = ''
  } finally {
    if (pendingTicket === ticket) {
      pendingTicket = null
      discoveringArea.value = false
    }
  }
}

function payWage(): void {
  emitUiClick()
  paymentLine.value = state.onPayWage?.() ?? ''
  pushNpc(paymentLine.value)
  topic.value = 'payment'
}

function deferWage(): void {
  emitUiClick()
  resetMenu()
}

function openProposeJoin(): void {
  emitUiClick()
  topicOriginGroup.value = group.value
  topic.value = 'proposeJoin'
}

function proposeJoin(days: number): void {
  emitUiClick()
  joinProposeLine.value = state.onProposeJoin?.(days) ?? ''
  pushNpc(joinProposeLine.value)
  topic.value = 'proposeJoinResult'
}

function acceptJoinProposal(): void {
  emitUiClick()
  joinProposalLine.value = state.onRespondToJoinProposal?.(true) ?? ''
  pushNpc(joinProposalLine.value)
}

function declineJoinProposal(): void {
  emitUiClick()
  joinProposalLine.value = state.onRespondToJoinProposal?.(false) ?? ''
  pushNpc(joinProposalLine.value)
}

function openTrade(): void {
  emitUiClick()
  state.onOpenTrade?.()
}

function openArtisanOrders(): void {
  emitUiClick()
  state.onOpenArtisanOrders?.()
}

function giveItem(): void {
  emitUiClick()
  state.onGiveItem?.()
}

function accept(): void {
  emitUiClick(); acceptNpcDialogueOffer()
  topic.value = null
}

function close(): void {
  emitUiClick(); closeNpcDialogueMenu()
  topic.value = null
}

function closeFromBackdrop(): void {
  if (performance.now() - openedAt.value < BACKDROP_CLOSE_GUARD_MS) return
  close()
}

function shortcutLabel(entry: QuestDialoguePreviewEntry): string {
  const prefix = entry.kind === 'report' ? '✓' : '?'
  return `${prefix} ${entry.title}`
}

/** Control kind of a choice (plan ui-input-047 §B). Whether it also commits a
 *  Player utterance is the separate `speech` dimension, so a parameter commit
 *  (duration) can speak a full line without echoing its label. */
type ChoiceKind = 'navigation' | 'parameter' | 'speech' | 'action'

/** One selectable dialogue option. `label` is control text; only `speech`
 *  (resolved once, at click time) is ever written to the history. */
interface MenuChoice extends DialogueChoice {
  kind: ChoiceKind
  run: () => void
  speech?: string | (() => string)
}

function opt(id: string, label: string, kind: ChoiceKind, run: () => void, extra: Partial<MenuChoice> = {}): MenuChoice {
  return { id, label, kind, run, ...extra }
}

function backChoice(run: () => void): MenuChoice {
  return opt('back', 'Wróć', 'navigation', run, { variant: 'muted' })
}

function rootChoices(): MenuChoice[] {
  const list: MenuChoice[] = []
  if (state.canTrade) list.push(opt('trade', 'Handel', 'action', openTrade, { variant: 'primary' }))
  if (state.canOrderArtisan) list.push(opt('artisan', 'Zamówienie', 'action', openArtisanOrders, { variant: 'primary' }))
  for (const entry of reportShortcuts.value) {
    list.push(opt(`report:${entry.questId}`, shortcutLabel(entry), 'navigation', () => openQuestShortcut(entry), { variant: 'primary' }))
  }
  for (const entry of requiredActionShortcuts.value) {
    list.push(opt(`required:${entry.questId}`, shortcutLabel(entry), 'navigation', () => openQuestShortcut(entry), { variant: 'primary' }))
  }
  list.push(
    opt('group:help', 'Sprawy i pomoc', 'navigation', () => enterGroup('help')),
    opt('group:conversation', 'Rozmowa', 'navigation', () => enterGroup('conversation')),
    opt('group:actions', 'Działania', 'navigation', () => enterGroup('actions')),
    opt('goodbye', 'Nic, miłego dnia!', 'speech', () => selectTopic('goodbye'), { variant: 'muted', speech: 'Nic, miłego dnia!' }),
  )
  return list
}

function groupChoices(g: DialogueGroup): MenuChoice[] {
  const list: MenuChoice[] = []
  if (g === 'help') {
    if (activeMatters.value.length > 0) list.push(opt('activeMatters', 'Aktywne zadania', 'navigation', () => selectTopic('activeMatters')))
    list.push(
      opt('help', 'Może w czymś ci pomóc?', 'speech', () => selectTopic('help'), { speech: 'Może w czymś ci pomóc?' }),
      opt('food', 'Poproś o jedzenie', 'speech', requestFood, { speech: () => playerAssistanceRequestLine('food', lineSeed()) }),
      opt('water', 'Poproś o wodę', 'speech', requestWater, { speech: () => playerAssistanceRequestLine('water', lineSeed()) }),
    )
    if (isHomeGuard.value && state.canClaimGuardReward) {
      list.push(opt('guardReward', 'Poproś o uznanie', 'speech', claimGuardReward, { speech: playerGuardRewardRequestLine }))
    }
  } else if (g === 'conversation') {
    if (canAskAboutArea.value) {
      list.push(opt('area', 'Opowiedz mi coś o okolicy.', 'speech', askAboutArea, { speech: 'Opowiedz mi coś o okolicy.', disabled: discoveringArea.value }))
    }
    list.push(
      opt('aboutSelf', 'Powiedz coś o sobie.', 'speech', () => selectTopic('aboutSelf'), { speech: 'Powiedz coś o sobie.' }),
      opt('currentActivity', 'Co teraz robisz?', 'speech', () => selectTopic('currentActivity'), { speech: 'Co teraz robisz?' }),
    )
    if (showAboutVillage.value) {
      list.push(opt('aboutVillage', 'Powiedz coś o wiosce.', 'speech', () => selectTopic('aboutVillage'), { speech: 'Powiedz coś o wiosce.' }))
    }
  } else {
    list.push(
      opt('giveItem', 'Daj przedmiot', 'action', giveItem),
      opt('proposeJoin', 'Zaproponuj udział w wyprawie', 'navigation', openProposeJoin),
    )
  }
  list.push(backChoice(leaveGroup))
  return list
}

function topicChoices(): MenuChoice[] {
  const t = topic.value
  if (t === 'proposeJoin') {
    return [
      ...JOIN_DURATION_OPTIONS.map((o) => opt(`days:${o.days}`, o.label, 'parameter', () => proposeJoin(o.days), {
        speech: () => playerJoinInvitationLine(o.days, lineSeed()),
      })),
      backChoice(backToTopics),
    ]
  }
  if (t === 'activeMatters') {
    return [
      ...activeMatters.value.map((entry) => opt(`matter:${entry.questId}`, entry.title, 'navigation', () => selectActiveMatter(entry))),
      backChoice(backToTopics),
    ]
  }
  if (t === 'payment' && !paymentLine.value && state.paymentClaim) {
    const coins = state.paymentClaim.coins
    return [
      opt('pay', `Zapłać ${coins}`, 'action', payWage, { variant: 'primary', speech: () => playerPayWageLine(coins) }),
      opt('defer', 'Jeszcze nie', 'navigation', deferWage, { variant: 'muted' }),
    ]
  }
  if (t === 'joinProposal' && !joinProposalLine.value && state.joinProposal) {
    return [
      opt('joinAccept', 'Weź go ze sobą', 'action', acceptJoinProposal, { variant: 'primary', speech: () => playerJoinProposalAnswerLine(true) }),
      opt('joinDecline', 'Nie tym razem', 'action', declineJoinProposal, { variant: 'muted', speech: () => playerJoinProposalAnswerLine(false) }),
    ]
  }
  if (t === 'help' && hasOffer.value) {
    // Spoken refusal only when the quest actually has a decline callback;
    // otherwise a silent exit/back (presentation only — no new offer policy).
    const canDecline = state.helpResult?.offer?.onDecline != null
    const list = [
      opt('accept', 'Przyjmij', 'action', accept, { variant: 'primary', speech: () => playerQuestOfferAnswerLine(true) }),
    ]
    if (canDecline) {
      list.push(opt('decline', 'Odmów', 'action', close, { variant: 'muted', speech: () => playerQuestOfferAnswerLine(false) }))
    } else {
      list.push(backChoice(helpBack))
      return list
    }
    if (helpDrilled.value) list.push(backChoice(helpBack))
    return list
  }
  if (t === 'help') {
    return [
      ...helpActions.value.map((action, index) => opt(`action:${index}`, action.label, 'speech', () => selectHelpAction(index), { variant: 'primary', speech: action.label })),
      ...helpTopics.value.map((entry, index) => opt(`helpTopic:${index}`, entry.label, 'navigation', () => selectHelpTopic(index))),
      backChoice(helpBack),
    ]
  }
  if (t === 'goodbye') return [opt('close', 'Zamknij', 'navigation', close, { variant: 'muted' })]
  return [backChoice(backToTopics)]
}

const choices = computed<MenuChoice[]>(() => {
  if (topic.value !== null) return topicChoices()
  return group.value === null ? rootChoices() : groupChoices(group.value)
})

function onChoose(id: string): void {
  // Covered dialogue (gift/order overlay on top), closed or replaced session.
  if (!state.open || ui.openStack.at(-1) !== 'npc-dialogue') return
  if (sessionRev !== state.sessionRevision) return
  const choice = choices.value.find((c) => c.id === id)
  if (!choice || choice.disabled) return
  // One-shot per view: a double click / held key cannot apply an action twice.
  const key = `${viewGen}:${id}`
  if (consumedKey === key) return
  consumedKey = key
  const said = typeof choice.speech === 'function' ? choice.speech() : choice.speech
  if (said) pushMessage('player', said)
  choice.run()
}

/** Session revision this menu instance last initialised for. */
let sessionRev = -1

// Any view change invalidates pending async presentation work and re-arms choices.
watch(
  [group, topic, helpDrilled, () => state.helpResult, paymentLine, joinProposalLine],
  () => {
    viewGen += 1
    turn += 1
    pendingTicket = null
    discoveringArea.value = false
  },
  { flush: 'sync' },
)

watch(() => state.sessionRevision, (revision) => {
  sessionRev = revision
  turn += 1
  consumedKey = ''
  messages.value = []
  resetMenu()
  if (!state.open) return

  openedAt.value = performance.now()
  bumpPreview()
  pushNpc(state.greetingText)
  const initialTopic = resolveNpcDialogueOpenTopic()
  if (initialTopic) {
    topicOriginGroup.value = null
    group.value = null
    topic.value = initialTopic
    if (initialTopic === 'payment') {
      pushNpc(state.paymentClaim ? `Za wykonaną pracę należy mi się ${state.paymentClaim.coins} monet.` : '')
    } else {
      pushNpc('Chciałbym dołączyć do twojej wyprawy. Zabierzesz mnie?')
    }
  }
}, { immediate: true })
</script>

<template>
  <div
    v-if="state.open"
    class="pointer-events-auto fixed inset-0 z-20 flex items-center justify-center bg-panel-backdrop p-4 backdrop-blur-[2px]"
    @click.self="closeFromBackdrop"
  >
    <DialogueWindow
      :npc-name="state.npcHeading"
      :portrait-src="state.portraitSrc ?? undefined"
      :messages="messages"
      :choices="choices"
      :esc-closes="false"
      @choose="onChoose"
      @close="close"
    />
  </div>
</template>
