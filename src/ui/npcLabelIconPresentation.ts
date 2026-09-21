import { __iconNode as bedIcon } from '@lucide/vue/dist/esm/icons/bed.mjs'
import { __iconNode as briefcaseIcon } from '@lucide/vue/dist/esm/icons/briefcase.mjs'
import { __iconNode as chartBarIcon } from '@lucide/vue/dist/esm/icons/chart-bar.mjs'
import { __iconNode as checkIcon } from '@lucide/vue/dist/esm/icons/check.mjs'
import { __iconNode as circleAlertIcon } from '@lucide/vue/dist/esm/icons/circle-alert.mjs'
import { __iconNode as circleQuestionIcon } from '@lucide/vue/dist/esm/icons/circle-question-mark.mjs'
import { __iconNode as dropletIcon } from '@lucide/vue/dist/esm/icons/droplet.mjs'
import { __iconNode as ellipsisIcon } from '@lucide/vue/dist/esm/icons/ellipsis.mjs'
import { __iconNode as footprintsIcon } from '@lucide/vue/dist/esm/icons/footprints.mjs'
import { __iconNode as messageCircleIcon } from '@lucide/vue/dist/esm/icons/message-circle.mjs'
import { __iconNode as swordsIcon } from '@lucide/vue/dist/esm/icons/swords.mjs'
import { __iconNode as treesIcon } from '@lucide/vue/dist/esm/icons/trees.mjs'
import { __iconNode as utensilsIcon } from '@lucide/vue/dist/esm/icons/utensils.mjs'
import type { LucideIconNode } from './lucideDomIcon'
import { needColor, type NeedId } from '../ai/Needs'

/** Narrow activity projection for label icons — avoids importing `NpcAgent`. */
export type ActivityIconSource = {
  kind: 'combat' | 'eat' | 'idle' | 'need' | 'sleep' | 'talking' | 'wander' | 'work'
  need?: NeedId
}

/**
 * Shared icon presentation kinds for CSS2D NPC labels (plan ui-input-035).
 *
 * @domain ui-input
 */
export type AgentLabelIconKind =
  | 'quest-talk'
  | 'quest-ready'
  | 'quest-available'
  | 'quest-progress'
  | 'shop'
  | 'need-food'
  | 'need-water'
  | 'need-wood'
  | 'activity-sleep'
  | 'activity-work'
  | 'activity-combat'
  | 'activity-talking'
  | 'activity-wander'
  | 'activity-idle'
  | 'activity-eat'

/** Presentation payload for one icon-row slot — domain-free for the label DOM. */
export type AgentLabelIconPresentation = {
  icon: AgentLabelIconKind
  color?: string
  title?: string
}

const ICON_NODES: Record<AgentLabelIconKind, LucideIconNode> = {
  'quest-talk': circleQuestionIcon as LucideIconNode,
  'quest-ready': checkIcon as LucideIconNode,
  'quest-available': circleAlertIcon as LucideIconNode,
  'quest-progress': ellipsisIcon as LucideIconNode,
  shop: chartBarIcon as LucideIconNode,
  'need-food': utensilsIcon as LucideIconNode,
  'need-water': dropletIcon as LucideIconNode,
  'need-wood': treesIcon as LucideIconNode,
  'activity-sleep': bedIcon as LucideIconNode,
  'activity-work': briefcaseIcon as LucideIconNode,
  'activity-combat': swordsIcon as LucideIconNode,
  'activity-talking': messageCircleIcon as LucideIconNode,
  'activity-wander': footprintsIcon as LucideIconNode,
  'activity-idle': footprintsIcon as LucideIconNode,
  'activity-eat': utensilsIcon as LucideIconNode,
}

const QUEST_TOKEN_PRESENTATION: Record<string, AgentLabelIconPresentation> = {
  '?': { icon: 'quest-talk', color: '#f0d060', title: 'Quest talk' },
  '✓': { icon: 'quest-ready', color: '#6dcf6d', title: 'Quest ready' },
  '!': { icon: 'quest-available', color: '#f0a040', title: 'Quest available' },
  '…': { icon: 'quest-progress', color: '#9ab0c0', title: 'Quest in progress' },
}

/**
 * Returns the Lucide `__iconNode` for a label icon kind.
 *
 * @domain ui-input
 */
export function iconNodeForKind(kind: AgentLabelIconKind): LucideIconNode {
  return ICON_NODES[kind]
}

function needColorCss(need: NeedId): string {
  return `#${needColor(need).toString(16).padStart(6, '0')}`
}

/**
 * Maps a QuestManager label-marker token to icon presentation.
 * Unknown tokens yield `null` (no slot).
 *
 * @domain ui-input
 */
export function questMarkerIconPresentation(token: string | null): AgentLabelIconPresentation | null {
  if (!token) return null
  return QUEST_TOKEN_PRESENTATION[token] ?? null
}

/**
 * Shop slot presentation — ChartBar when the NPC is a recognizable vendor.
 *
 * @domain ui-input
 */
export function shopIconPresentation(visible: boolean): AgentLabelIconPresentation | null {
  if (!visible) return null
  return { icon: 'shop', color: '#c8d4e0', title: 'Shop' }
}

function needIconPresentation(need: NeedId): AgentLabelIconPresentation {
  switch (need) {
    case 'food':
      return { icon: 'need-food', color: needColorCss('food'), title: 'Need: food' }
    case 'idle':
      return { icon: 'activity-idle', color: '#9ab0c0', title: 'Idle' }
    case 'water':
    case 'waterDuty':
      return { icon: 'need-water', color: needColorCss(need), title: 'Need: water' }
    case 'wood':
      return { icon: 'need-wood', color: needColorCss('wood'), title: 'Need: wood' }
  }
}

/**
 * Maps NPC `CurrentActivity` to the debug activity/need icon.
 * Prefer the concrete need when `kind === 'need'`.
 *
 * @domain ui-input
 */
export function activityIconPresentation(activity: ActivityIconSource): AgentLabelIconPresentation {
  if (activity.kind === 'need' && activity.need) {
    return needIconPresentation(activity.need)
  }
  switch (activity.kind) {
    case 'combat':
      return { icon: 'activity-combat', color: '#e05555', title: 'Combat' }
    case 'eat':
      return { icon: 'activity-eat', color: needColorCss('food'), title: 'Eating' }
    case 'idle':
      return { icon: 'activity-idle', color: '#9ab0c0', title: 'Idle' }
    case 'need':
      return { icon: 'activity-idle', color: '#9ab0c0', title: 'Need' }
    case 'sleep':
      return { icon: 'activity-sleep', color: '#8a9bb0', title: 'Sleep' }
    case 'talking':
      return { icon: 'activity-talking', color: '#7eb8e0', title: 'Talking' }
    case 'wander':
      return { icon: 'activity-wander', color: '#9ab0c0', title: 'Wander' }
    case 'work':
      return { icon: 'activity-work', color: '#c4a46a', title: 'Work' }
  }
}
