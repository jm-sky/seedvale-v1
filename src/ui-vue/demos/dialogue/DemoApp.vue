<script setup lang="ts">
/**
 * NPC dialogue window demo — two variants (with / without portrait).
 * Fixture menu tree and history are demo-local only (no world / quest wiring).
 * @domain ui
 */
import { computed, ref } from 'vue'
import DialogueWindow, { type DialogueChoice, type DialogueMessage } from '../../components/DialogueWindow.vue'
import DemoShell from '../DemoShell.vue'

type MenuId = 'root' | 'talk' | 'quest'

interface MenuEntry extends DialogueChoice {
  /** Submenu to open. */
  goto?: MenuId
  /** Player line + NPC reply appended to history. */
  say?: string
  reply?: string
}

const PORTRAIT = '/images/npc/casimir-eastwood-day-positive.webp'

const MENUS: Record<MenuId, MenuEntry[]> = {
  root: [
    { id: 'talk', label: 'Porozmawiaj', goto: 'talk' },
    { id: 'trade', label: 'Handel', say: 'Pokaż mi swoje towary.', reply: '(demo) Tu otworzyłby się ekran handlu.' },
    { id: 'quest', label: 'Zadania / Pomoc', goto: 'quest' },
    { id: 'actions', label: 'Akcje', say: 'Mam coś dla Ciebie.', reply: '(demo) Tu otworzyłby się ekran wręczania przedmiotów.' },
    { id: 'bye', label: 'Do widzenia', variant: 'muted' },
  ],
  talk: [
    { id: 'who', label: 'Kim jesteś?', say: 'Kim jesteś?', reply: 'Casimir Eastwood, do usług. Od lat mieszkam w tej dolinie.' },
    { id: 'valley', label: 'Co słychać w dolinie?', say: 'Co słychać w dolinie?', reply: 'Spokojnie, choć wilki podchodzą coraz bliżej wsi. Zbliża się zima.' },
    { id: 'rumors', label: 'Słyszałeś jakieś plotki?', say: 'Słyszałeś jakieś plotki?', reply: 'Mówią, że w starej jaskini ktoś rozpalił ogień. Nie wiem, czy chcę wiedzieć kto.' },
    { id: 'back', label: 'Wróć', variant: 'muted' },
  ],
  quest: [
    { id: 'help', label: 'Czy mogę w czymś pomóc?', say: 'Czy mogę w czymś pomóc?', reply: 'Może. Zaginęła mi siekiera — ostatnio widziałem ją przy lesie. Przyniesiesz?' },
    { id: 'accept', label: 'Dobrze, poszukam jej.', say: 'Dobrze, poszukam jej.', reply: 'Dzięki! Wróć, jak ją znajdziesz.' },
    { id: 'back', label: 'Wróć', variant: 'muted' },
  ],
}

const GREETING = 'Witaj, wędrowcze. W czym mogę pomóc?'

const withPortrait = ref(true)
const open = ref(true)
const menu = ref<MenuId>('root')
const history = ref<DialogueMessage[]>([])
let nextId = 1

function reset(): void {
  history.value = [{ id: nextId++, speaker: 'npc', text: GREETING }]
  menu.value = 'root'
  open.value = true
}
reset()

const choices = computed(() => MENUS[menu.value])

function push(speaker: DialogueMessage['speaker'], text: string): void {
  history.value = [...history.value, { id: nextId++, speaker, text }]
}

function onChoose(id: string): void {
  const entry = MENUS[menu.value].find((c) => c.id === id)
  if (!entry) return
  if (id === 'bye') {
    open.value = false
    return
  }
  if (id === 'back') {
    menu.value = 'root'
    return
  }
  if (entry.goto) {
    menu.value = entry.goto
    return
  }
  if (entry.say) push('player', entry.say)
  if (entry.reply) push('npc', entry.reply)
}
</script>

<template>
  <DemoShell
    current="dialogue"
    title="Dialogue (demo)"
  >
    <template #tools>
      <button
        v-for="v in [true, false]"
        :key="String(v)"
        type="button"
        class="rounded-md border px-2.5 py-1 text-xs"
        :class="withPortrait === v ? 'border-amber-400/60 bg-amber-900/30' : 'border-neutral-600 hover:bg-neutral-800'"
        @click="withPortrait = v"
      >
        {{ v ? 'Z obrazkiem' : 'Bez obrazka' }}
      </button>
      <button
        type="button"
        class="rounded-md border border-neutral-600 px-2.5 py-1 text-xs hover:bg-neutral-800"
        @click="reset"
      >
        Reset
      </button>
    </template>
    <div class="flex min-h-[44rem] items-center justify-center">
      <DialogueWindow
        v-if="open"
        npc-name="Casimir Eastwood"
        npc-role="Wieśniak"
        :portrait-src="withPortrait ? PORTRAIT : undefined"
        :messages="history"
        :choices="choices"
        @choose="onChoose"
        @close="open = false"
      />
      <p
        v-else
        class="text-neutral-300"
      >
        Rozmowa zamknięta. Użyj „Reset”, aby otworzyć ponownie.
      </p>
    </div>
  </DemoShell>
</template>
