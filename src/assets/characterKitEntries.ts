/**
 * @domain tools
 * Asset Browser character list: one entry per live CharacterKit body (sex × outfit), assembled like the game kit —
 * body + head + hair (+ beard) + work skirt. Bodies and eq load from the morph-carrying build derivatives
 * (`BODY_BUILD_DIR`) so every entry offers the muscular/heavy/slim switch; with the build at muscular they match
 * the original files. Head/hair/beard can be overridden live (`withKitLook`).
 */
import type { HairStyle, HeadVariant } from '../characters/characterTypes'
import type { AssetIndexEntry } from './assetIndex'
import { NPC_HEIGHT } from '../ai/NpcAgent'
import { baseGarments } from '../characters/baseGarments'
import { BODY_BUILDS } from '../characters/bodyBuild'
import { bodyBuildVariantUrl, bodyUrl, eqUrl, hairNodeName, hairUrl, headUrl } from '../characters/characterFiles'
import {
  CHARACTER_OUTFITS,
  CHARACTER_SEXES,
  hasOutfitBody,
} from '../characters/characterTypes'
import { PLAYER_HEIGHT } from '../player/PlayerController'
import { anchorsForAsset } from './assetAnchorData'

/** Default player reference (also the held-item alignment id). */
export const PLAYER_REFERENCE_ID = 'character:player'

/** `'auto'` keeps the entry's default; otherwise the override applied to every kit entry. */
export type KitHeadChoice = 'auto' | HeadVariant
export type KitHairChoice = 'auto' | 'none' | HairStyle
export type KitBeardChoice = 'auto' | 'on' | 'off'

export type KitLook = {
  kitHead: KitHeadChoice
  kitHair: KitHairChoice
  kitBeard: KitBeardChoice
}

/** One entry per live outfit body; Male Peasant keeps the `character:player` id. */
export function characterKitEntries(): AssetIndexEntry[] {
  const out: AssetIndexEntry[] = []
  for (const sex of CHARACTER_SEXES) {
    for (const outfit of CHARACTER_OUTFITS) {
      if (!hasOutfitBody(sex, outfit)) continue
      const isPlayer = sex === 'Male' && outfit === 'Peasant'
      const id = isPlayer ? PLAYER_REFERENCE_ID : `character:${sex.toLowerCase()}-${outfit.toLowerCase().replace(/_/g, '-')}`
      const garments = baseGarments(sex, outfit)
      const skirt = garments.length > 0
      const head: HeadVariant = sex === 'Male' && outfit === 'Blacksmith' ? 'Round' : 'Base'
      const hair: HairStyle = sex === 'Female' ? 'Long' : 'Parted'
      const name = `${sex} ${outfit.replace(/_/g, ' ')}${skirt ? ' + WorkSkirt' : ''}`
      out.push({
        id,
        url: bodyBuildVariantUrl(bodyUrl(sex, outfit)),
        label: isPlayer ? `Player (default: ${name})` : name,
        group: 'character',
        prepare: { mode: 'height', value: sex === 'Female' ? NPC_HEIGHT : PLAYER_HEIGHT },
        skinned: true,
        // Male kit bodies share the player's UBC hand anchors.
        anchors: anchorsForAsset(sex === 'Male' ? PLAYER_REFERENCE_ID : id),
        headUrl: headUrl(sex, head),
        hair: { url: hairUrl(head), nodes: [hairNodeName(hair)] },
        garments: skirt ? garments : undefined,
        eqUrl: skirt ? bodyBuildVariantUrl(eqUrl(sex)) : undefined,
        bodyBuilds: BODY_BUILDS,
        kit: { sex, head, hair, beard: false },
      })
    }
  }
  return out
}

/** Entry with the browser's head/hair/beard overrides applied (non-kit entries are returned unchanged). */
export function withKitLook(entry: AssetIndexEntry, look: KitLook): AssetIndexEntry {
  const kit = entry.kit
  if (!kit) return entry
  const head = look.kitHead === 'auto' ? kit.head : look.kitHead
  const hair = look.kitHair === 'auto' ? kit.hair : look.kitHair === 'none' ? null : look.kitHair
  const beard = look.kitBeard === 'auto' ? kit.beard : look.kitBeard === 'on'
  const nodes = [...(hair ? [hairNodeName(hair)] : []), ...(beard ? [hairNodeName('Beard')] : [])]
  return { ...entry, headUrl: headUrl(kit.sex, head), hair: { url: hairUrl(head), nodes } }
}
