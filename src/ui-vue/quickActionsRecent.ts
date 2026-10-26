/**
 * Session-local recent Quick Actions (Stage C UI). Presentation only —
 * does not persist to save; resolves live handlers from the current screen.
 * @domain ui
 */
import { reactive } from 'vue'
import type { QuickActionsCategoryId } from './store'

export type RecentQuickAction = {
  key: string
  label: string
  categoryId: QuickActionsCategoryId
  cost?: string
}

const MAX_RECENT = 5

const state = reactive<{ items: RecentQuickAction[] }>({ items: [] })

/** Most-recent-first list (max {@link MAX_RECENT}). */
export function listQuickActionRecent(): readonly RecentQuickAction[] {
  return state.items
}

/** Record an executed (or attempted) action; dedupes by `key` and moves to front. */
export function recordQuickActionRecent(entry: RecentQuickAction): void {
  const next = state.items.filter((item) => item.key !== entry.key)
  next.unshift({
    key: entry.key,
    label: entry.label,
    categoryId: entry.categoryId,
    cost: entry.cost,
  })
  state.items = next.slice(0, MAX_RECENT)
}
