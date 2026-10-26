import { describe, expect, it } from 'vitest'
import { compareCompanionAnimationUrl } from './compareCompanionAnimation'

describe('compareCompanionAnimationUrl', () => {
  it('maps v2/v3 body GLBs to anims.glb', () => {
    expect(compareCompanionAnimationUrl('/compare/v3/Male_Peasant.glb')).toBe('/compare/v3/anims.glb')
    expect(compareCompanionAnimationUrl('/compare/v2/Female_Wizard.glb?r=1')).toBe('/compare/v2/anims.glb')
  })

  it('skips anims pack, eq packs, and non-compare URLs', () => {
    expect(compareCompanionAnimationUrl('/compare/v3/anims.glb')).toBeNull()
    expect(compareCompanionAnimationUrl('/compare/v3/eq/Female.glb')).toBeNull()
    expect(compareCompanionAnimationUrl('/models/characters/ubc/male_peasant.glb')).toBeNull()
    expect(compareCompanionAnimationUrl('/compare/v3/Male_Peasant.fbx')).toBeNull()
  })
})
