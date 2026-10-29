<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { NpcAgent } from '../ai/NpcAgent'
import type { QuestDialoguePreviewEntry } from '../quests/QuestManager'
import { nearestArchetype } from '../ai/dialogue'
import { aboutSelfLine, aboutVillageLine, currentActivityLine, goodbyeLine } from '../ai/dialogueTemplates'
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

const responseText = computed(() => {
  if (!state.npc || topic.value === null) return ''
  switch (topic.value) {
    case 'aboutArea': return areaLine.value
    case 'aboutSelf': return aboutSelfLine(state.npc.displayName, state.npc.role, state.npc.familyMembers, archetype.value)
    case 'aboutVillage': return state.settlement ? aboutVillageLine(state.settlement.name, state.settlement.size, state.settlement.terrain, state.settlement.foodSourceType, state.settlement.dominantResource, archetype.value) : ''
    case 'activeMatters': return 'Którą sprawę chcesz omówić?'
    case 'currentActivity': return currentActivityLine(state.npc.getCurrentActivity(state.timeOfDay), archetype.value)
    case 'goodbye': return goodbyeLine(archetype.value)
    case 'guardReward': return guardRewardLine.value
    case 'help': return state.helpResult?.line ?? ''
    case 'joinProposal': return joinProposalLine.value || 'Chciałbym dołączyć do twojej wyprawy. Zabierzesz mnie?'
    case 'payment': return paymentLine.value || (
      state.paymentClaim
        ? `Za wykonaną pracę należy mi się ${state.paymentClaim.coins} monet.`
        : ''
    )
    case 'proposeJoinResult': return joinProposeLine.value
    case 'requestFood': return foodLine.value
    case 'requestWater': return waterLine.value
    default: return ''
  }
})

/** Conversation log shown in the dialogue window; reset on every open. */
const messages = ref<DialogueMessage[]>([])
let nextMessageId = 1

function pushMessage(speaker: DialogueMessage['speaker'], text: string): void {
  messages.value = [...messages.value, { id: nextMessageId++, speaker, text }]
}

watch(responseText, (text) => {
  if (text) pushMessage('npc', text)
})

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
  if (next === 'help') {
    helpDrilled.value = false
    activeMattersOrigin.value = false
    topicOriginGroup.value = group.value
    resolveNpcDialogueHelp()
    bumpPreview()
  } else if (next === 'activeMatters') {
    topicOriginGroup.value = group.value
    helpDrilled.value = false
    activeMattersOrigin.value = false
    bumpPreview()
  } else {
    topicOriginGroup.value = group.value
  }
  topic.value = next
}

function selectHelpAction(index: number): void {
  emitUiClick()
  selectNpcDialogueHelpAction(index)
  bumpPreview()
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
}

function selectActiveMatter(entry: QuestDialoguePreviewEntry): void {
  emitUiClick()
  applyNpcDialogueQuestOverride(entry.resolve())
  topic.value = 'help'
  helpDrilled.value = true
  activeMattersOrigin.value = true
  bumpPreview()
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
  topic.value = 'guardReward'
  state.canClaimGuardReward = state.getCanClaimGuardReward?.() ?? false
}

function requestFood(): void {
  emitUiClick()
  topicOriginGroup.value = group.value
  const npc = state.npc as NpcAgent | null
  if (npc) foodLine.value = state.onRequestFood?.(npc) ?? ''
  topic.value = 'requestFood'
}

function requestWater(): void {
  emitUiClick()
  topicOriginGroup.value = group.value
  const npc = state.npc as NpcAgent | null
  if (npc) waterLine.value = state.onRequestWater?.(npc) ?? ''
  topic.value = 'requestWater'
}

async function askAboutArea(): Promise<void> {
  const npc = state.npc as NpcAgent | null
  if (discoveringArea.value || !npc) return
  emitUiClick()
  topicOriginGroup.value = group.value
  discoveringArea.value = true
  try {
    areaLine.value = await state.onAskAboutArea?.(npc) ?? ''
    topic.value = 'aboutArea'
  } finally {
    discoveringArea.value = false
  }
}

function payWage(): void {
  emitUiClick()
  paymentLine.value = state.onPayWage?.() ?? ''
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
  topic.value = 'proposeJoinResult'
}

function acceptJoinProposal(): void {
  emitUiClick()
  joinProposalLine.value = state.onRespondToJoinProposal?.(true) ?? ''
}

