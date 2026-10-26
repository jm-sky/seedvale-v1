/**
 * Stage C Quick Actions demo fixtures — presentation only; no world/save.
 * @domain ui
 */
import { BuildingIcon, FlameIcon, Utensils } from 'lucide-vue-next'
import type { Component } from 'vue'

export type DemoViewId = 'root' | 'ogien-mixed' | 'budowa-disabled'

export type DemoActionRow = {
  label: string
  cost?: string
  disabled?: boolean
  reason?: string
}

export type DemoScenario = {
  id: DemoViewId
  label: string
  title: string
  /** null = root category chips */
  categoryLabel: string | null
  categories?: readonly { id: string; label: string; icon: Component }[]
  actions?: readonly DemoActionRow[]
}

export const DEMO_SCENARIOS: readonly DemoScenario[] = [
  {
    id: 'root',
    label: 'Root — kategorie',
    title: 'Szybkie działania',
    categoryLabel: null,
    categories: [
      { id: 'budowa', label: 'Budowa', icon: BuildingIcon },
      { id: 'ogien', label: 'Ogień', icon: FlameIcon },
      { id: 'przetrwanie', label: 'Przetrwanie', icon: Utensils },
    ],
  },
  {
    id: 'ogien-mixed',
    label: 'Ogień — dostępne + disabled',
    title: 'Szybkie działania',
    categoryLabel: 'Ogień',
    actions: [
      { label: 'Zapal gałąź', cost: '1× gałąź' },
      {
        label: 'Zbuduj ruszt',
        cost: '3× gałąź, 2× kamień, 1× pręt żelazny',
        disabled: true,
        reason: 'Brakuje: 2× kamień. Musisz stać przy własnym ognisku',
      },
      {
        label: 'Zgaś pochodnię',
        cost: '',
        disabled: true,
        reason: 'Pochodnia nie jest zapalona',
      },
    ],
  },
  {
    id: 'budowa-disabled',
    label: 'Budowa — brak materiałów',
    title: 'Szybkie działania',
    categoryLabel: 'Budowa',
    actions: [
      {
        label: 'Postaw skrzynię',
        cost: '1× skrzynia',
        disabled: true,
        reason: 'Brakuje skrzyni w ekwipunku',
      },
      {
        label: 'Zbuduj ognisko',
        cost: '3× gałąź',
        disabled: true,
        reason: 'Brakuje: 3× gałąź',
      },
      { label: 'Zleć eskortę', cost: '' },
    ],
  },
]
