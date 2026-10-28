import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import type { CharacterAppearance } from './characterTypes'
import { baseGarments } from './baseGarments'
import { bodyUrl, characterUrls, eqNodeName, eqUrl, headUrl } from './characterFiles'
import { CHARACTER_OUTFITS, CHARACTER_SEXES, MALE_ONLY_OUTFITS } from './characterTypes'

const PUBLIC = resolve(import.meta.dirname, '../../public')

function publicPath(url: string): string {
  // `/assets/foo` → `public/assets/foo`
  return resolve(PUBLIC, url.replace(/^\//, ''))
}

function glbJson(path: string): { nodes?: { name?: string }[] } {
  const buf = readFileSync(path)
  const chunkLen = buf.readUInt32LE(12)
  const jsonBytes = buf.subarray(20, 20 + chunkLen)
  return JSON.parse(jsonBytes.toString('utf8').replace(/\0+$/, '')) as { nodes?: { name?: string }[] }
}

describe('character kit products on disk', () => {
  it('ships every sex × outfit body plus heads, hair, anims, eq packs', () => {
    for (const sex of CHARACTER_SEXES) {
      for (const outfit of CHARACTER_OUTFITS) {
        if (sex === 'Female' && MALE_ONLY_OUTFITS.has(outfit)) continue
        const path = publicPath(bodyUrl(sex, outfit))
        expect(existsSync(path), path).toBe(true)
      }
      expect(existsSync(publicPath(headUrl(sex, 'Base'))), `${sex} head`).toBe(true)
      expect(existsSync(publicPath(eqUrl(sex))), `${sex} eq`).toBe(true)
    }
    expect(existsSync(publicPath('/assets/characters/anims.glb'))).toBe(true)
    expect(existsSync(publicPath('/assets/characters/hair.glb'))).toBe(true)
  })

  it('packs EQ_PeasantSkirt in Female eq', () => {
    const json = glbJson(publicPath(eqUrl('Female')))
    const names = (json.nodes ?? []).map((n) => n.name)
    expect(names).toContain(eqNodeName('PeasantSkirt'))
  })

  it('skirted female appearance lists existing files', () => {
    const a: CharacterAppearance = {
      sex: 'Female',
      outfit: 'Wizard',
      head: 'Base',
      hair: 'Long',
      beard: false,
      clothTint: null,
      garments: baseGarments('Female', 'Wizard'),
    }
    expect(a.garments).toEqual(['PeasantSkirt'])
    for (const url of characterUrls(a)) {
      expect(existsSync(publicPath(url)), url).toBe(true)
    }
  })
})
