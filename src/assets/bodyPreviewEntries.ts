import type { AssetIndexEntry } from './assetIndex'
/**
 * @domain tools
 * Asset Browser entries for the tools-022 body-build preview: the shipped V1 current-kit outfits (derivative GLBs with
 * `Fat`/`Slim` targets under `body-preview/`) assembled the way the game kit is — body + base head + hair + skirt.
 * Original production URLs are untouched; these entries exist only in the browser index.
 */
import { NPC_HEIGHT } from '../ai/NpcAgent'
import { baseGarments } from '../characters/baseGarments'
import { BODY_BUILDS } from '../characters/bodyBuild'
import { bodyBuildVariantUrl, bodyUrl, eqUrl, hairNodeName, hairUrl, headUrl } from '../characters/characterFiles'
import {
  CHARACTER_OUTFITS,
  type CharacterOutfit,
  type CharacterSex,
  hasOutfitBody,
} from '../characters/characterTypes'
import { PLAYER_HEIGHT } from '../player/PlayerController'
import { anchorsForAsset } from './assetAnchorData'

/** One entry per shipped outfit body (male-only outfits are not synthesized for Female). */
export function bodyPreviewEntries(): AssetIndexEntry[] {
  const out: AssetIndexEntry[] = []
  const sexes: CharacterSex[] = ['Male', 'Female']
  for (const sex of sexes) {
    for (const outfit of CHARACTER_OUTFITS as readonly CharacterOutfit[]) {
      if (!hasOutfitBody(sex, outfit)) continue
      const garments = baseGarments(sex, outfit)
      const skirt = garments.length > 0
      const id = `bodypreview:${sex.toLowerCase()}-${outfit.toLowerCase().replace(/_/g, '-')}`
      const hair = sex === 'Female' ? 'Long' : 'Parted'
      out.push({
        id,
        url: bodyBuildVariantUrl(bodyUrl(sex, outfit)),
        label: `Body preview · ${sex} ${outfit.replace(/_/g, ' ')}${skirt ? ' + WorkSkirt' : ''}`,
        group: 'character',
        prepare: { mode: 'height', value: sex === 'Female' ? NPC_HEIGHT : PLAYER_HEIGHT },
        skinned: true,
        anchors: anchorsForAsset(id),
        headUrl: headUrl(sex, 'Base'),
        hair: { url: hairUrl('Base'), nodes: [hairNodeName(hair)] },
        garments: skirt ? garments : undefined,
        eqUrl: skirt ? bodyBuildVariantUrl(eqUrl(sex)) : undefined,
        bodyBuilds: BODY_BUILDS,
      })
    }
  }
  return out
}
