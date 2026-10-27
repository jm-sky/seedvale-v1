<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import HudGazeChip from '../components/HudGazeChip.vue'
import { useOverlayScreen } from '../composables/useOverlayScreen'
import { useTouchScroll } from '../composables/useTouchScroll'
import { closeFlavorDialog, isFlavorDialogOpen, ui } from '../store'

useOverlayScreen('flavor-dialog', isFlavorDialogOpen, closeFlavorDialog)
const panel = ref<HTMLElement | null>(null)
useTouchScroll(panel)

function enabledButtons(): HTMLButtonElement[] {
  if (!panel.value) return []
  return [...panel.value.querySelectorAll<HTMLButtonElement>('button:not(:disabled)')]
}

function focusFirstEnabledButton(): void {
  void nextTick(() => {
    enabledButtons()[0]?.focus()
  })
}

watch(() => ui.flavorDialog.open, (open) => {
  if (open) focusFirstEnabledButton()
})

function runAction(run: () => void): void {
  closeFlavorDialog()
  run()
}

/** Minimal focus trap — Tab / Shift+Tab cycle only the enabled action buttons. */
function onPanelKeyDown(event: KeyboardEvent): void {
  if (event.key !== 'Tab') return
  const buttons = enabledButtons()
  if (buttons.length === 0) return
  const first = buttons[0]!
  const last = buttons[buttons.length - 1]!
  if (event.shiftKey) {
    if (document.activeElement === first || !panel.value?.contains(document.activeElement)) {
      event.preventDefault()
      last.focus()
    }
    return
  }
  if (document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}
</script>

<template>
  <div
    v-if="ui.flavorDialog.open"
    class="pointer-events-auto fixed inset-0 z-20 flex items-center justify-center bg-panel-backdrop backdrop-blur-[2px]"
    @click.self="closeFlavorDialog"
  >
    <div
      ref="panel"
      class="sv-hud max-h-[calc(100dvh-32px)] w-[min(420px,calc(100vw-32px))] overflow-y-auto rounded-[10px] border border-neutral-500/45 bg-neutral-900/92 p-5 text-neutral-50 shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
      style="touch-action: pan-y"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="ui.flavorDialog.actions.length ? 'flavor-dialog-title' : undefined"
      @keydown="onPanelKeyDown"
    >
      <h2
        id="flavor-dialog-title"
        class="mb-3 text-base font-semibold tracking-wide"
      >
        {{ ui.flavorDialog.name }}
      </h2>
      <div
        v-if="ui.flavorDialog.details.length"
        class="mb-3 flex flex-col gap-1 text-sm leading-relaxed"
      >
        <div
          v-for="(row, index) in ui.flavorDialog.details"
          :key="`${row.label}-${index}`"
          class="grid grid-cols-[minmax(0,1fr)_auto_auto] items-baseline gap-x-3"
        >
          <span>{{ row.label }}</span>
          <span
            class="text-right opacity-90"
            :class="{
              'text-amber-300': row.tone === 'warning',
              'opacity-60': row.tone === 'muted',
            }"
          >{{ row.value }}</span>
          <span
            v-if="row.secondaryValue"
            class="min-w-10 text-right tabular-nums"
            :class="row.tone === 'positive' ? 'text-emerald-300' : 'opacity-80'"
          >{{ row.secondaryValue }}</span>
          <span v-else />
        </div>
      </div>
      <p
        v-if="ui.flavorDialog.line"
        class="whitespace-pre-line text-sm leading-relaxed opacity-90"
      >
        {{ ui.flavorDialog.line }}
      </p>
      <div
        v-if="ui.flavorDialog.actions.length"
        class="mt-3 flex flex-col gap-1.5"
      >
        <button
          v-for="action in ui.flavorDialog.actions"
          :key="action.label"
          type="button"
          class="cursor-pointer rounded-md border bg-neutral-800/60 px-3 py-1.5 text-left text-[13px] hover:bg-neutral-700/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-default disabled:border-neutral-600/40 disabled:bg-neutral-800/35 disabled:text-neutral-400 disabled:hover:bg-neutral-800/35"
          :class="action.consequenceTone === 'negative'
            ? 'border-bad/50'
            : action.consequenceTone === 'caution'
              ? 'border-warn/50'
              : 'border-neutral-500/45'"
          :disabled="!action.enabled"
          @click="runAction(action.run)"
        >
          {{ action.label }}
          <span
            v-if="action.reasonLabel"
            class="block text-[11px]"
            :class="action.enabled && action.consequenceTone === 'caution' ? 'text-warn' : 'text-bad'"
          >
            {{ action.reasonLabel }}
          </span>
        </button>
      </div>
      <div class="mt-3 text-[11px] opacity-60">
        Esc / E — zamknij
      </div>
    </div>
  </div>

  <div
    v-if="!ui.flavorDialog.open && (ui.flavorDialog.interactionPrompt || ui.flavorDialog.prompt)"
    class="sv-hud pointer-events-none fixed bottom-[90px] left-1/2 z-[6] -translate-x-1/2"
  >
    <HudGazeChip
      :interaction-prompt="ui.flavorDialog.interactionPrompt"
      :fallback-prompt="ui.flavorDialog.prompt"
      :highlighted="ui.flavorDialog.promptHighlighted"
      :progress="ui.flavorDialog.progress"
    />
  </div>
</template>
