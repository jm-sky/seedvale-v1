<script setup lang="ts">
/**
 * Compact custom listbox for MerchantFilterBar (capability).
 * Teleports the menu to body so merchant `overflow-hidden` columns do not clip it.
 * @domain ui
 */
import { ChevronDown } from 'lucide-vue-next'
import { computed, nextTick, onUnmounted, ref, watch } from 'vue'
import { useOverlayScreen } from '../composables/useOverlayScreen'
import { syncOverlayStack } from '../store'

export type MerchantFilterOption = { id: string, label: string }

const props = defineProps<{
  modelValue: string
  options: readonly MerchantFilterOption[]
  /** Accessible name for the trigger and listbox. */
  menuLabel: string
  /** Unique Esc-stack id (BUY vs OFFER). */
  overlayId: string
}>()

const emit = defineEmits<{
  'update:modelValue': [string]
}>()

const open = ref(false)
const trigger = ref<HTMLElement | null>(null)
const menu = ref<HTMLElement | null>(null)
const panelStyle = ref<Record<string, string>>({})

useOverlayScreen(props.overlayId, () => open.value, () => { open.value = false })

const selectedLabel = computed(() =>
  props.options.find((o) => o.id === props.modelValue)?.label ?? props.options[0]?.label ?? '',
)

function placePanel(): void {
  const el = trigger.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const maxH = 240
  const spaceBelow = window.innerHeight - rect.bottom - 8
  const openUp = spaceBelow < Math.min(maxH, 120) && rect.top > spaceBelow
  panelStyle.value = {
    position: 'fixed',
    left: `${Math.round(rect.left)}px`,
    width: `${Math.max(Math.round(rect.width), 140)}px`,
    maxHeight: `${maxH}px`,
    zIndex: '60',
    ...(openUp
      ? { bottom: `${Math.round(window.innerHeight - rect.top + 4)}px`, top: 'auto' }
      : { top: `${Math.round(rect.bottom + 4)}px`, bottom: 'auto' }),
  }
}

function onDocumentPointerDown(event: PointerEvent): void {
  const target = event.target as Node
  if (trigger.value?.contains(target) || menu.value?.contains(target)) return
  open.value = false
}

function onViewportChange(): void {
  if (open.value) placePanel()
}

watch(open, (isOpen) => {
  if (!isOpen) {
    document.removeEventListener('pointerdown', onDocumentPointerDown)
    window.removeEventListener('resize', onViewportChange)
    window.removeEventListener('scroll', onViewportChange, true)
    return
  }
  document.addEventListener('pointerdown', onDocumentPointerDown)
  window.addEventListener('resize', onViewportChange)
  window.addEventListener('scroll', onViewportChange, true)
  void nextTick(() => placePanel())
})

onUnmounted(() => {
  document.removeEventListener('pointerdown', onDocumentPointerDown)
  window.removeEventListener('resize', onViewportChange)
  window.removeEventListener('scroll', onViewportChange, true)
  open.value = false
  syncOverlayStack(props.overlayId, false)
})

function toggle(): void {
  open.value = !open.value
}

function choose(id: string): void {
  emit('update:modelValue', id)
  open.value = false
}
</script>

<template>
  <div class="relative inline-flex min-w-0">
    <button
      ref="trigger"
      type="button"
      class="flex max-w-48 items-center gap-1 rounded border border-neutral-700 bg-neutral-900 px-2 py-0.5 text-xs text-neutral-200 hover:border-neutral-500"
      :aria-label="menuLabel"
      :aria-expanded="open"
      aria-haspopup="listbox"
      @click="toggle"
    >
      <span class="truncate">{{ selectedLabel }}</span>
      <ChevronDown
        class="size-3 shrink-0 opacity-70"
        :class="open ? 'rotate-180' : ''"
      />
    </button>
    <Teleport to="body">
      <ul
        v-if="open"
        ref="menu"
        class="overflow-y-auto rounded border border-neutral-700 bg-neutral-900 p-1 shadow-[0_8px_24px_rgba(0,0,0,0.45)]"
        role="listbox"
        :aria-label="menuLabel"
        :style="panelStyle"
      >
        <li
          v-for="option in options"
          :key="option.id"
        >
          <button
            type="button"
            class="flex w-full rounded px-2 py-1 text-left text-xs text-neutral-200 hover:bg-neutral-800"
            :class="option.id === modelValue ? 'bg-neutral-800 text-neutral-50' : ''"
            role="option"
            :aria-selected="option.id === modelValue"
            @click="choose(option.id)"
          >
            {{ option.label }}
          </button>
        </li>
      </ul>
    </Teleport>
  </div>
</template>
