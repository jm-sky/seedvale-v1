import type { AssetIndexEntry } from './assetIndex'
/**
 * @domain tools
 * Asset Browser entries for the tools-022 body-build preview: the shipped V1 current-kit outfits (derivative GLBs with
 * `Fat`/`Slim` targets under `body-preview/`) assembled the way the game kit is — body + base head + hair + skirt.
 * Original production URLs are untouched; these entries exist only in the browser index.
 */
import { NPC_HEIGHT } from '../ai/NpcAgent'
import { baseGarments } from '../characters/baseGarments'
import { bodyUrl, eqUrl, hairNodeName, hairUrl, headUrl } from '../characters/characterFiles'
import {
  CHARACTER_OUTFITS,
  type CharacterOutfit,
  type CharacterSex,
  MALE_ONLY_OUTFITS,
} from '../characters/characterTypes'
import { PLAYER_HEIGHT } from '../player/PlayerController'
import { anchorsForAsset } from './assetAnchorData'
import { BODY_BUILDS } from './bodyBuild'

export const BODY_PREVIEW_DIR = '/assets/characters/body-preview/'

/** Preview twin of a production character URL (`/assets/characters/X.glb` → `…/body-preview/X.glb`). */
export function bodyPreviewUrl(prodUrl: string): string {
  return prodUrl.replace('/assets/characters/', BODY_PREVIEW_DIR)
}

/** One entry per shipped outfit body (Female Farmer/Woodcutter do not exist and are not synthesized). */
export function bodyPreviewEntries(): AssetIndexEntry[] {
  const out: AssetIndexEntry[] = []
  const sexes: CharacterSex[] = ['Male', 'Female']
  for (const sex of sexes) {
    for (const outfit of CHARACTER_OUTFITS as readonly CharacterOutfit[]) {
      if (sex === 'Female' && MALE_ONLY_OUTFITS.has(outfit)) continue
      const garments = baseGarments(sex, outfit)
      const skirt = garments.length > 0
      const id = `bodypreview:${sex.toLowerCase()}-${outfit.toLowerCase().replace(/_/g, '-')}`
      const hair = sex === 'Female' ? 'Long' : 'Parted'
      out.push({
        id,
        url: bodyPreviewUrl(bodyUrl(sex, outfit)),
        label: `Body preview · ${sex} ${outfit.replace(/_/g, ' ')}${skirt ? ' + WorkSkirt' : ''}`,
        group: 'character',
        prepare: { mode: 'height', value: sex === 'Female' ? NPC_HEIGHT : PLAYER_HEIGHT },
        skinned: true,
        anchors: anchorsForAsset(id),
        headUrl: headUrl(sex, 'Base'),
        hair: { url: hairUrl('Base'), nodes: [hairNodeName(hair)] },
        garments: skirt ? garments : undefined,
        eqUrl: skirt ? bodyPreviewUrl(eqUrl(sex)) : undefined,
        bodyBuilds: BODY_BUILDS,
      })
    }
  }
  return out
}
