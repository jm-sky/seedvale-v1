import type { CharacterAppearance, CharacterOutfit } from '../characters/characterTypes'
import { baseGarments } from '../characters/baseGarments'
import { ANIMS_URL, bodyUrl } from '../characters/characterFiles'
import { urlParamValue } from '../debug/debugMode'
import { PLAYER_MODEL_URL } from './PlayerController'

/** @deprecated Prefer kit `ANIMS_URL`; alias kept for asset-browser UBC compare paths. */
export const UBC_HUMANOID_ANIMATION_URL = ANIMS_URL
/** @deprecated Prefer {@link UBC_HUMANOID_ANIMATION_URL}. */
export const PLAYER_UBC_ANIMATION_URL = ANIMS_URL

export const PLAYER_UBC_PEASANT_URL = bodyUrl('Male', 'Peasant')
export const PLAYER_UBC_RANGER_URL = bodyUrl('Male', 'Ranger')
export const PLAYER_UBC_KNIGHT_URL = bodyUrl('Male', 'Knight_Helm')
export const PLAYER_UBC_KNIGHT_CLOTH_URL = bodyUrl('Male', 'Knight_Cloth')
export const PLAYER_UBC_NOBLE_URL = bodyUrl('Male', 'Peasant')
export const PLAYER_UBC_WIZARD_URL = bodyUrl('Male', 'Wizard')
export const PLAYER_UBC_PEASANT_BROWN_URL = '/assets/characters/tex/Peasant_2.png'
export const PLAYER_UBC_RANGER_BROWN_URL = '/assets/characters/tex/Ranger_2.png'
export const PLAYER_UBC_KNIGHT_BROWN_URL = '/assets/characters/tex/Knight_2.png'
export const PLAYER_UBC_KNIGHT_CLOTH_BROWN_URL = '/assets/characters/tex/Knight_2.png'
export const PLAYER_UBC_NOBLE_BROWN_URL = '/assets/characters/tex/Peasant_3.png'
export const PLAYER_UBC_WIZARD_BROWN_URL = '/assets/characters/tex/Wizard_2.png'

export type PlayerVisualId =
  | 'adventurer'
  | 'peasant'
  | 'ranger'
  | 'knight'
  | 'knight_cloth'
  | 'noble'
  | 'wizard'
export type PlayerOutfitTint = 'default' | 'brown'
export type PlayerEquipmentOutfitId = 'peasant' | 'ranger' | 'knight'

export type PlayerVisualPreset = {
  animationUrl: string | null
  id: PlayerVisualId
  kit: CharacterAppearance | null
  modelUrl: string
}

export type PlayerAppearance = PlayerVisualPreset & {
  tint: PlayerOutfitTint
  tintUrl: string | null
}

const PLAYER_VISUAL_IDS: readonly PlayerVisualId[] = [
  'adventurer',
  'peasant',
  'ranger',
  'knight',
  'knight_cloth',
  'noble',
  'wizard',
]

const VISUAL_OUTFIT: Record<Exclude<PlayerVisualId, 'adventurer'>, CharacterOutfit> = {
  peasant: 'Peasant',
  ranger: 'Ranger',
  knight: 'Knight_Helm',
  knight_cloth: 'Knight_Cloth',
  noble: 'Peasant',
  wizard: 'Wizard',
}

function maleKit(outfit: CharacterOutfit, clothTint: number | null = null): CharacterAppearance {
  return {
    sex: 'Male',
    outfit,
    head: 'Base',
    hair: 'Parted',
    beard: false,
    clothTint,
    garments: baseGarments('Male', outfit),
  }
}

const PRESETS: Record<PlayerVisualId, PlayerVisualPreset> = {
  adventurer: {
    id: 'adventurer',
    modelUrl: PLAYER_MODEL_URL,
    animationUrl: null,
    kit: null,
  },
  peasant: {
    id: 'peasant',
    modelUrl: PLAYER_UBC_PEASANT_URL,
    animationUrl: ANIMS_URL,
    kit: maleKit('Peasant'),
  },
  ranger: {
    id: 'ranger',
    modelUrl: PLAYER_UBC_RANGER_URL,
    animationUrl: ANIMS_URL,
    kit: maleKit('Ranger'),
  },
  knight: {
    id: 'knight',
    modelUrl: PLAYER_UBC_KNIGHT_URL,
    animationUrl: ANIMS_URL,
    kit: maleKit('Knight_Helm'),
  },
  knight_cloth: {
    id: 'knight_cloth',
    modelUrl: PLAYER_UBC_KNIGHT_CLOTH_URL,
    animationUrl: ANIMS_URL,
    kit: maleKit('Knight_Cloth'),
  },
  noble: {
    id: 'noble',
    modelUrl: PLAYER_UBC_NOBLE_URL,
    animationUrl: ANIMS_URL,
    kit: maleKit('Peasant'),
  },
  wizard: {
    id: 'wizard',
    modelUrl: PLAYER_UBC_WIZARD_URL,
    animationUrl: ANIMS_URL,
    kit: maleKit('Wizard'),
  },
}

