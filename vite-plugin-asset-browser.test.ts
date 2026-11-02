import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { listGlbModelUrls } from './vite-plugin-asset-browser'

describe('listGlbModelUrls', () => {
  it('lists only GLBs under public/models as /models/ URLs', () => {
    const urls = listGlbModelUrls(resolve('public/models'))
    expect(urls.length).toBeGreaterThan(0)
    for (const url of urls) {
      expect(url.startsWith('/models/')).toBe(true)
      expect(url.endsWith('.glb')).toBe(true)
    }
  })

  it('no longer lists the retired Player/NPC character models', () => {
    const urls = new Set(listGlbModelUrls(resolve('public/models')))
    expect(urls.has('/models/characters/Adventurer.glb')).toBe(false)
    expect(urls.has('/models/characters/Female_Worker.glb')).toBe(false)
    expect([...urls].some((url) => url.startsWith('/models/characters/ubc/npc/'))).toBe(false)
  })

  it('keeps the rig fixture and skinned accessories still in use', () => {
    expect(existsSync(resolve('public/models/characters/Worker.glb'))).toBe(true)
    expect(existsSync(resolve('public/models/characters/ubc/accessories/male_leather_pauldron.glb'))).toBe(true)
  })
})
