<script setup lang="ts">
import UiButton from '@/components/UiButton.vue'
import UiPanel from '@/components/UiPanel.vue'
import { useOverlayScreen } from '../composables/useOverlayScreen'
import { useTouchScroll } from '../composables/useTouchScroll'
import { closeArtisanOrderScreen, isArtisanOrderScreenOpen, ui } from '../store'
import { ref } from 'vue'

useOverlayScreen('artisanOrderScreen', isArtisanOrderScreenOpen, closeArtisanOrderScreen)

const listPanel = ref<HTMLElement | null>(null)
useTouchScroll(listPanel)
</script>

<template>
  <div
    v-if="ui.artisanOrderScreen.open"
    class="pointer-events-auto fixed inset-0 z-20 flex items-center justify-center bg-panel-backdrop backdrop-blur-[2px] max-md:items-stretch max-md:p-2"
    @click.self="closeArtisanOrderScreen"
  >
    <UiPanel
      class="flex h-[min(620px,calc(100dvh-32px))] w-[min(560px,calc(100vw-32px))] max-w-lg flex-col !overflow-hidden !p-5 max-md:h-[calc(100dvh-16px)] max-md:max-h-none max-md:w-full max-md:!p-3"
    >
      <div class="mb-3 flex shrink-0 items-baseline justify-between gap-2 max-md:mb-2">
        <h2 class="text-base font-semibold tracking-wide max-md:text-sm">
          Zamówienie — {{ ui.artisanOrderScreen.npcName }}
        </h2>
        <button
          type="button"
          class="rounded-md border border-white/10 px-2 py-1 text-[12px] opacity-75 max-md:px-1.5 max-md:py-0.5 max-md:text-[11px]"
          @click="closeArtisanOrderScreen"
        >
          Zamknij
        </button>
      </div>

      <p class="mb-3 shrink-0 text-[12px] opacity-70">
        Twoje monety: {{ ui.artisanOrderScreen.playerCoins }}
      </p>
      <p
        v-if="ui.artisanOrderScreen.message"
        class="mb-3 shrink-0 text-[12px] text-amber-200"
      >
        {{ ui.artisanOrderScreen.message }}
      </p>

      <div
        ref="listPanel"
        class="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto"
        style="touch-action: pan-y"
      >
        <section v-if="ui.artisanOrderScreen.orders.length > 0">
          <h3 class="mb-2 text-[12px] font-semibold uppercase tracking-wide opacity-70">
            Twoje zamówienia
          </h3>
          <div
            v-for="order in ui.artisanOrderScreen.orders"
            :key="order.id"
            class="mb-1.5 flex items-center justify-between gap-2 rounded-md bg-white/5 px-3 py-2"
          >
            <div>
              <div class="text-sm font-medium">{{ order.label }}</div>
              <div class="text-[12px] opacity-70">{{ order.statusLabel }}</div>
            </div>
            <UiButton
              v-if="order.canPickup"
              variant="primary"
              class="!min-h-9 !px-3 !py-1.5 text-[12px]"
              @click="ui.artisanOrderScreen.onPickup?.(order.id)"
            >
              Odbierz
            </UiButton>
          </div>
        </section>

        <section>
          <h3 class="mb-2 text-[12px] font-semibold uppercase tracking-wide opacity-70">
            Dostępne wyroby
          </h3>
          <div
            v-if="ui.artisanOrderScreen.catalog.length === 0"
            class="text-[12px] opacity-60"
          >
            Ten rzemieślnik nie przyjmuje teraz zamówień.
          </div>
          <div
            v-for="entry in ui.artisanOrderScreen.catalog"
            :key="entry.productionId"
            class="mb-1.5 rounded-md bg-white/5 px-3 py-2"
          >
            <div class="flex items-start justify-between gap-2">
              <div>
                <div class="text-sm font-medium">
                  {{ entry.label }}
                  <span v-if="entry.prefers" class="ml-1 text-[11px] opacity-60">specjalność</span>
                </div>
                <div class="text-[12px] opacity-70">
                  Zaliczka: {{ entry.deposit }} monet
                </div>
                <div
                  v-if="entry.missingLabel"
                  class="mt-1 text-[12px] text-amber-200"
                >
                  Brakuje: {{ entry.missingLabel }}
                </div>
                <div
                  v-else-if="!entry.canOrder"
                  class="mt-1 text-[12px] opacity-60"
                >
                  Poza możliwościami tego kowala.
                </div>
              </div>
              <UiButton
                variant="primary"
                class="!min-h-9 !px-3 !py-1.5 text-[12px]"
                :disabled="!entry.canOrder || !!entry.missingLabel || ui.artisanOrderScreen.playerCoins < entry.deposit"
                @click="ui.artisanOrderScreen.onOrder?.(entry.productionId)"
              >
                Zamów
              </UiButton>
            </div>
          </div>
        </section>
      </div>
    </UiPanel>
  </div>
</template>
