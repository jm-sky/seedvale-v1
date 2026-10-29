<script setup lang="ts">
/**
 * Demo-only NPC dialogue window: header, portrait + history, choices.
 * Pure presentation — state lives in the parent (no world / quest wiring).
 * @domain ui
 */
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

export type DialogueSpeaker = 'npc' | 'player'

export interface DialogueMessage {
  id: number
  speaker: DialogueSpeaker
  text: string
}

export interface DialogueChoice {
  id: string
  label: string
  /** Back / Goodbye style — rendered muted. */
  muted?: boolean
}

const props = defineProps<{
  npcName: string
  npcRole?: string
  portraitSrc?: string
  messages: DialogueMessage[]
  choices: DialogueChoice[]
}>()

const emit = defineEmits<{
  choose: [id: string]
  close: []
}>()

const historyEl = ref<HTMLElement | null>(null)

function scrollToEnd(): void {
  void nextTick(() => {
    const el = historyEl.value
    if (el) el.scrollTop = el.scrollHeight
  })
}

watch(() => props.messages.length, scrollToEnd)
onMounted(scrollToEnd)

function onKey(e: KeyboardEvent): void {
  if (e.key === 'Escape') {
    emit('close')
    return
  }
  if (e.key >= '1' && e.key <= '9') {
    const choice = props.choices[Number(e.key) - 1]
    if (choice) emit('choose', choice.id)
  }
}

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <section
    class="sv-dialogue flex h-[min(40rem,90dvh)] w-[min(44rem,100%)] flex-col overflow-hidden rounded-xl border border-white/15 bg-neutral-900/85 text-neutral-100 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-md"
    role="dialog"
    :aria-label="`Rozmowa: ${npcName}`"
  >
    <header class="flex shrink-0 items-center justify-between gap-3 border-b border-white/15 px-4 py-2.5">
      <div class="min-w-0">
        <h2 class="truncate text-base font-semibold tracking-wide text-primary">
          {{ npcName }}
        </h2>
        <p
          v-if="npcRole"
          class="truncate text-xs text-neutral-400"
        >
          {{ npcRole }}
        </p>
      </div>
      <button
        type="button"
        class="shrink-0 rounded-md border border-neutral-600 px-2 py-1 text-sm text-neutral-300 hover:border-amber-400/60 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        aria-label="Zamknij (Esc)"
        @click="emit('close')"
      >
        ✕
      </button>
    </header>

    <div class="flex min-h-0 grow-[3] basis-0 gap-3 p-3">
      <img
        v-if="portraitSrc"
        :src="portraitSrc"
        :alt="npcName"
        class="hidden h-full w-1/3 shrink-0 rounded-lg border border-white/15 bg-neutral-950/50 object-cover object-top sm:block"
      >
      <ul
        ref="historyEl"
        class="flex min-h-0 min-w-0 flex-1 flex-col gap-2 overflow-y-auto scroll-smooth pr-1"
        aria-live="polite"
      >
        <li
          v-for="m in messages"
          :key="m.id"
          class="rounded-lg border-l-2 px-3 py-2 text-sm leading-snug"
          :class="m.speaker === 'npc'
            ? 'border-amber-400/70 bg-amber-900/20 mr-6'
            : 'border-neutral-500 bg-neutral-800/60 ml-6 text-neutral-300'"
        >
          <span
            class="mb-0.5 block text-xs font-semibold"
            :class="m.speaker === 'npc' ? 'text-primary' : 'text-neutral-400'"
          >{{ m.speaker === 'npc' ? npcName : 'Ty' }}</span>
          {{ m.text }}
        </li>
      </ul>
    </div>

    <div class="flex min-h-0 grow-[2] basis-0 flex-col gap-1.5 overflow-y-auto border-t border-white/15 p-3">
      <button
        v-for="(c, i) in choices"
        :key="c.id"
        type="button"
        class="flex w-full items-center gap-3 rounded-md border px-3 py-2 text-left text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        :class="c.muted
          ? 'border-neutral-700 text-neutral-400 hover:border-neutral-500'
          : 'border-amber-400/30 bg-amber-400/10 hover:border-amber-400/70 hover:bg-amber-400/20'"
        @click="emit('choose', c.id)"
      >
        <kbd
          v-if="i < 9"
          class="shrink-0 rounded border border-neutral-600 px-1.5 text-xs text-primary"
        >{{ i + 1 }}</kbd>
        <span>{{ c.label }}</span>
      </button>
    </div>
  </section>
</template>