const TINT_URL: Partial<Record<PlayerVisualId, string>> = {
  peasant: PLAYER_UBC_PEASANT_BROWN_URL,
  ranger: PLAYER_UBC_RANGER_BROWN_URL,
  knight: PLAYER_UBC_KNIGHT_BROWN_URL,
  knight_cloth: PLAYER_UBC_KNIGHT_CLOTH_BROWN_URL,
  noble: PLAYER_UBC_NOBLE_BROWN_URL,
  wizard: PLAYER_UBC_WIZARD_BROWN_URL,
}

const EQUIPMENT_MODEL_URLS: readonly string[] = [
  PLAYER_UBC_PEASANT_URL,
  PLAYER_UBC_RANGER_URL,
  PLAYER_UBC_KNIGHT_URL,
]

function isPlayerVisualId(value: string): value is PlayerVisualId {
  return (PLAYER_VISUAL_IDS as readonly string[]).includes(value)
}

function readSearchParams(search: string | null | undefined): URLSearchParams | null {
  if (search !== undefined && search !== null) {
    try {
      return new URLSearchParams(search.startsWith('?') ? search.slice(1) : search)
    } catch {
      return null
    }
  }
  return null
}

function readNamedParam(name: string, search?: string | null): string | null {
  const params = readSearchParams(search)
  if (params) {
    const raw = params.get(name)
    if (raw === null || raw.trim() === '') return null
    return raw.trim()
  }
  return urlParamValue(name)
}

export function resolvePlayerUrlOverride(
  search?: string | null,
): PlayerVisualId | null {
  const raw = readNamedParam('player', search)
  if (raw === null) return null
  const id = raw.toLowerCase()
  if (isPlayerVisualId(id)) return id
  console.warn(`[player] unknown ?player=${raw}; using equipment/default Peasant`)
  return null
}

export function resolveEquipmentOutfit(bodyKind: string | null | undefined): PlayerEquipmentOutfitId {
  if (bodyKind == null) return 'peasant'
  if (bodyKind === 'leather_armor') return 'ranger'
  return 'knight'
}

export function resolvePlayerTint(
  search: string | null | undefined,
  outfit: PlayerVisualId,
): PlayerOutfitTint {
  if (outfit === 'adventurer') return 'default'
  const raw = readNamedParam('playerTint', search)
  if (raw === null) return 'default'
  const value = raw.toLowerCase()
  if (value === 'brown') return 'brown'
  if (value === 'default' || value === 'cream' || value === 'green' || value === 'white') {
    return 'default'
  }
  console.warn(`[player] unknown ?playerTint=${raw}; using default albedo`)
  return 'default'
}

function tintUrlFor(id: PlayerVisualId, tint: PlayerOutfitTint): string | null {
  if (tint !== 'brown') return null
  return TINT_URL[id] ?? null
}

/** Brown tint → soft cloth multiply when kit is used (PNG sidecar optional). */
const BROWN_CLOTH_TINT = 0xc4a080

export function resolvePlayerAppearance(opts?: {
  search?: string | null
  bodyKind?: string | null
}): PlayerAppearance {
  const override = resolvePlayerUrlOverride(opts?.search)
  const id: PlayerVisualId = override ?? resolveEquipmentOutfit(opts?.bodyKind ?? null)
  const preset = PRESETS[id]
  const tint = resolvePlayerTint(opts?.search, id)
  let kit = preset.kit
  if (kit && tint === 'brown') {
    kit = { ...kit, clothTint: BROWN_CLOTH_TINT }
  }
  return {
    ...preset,
    kit,
    tint,
    tintUrl: tintUrlFor(id, tint),
  }
}

export function resolvePlayerVisualPreset(
  search?: string | null,
): PlayerVisualPreset {
  const appearance = resolvePlayerAppearance({ search, bodyKind: null })
  return {
    id: appearance.id,
    modelUrl: appearance.modelUrl,
    animationUrl: appearance.animationUrl,
    kit: appearance.kit,
  }
}

/**
 * Companion clips for kit bodies (`anims.glb`). Adventurer / non-kit URLs → null.
 * Asset-browser still calls this for compare slots.
 */
export function companionAnimationUrl(modelUrl: string): string | null {
  const path = modelUrl.split('?')[0] ?? modelUrl
  if (!path.endsWith('.glb')) return null
  if (path === ANIMS_URL) return null
  if (path.startsWith('/assets/characters/') && !path.includes('/eq/')) return ANIMS_URL
  // Legacy UBC paths (parked / compare)
  if (path.startsWith('/models/characters/ubc/') && path !== '/models/characters/ubc/ual_humanoid.glb') {
    return ANIMS_URL
  }
  return null
}

export function ubcPreloadUrls(currentModelUrl: string): readonly string[] {
  if (!EQUIPMENT_MODEL_URLS.includes(currentModelUrl)) return []
  return EQUIPMENT_MODEL_URLS.filter((url) => url !== currentModelUrl)
}

export function playerOutfitId(id: PlayerVisualId): CharacterOutfit | null {
  if (id === 'adventurer') return null
  return VISUAL_OUTFIT[id]
}
