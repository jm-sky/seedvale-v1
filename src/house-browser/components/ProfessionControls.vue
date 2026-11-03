<script setup lang="ts">
import { HOUSE_BROWSER_PROFESSIONS, type HouseBrowserProfession } from '../houseBrowserTypes'

const profession = defineModel<HouseBrowserProfession>('profession', { required: true })
</script>

<template>
  <section class="flex flex-col gap-2">
    <h2 class="text-xs font-semibold uppercase tracking-wide text-white/60">
      Profession decoration
    </h2>
    <select
      v-model="profession"
      class="rounded bg-white/10 px-2 py-1 text-sm capitalize"
    >
      <option
        v-for="p in HOUSE_BROWSER_PROFESSIONS"
        :key="p"
        :value="p"
        class="bg-[#14181c]"
      >
        {{ p }}
      </option>
    </select>
  </section>
</template>
