// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  caveSpatialContext,
  WORLD_SPATIAL_CONTEXT_SURFACE,
} from '../world/spatialContext'

const loadAsync = vi.fn<(url: string) => Promise<AudioBuffer>>()
const audioInstances: Array<{
  play: ReturnType<typeof vi.fn>
  stop: ReturnType<typeof vi.fn>
  disconnect: ReturnType<typeof vi.fn>
  isPlaying: boolean
}> = []

vi.mock('three', () => {
  class Vector3 {
    x = 0
    y = 0
    z = 0
    set(x: number, y: number, z: number): this {
      this.x = x
      this.y = y
      this.z = z
      return this
    }
  }

  class AudioListener {
    context = {
      currentTime: 0,
      state: 'running' as AudioContextState,
      createGain: () => ({
        connect: vi.fn(),
        disconnect: vi.fn(),
        gain: { setTargetAtTime: vi.fn(), disconnect: vi.fn(), connect: vi.fn() },
      }),
    }

    getInput = () => ({})
    getWorldPosition = (target: Vector3) => {
      target.set(0, 10, 0)
    }

    setMasterVolume = vi.fn()
  }

  class Audio {
    isPlaying = false
    onEnded: (() => void) | null = null
    gain = { disconnect: vi.fn(), connect: vi.fn() }
    play = vi.fn(function (this: Audio) {
      this.isPlaying = true
    })
    stop = vi.fn(function (this: Audio) {
      this.isPlaying = false
    })
    disconnect = vi.fn()
    setBuffer = vi.fn()
    setLoop = vi.fn()
    setVolume = vi.fn()
    getVolume = vi.fn(() => 0)

    constructor(_listener: AudioListener) {
      audioInstances.push(this)
    }
  }

  class AudioLoader {
    loadAsync = loadAsync
  }

  return { Audio, AudioListener, AudioLoader, Vector3 }
})

describe('loadBuffer cache recovery (world-038)', () => {
  beforeEach(async () => {
    vi.resetModules()
    loadAsync.mockReset()
    audioInstances.length = 0
  })

  it('shares one in-flight request per url and evicts only failed promises', async () => {
    const { loadBuffer } = await import('./createWorldAudio')
    const fail = Object.assign(new Error('network'), { name: 'fail' })
    loadAsync.mockRejectedValueOnce(fail)

    await expect(loadBuffer('a.ogg')).rejects.toThrow('network')
    expect(loadAsync).toHaveBeenCalledTimes(1)

    const buffer = { duration: 1 } as AudioBuffer
    loadAsync.mockResolvedValueOnce(buffer)

    await expect(loadBuffer('a.ogg')).resolves.toBe(buffer)
    expect(loadAsync).toHaveBeenCalledTimes(2)

    await expect(loadBuffer('a.ogg')).resolves.toBe(buffer)
    expect(loadAsync).toHaveBeenCalledTimes(2)
  })
})

describe('createWorldAudio lifecycle and spatial gating', () => {
  beforeEach(async () => {
    vi.resetModules()
    loadAsync.mockReset()
    audioInstances.length = 0
    loadAsync.mockResolvedValue({ duration: 1 } as AudioBuffer)
  })

  async function makeAudio(
    options: import('./createWorldAudio').CreateWorldAudioOptions = {},
  ) {
    const { createWorldAudio } = await import('./createWorldAudio')
    const camera = { add: vi.fn(), remove: vi.fn() } as unknown as import('three').Camera
    return createWorldAudio(camera, options)
  }

  it('does not play a pending one-shot after dispose resolves', async () => {
    let resolveLoad!: (buffer: AudioBuffer) => void
    loadAsync.mockImplementationOnce(() => new Promise<AudioBuffer>((resolve) => {
      resolveLoad = resolve
    }))

    const audio = await makeAudio()
    const handle = audio.playAtCancelable('late.ogg', { x: 0, y: 0, z: 0 })
    audio.dispose()
    resolveLoad({ duration: 1 } as AudioBuffer)
    await Promise.resolve()
    await Promise.resolve()

    const sound = audioInstances.at(-1)
    expect(sound?.play).not.toHaveBeenCalled()
    expect(() => handle.stop()).not.toThrow()
  })

  it('stops active one-shots on dispose and keeps consumer stop harmless', async () => {
    const audio = await makeAudio()
    const handle = audio.playAtCancelable('now.ogg', { x: 0, y: 0, z: 0 })
    await Promise.resolve()
    await Promise.resolve()
    const sound = audioInstances.at(-1)
    expect(sound?.play).toHaveBeenCalled()

    audio.dispose()
    expect(sound?.stop).toHaveBeenCalled()
    expect(() => handle.stop()).not.toThrow()
  })

  it('is inert after dispose for new playback requests', async () => {
    const audio = await makeAudio()
    audio.dispose()
    audio.playOnce('ui.ogg')
    audio.playAt('world.ogg', { x: 0, y: 0, z: 0 })
    await Promise.resolve()
    expect(loadAsync).not.toHaveBeenCalled()
  })

  it('rejects incompatible surface/cave contexts before loading audio', async () => {
    const audio = await makeAudio({
      resolveSpatialContextAt: (_x, y) => (
        y < 0 ? caveSpatialContext('a') : WORLD_SPATIAL_CONTEXT_SURFACE
      ),
    })
    audio.playAt('blocked.ogg', {
      x: 1,
      y: 5,
      z: 0,
      spatialContext: caveSpatialContext('a'),
    })
    await Promise.resolve()
    expect(loadAsync).not.toHaveBeenCalled()
  })

  it('allows compatible contexts and still loads', async () => {
    const audio = await makeAudio({
      resolveSpatialContextAt: () => WORLD_SPATIAL_CONTEXT_SURFACE,
    })
    audio.playAt('ok.ogg', { x: 1, y: 0, z: 0, spatialContext: WORLD_SPATIAL_CONTEXT_SURFACE })
    await Promise.resolve()
    expect(loadAsync).toHaveBeenCalledWith('ok.ogg')
  })
})