function declineJoinProposal(): void {
  emitUiClick()
  joinProposalLine.value = state.onRespondToJoinProposal?.(false) ?? ''
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

/** One selectable dialogue option; `say` echoes the label into the log as the player's line. */
interface MenuChoice extends DialogueChoice {
  run: () => void
  say?: boolean
}

function opt(id: string, label: string, run: () => void, extra: Partial<MenuChoice> = {}): MenuChoice {
  return { id, label, run, ...extra }
}

function backChoice(run: () => void): MenuChoice {
  return opt('back', 'Wróć', run, { variant: 'muted' })
}

function rootChoices(): MenuChoice[] {
  const list: MenuChoice[] = []
  if (state.canTrade) list.push(opt('trade', 'Handel', openTrade, { variant: 'primary' }))
  if (state.canOrderArtisan) list.push(opt('artisan', 'Zamówienie', openArtisanOrders, { variant: 'primary' }))
  for (const entry of reportShortcuts.value) {
    list.push(opt(`report:${entry.questId}`, shortcutLabel(entry), () => openQuestShortcut(entry), { variant: 'primary' }))
  }
  for (const entry of requiredActionShortcuts.value) {
    list.push(opt(`required:${entry.questId}`, shortcutLabel(entry), () => openQuestShortcut(entry), { variant: 'primary' }))
  }
  list.push(
    opt('group:help', 'Sprawy i pomoc', () => enterGroup('help')),
    opt('group:conversation', 'Rozmowa', () => enterGroup('conversation')),
    opt('group:actions', 'Działania', () => enterGroup('actions')),
    opt('goodbye', 'Nic, miłego dnia!', () => selectTopic('goodbye'), { variant: 'muted', say: true }),
  )
  return list
}

function groupChoices(g: DialogueGroup): MenuChoice[] {
  const list: MenuChoice[] = []
  if (g === 'help') {
    if (activeMatters.value.length > 0) list.push(opt('activeMatters', 'Aktywne zadania', () => selectTopic('activeMatters'), { say: true }))
    list.push(
      opt('help', 'Może w czymś ci pomóc?', () => selectTopic('help'), { say: true }),
      opt('food', 'Poproś o jedzenie', requestFood, { say: true }),
      opt('water', 'Poproś o wodę', requestWater, { say: true }),
    )
    if (isHomeGuard.value && state.canClaimGuardReward) list.push(opt('guardReward', 'Poproś o uznanie', claimGuardReward, { say: true }))
  } else if (g === 'conversation') {
    if (canAskAboutArea.value) list.push(opt('area', 'Opowiedz mi coś o okolicy.', askAboutArea, { say: true, disabled: discoveringArea.value }))
    list.push(
      opt('aboutSelf', 'Powiedz coś o sobie.', () => selectTopic('aboutSelf'), { say: true }),
      opt('currentActivity', 'Co teraz robisz?', () => selectTopic('currentActivity'), { say: true }),
    )
    if (showAboutVillage.value) list.push(opt('aboutVillage', 'Powiedz coś o wiosce.', () => selectTopic('aboutVillage'), { say: true }))
  } else {
    list.push(
      opt('giveItem', 'Daj przedmiot', giveItem),
      opt('proposeJoin', 'Zaproponuj udział w wyprawie', openProposeJoin, { say: true }),
    )
  }
  list.push(backChoice(leaveGroup))
  return list
}

function topicChoices(): MenuChoice[] {
  const t = topic.value
  if (t === 'proposeJoin') {
    return [
      ...JOIN_DURATION_OPTIONS.map((o) => opt(`days:${o.days}`, o.label, () => proposeJoin(o.days), { say: true })),
      backChoice(backToTopics),
    ]
  }
  if (t === 'activeMatters') {
    return [
      ...activeMatters.value.map((entry) => opt(`matter:${entry.questId}`, entry.title, () => selectActiveMatter(entry), { say: true })),
      backChoice(backToTopics),
    ]
  }
  if (t === 'payment' && !paymentLine.value && state.paymentClaim) {
    return [
      opt('pay', `Zapłać ${state.paymentClaim.coins}`, payWage, { variant: 'primary', say: true }),
      opt('defer', 'Jeszcze nie', deferWage, { variant: 'muted' }),
    ]
  }
  if (t === 'joinProposal' && !joinProposalLine.value && state.joinProposal) {
    return [
      opt('joinAccept', 'Weź go ze sobą', acceptJoinProposal, { variant: 'primary', say: true }),
      opt('joinDecline', 'Nie tym razem', declineJoinProposal, { variant: 'muted', say: true }),
    ]
  }
  if (t === 'help' && hasOffer.value) {
    const list = [
      opt('accept', 'Przyjmij', accept, { variant: 'primary', say: true }),
      opt('decline', 'Odmów', close, { variant: 'muted', say: true }),
    ]
    if (helpDrilled.value) list.push(backChoice(helpBack))
    return list
  }
  if (t === 'help') {
    return [
      ...helpActions.value.map((action, index) => opt(`action:${index}`, action.label, () => selectHelpAction(index), { variant: 'primary', say: true })),
      ...helpTopics.value.map((entry, index) => opt(`helpTopic:${index}`, entry.label, () => selectHelpTopic(index), { say: true })),
      backChoice(helpBack),
    ]
  }
  if (t === 'goodbye') return [opt('close', 'Zamknij', close, { variant: 'muted' })]
  return [backChoice(backToTopics)]
}

const choices = computed<MenuChoice[]>(() => {
  if (topic.value !== null) return topicChoices()
  return group.value === null ? rootChoices() : groupChoices(group.value)
})

function onChoose(id: string): void {
  const choice = choices.value.find((c) => c.id === id)
  if (!choice || choice.disabled) return
  if (choice.say) pushMessage('player', choice.label)
  choice.run()
}

watch(() => state.open, (open) => {
  if (!open) return

  openedAt.value = performance.now()
  messages.value = []
  resetMenu()
  bumpPreview()
  const initialTopic = resolveNpcDialogueOpenTopic()
  if (initialTopic) {
    topicOriginGroup.value = null
    group.value = null
    topic.value = initialTopic
  }
})
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
