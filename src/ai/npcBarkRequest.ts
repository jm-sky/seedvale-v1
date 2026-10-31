/**
 * Shared NPC bark request boundary (npc-049): resolve voice → admit via
 * limiter → spatial playback. Simulation callers own *when*; this owns
 * throttling, asset lookup, and presentation. Denial is always a silent
 * no-op for simulation.
 *
 * @domain npc
 */

import type { WorldSoundPosition } from '../audio/createWorldAudio'
import type { WeatherType } from '../world/weather'
import { playNpcVoiceAt } from '../audio/npcVoicePlayback'
import { type NpcBarkLimiter, type NpcBarkRejectReason } from './npcBarkLimiter'
import { isNpcBarkIntent, type NpcBarkIntent } from './npcBarkPolicies'
import {
  type NpcVoiceResolveInput,
  type NpcVoiceSemanticIntent,
  resolveNpcVoiceLine,
} from './npcVoiceLines'

export type NpcBarkRequest = {
  npc: Pick<NpcVoiceResolveInput, 'id' | 'gender' | 'role' | 'age' | 'voiceProfileId'>
  position: WorldSoundPosition
  areaKey: string
  intent: NpcBarkIntent
  /** Simulation clock seconds (`NpcAgent.simClock`). */
  nowSim: number
  episodeKey?: string
  /**
   * Current weather type for `weather_shelter` (Q31): selects a
   * weather-specific clip first. Ignored by other intents; throttling is
   * always keyed by `intent`, never by the resolved variant.
   */
  weather?: WeatherType | null
}

export type NpcBarkDecision =
  | { accepted: true; url: string }
  | { accepted: false; reason: NpcBarkRejectReason | 'no-voice-asset' }

export type RequestNpcBark = (request: NpcBarkRequest) => NpcBarkDecision

/**
 * World-composition wiring (same shape as `configureNpcPlayerReactionAudio`) —
 * avoids threading the bark requester through the settlements positional DI
 * chain. Per-agent `deps.requestNpcBark` overrides this when set.
 */
let sharedRequestNpcBark: RequestNpcBark | null = null

/** Wire (or clear) the shared bark request function used by loaded NPCs. */
export function configureRequestNpcBark(request: RequestNpcBark | null): void {
  sharedRequestNpcBark = request
}

export function getSharedRequestNpcBark(): RequestNpcBark | null {
  return sharedRequestNpcBark
}

/**
 * Voice intents tried, in order, for a shelter bark in `weather` (Q31).
 * Weather-specific text wins over role specificity (a guard in snow prefers
 * a general snow line to a guard line that names the wrong weather); the
 * neutral `weather_shelter` pool is the last resort, and a missing clip is
 * silence. Storm may reuse rain lines (author, 2026-10-30); snow never does.
 */
export function weatherShelterVoiceIntents(
  weather: WeatherType | null | undefined,
): readonly NpcVoiceSemanticIntent[] {
  switch (weather) {
    case 'rain':
      return ['weather_shelter_rain', 'weather_shelter']
    case 'snow':
      return ['weather_shelter_snow', 'weather_shelter']
    case 'storm':
      return ['weather_shelter_storm', 'weather_shelter_rain', 'weather_shelter']
    default:
      return ['weather_shelter']
  }
}

/**
 * Resolve a bark URL for the requested intent. Shepherd `livestock_danger`
 * falls back to `danger_alert` when no livestock-specific asset exists, and
 * `weather_shelter` tries weather-specific variants first — explicit
 * request-layer aliases, not a generic resolver rewrite.
 */
export function resolveNpcBarkVoiceUrl(
  npc: NpcBarkRequest['npc'],
  intent: NpcBarkIntent,
  weather?: WeatherType | null,
  avoidUrl?: string,
): { url: string; resolvedIntent: NpcVoiceSemanticIntent } | undefined {
  const candidates: readonly NpcVoiceSemanticIntent[] =
    intent === 'weather_shelter'
      ? weatherShelterVoiceIntents(weather)
      : intent === 'livestock_danger'
        ? ['livestock_danger', 'danger_alert']
        : [intent]
  for (const candidate of candidates) {
    const url = resolveNpcVoiceLine(npc, candidate, avoidUrl)
    if (url) return { url, resolvedIntent: candidate }
  }
  return undefined
}

/**
 * Build a `RequestNpcBark` bound to one shared limiter instance.
 *
 * Order: resolve asset first (missing file does not spend budget) → admit →
 * play. Playback failure after admission is still a presentation-only event.
 */
export function createRequestNpcBark(limiter: NpcBarkLimiter): RequestNpcBark {
  return (request) => {
    if (!isNpcBarkIntent(request.intent)) {
      return { accepted: false, reason: 'unknown-intent' }
    }

    const resolved = resolveNpcBarkVoiceUrl(
      request.npc,
      request.intent,
      request.weather,
      limiter.lastClipUrl(request.areaKey, request.intent),
    )
    if (!resolved) return { accepted: false, reason: 'no-voice-asset' }

    const decision = limiter.tryAdmit({
      npcId: request.npc.id,
      areaKey: request.areaKey,
      intent: request.intent,
      nowSim: request.nowSim,
      episodeKey: request.episodeKey,
    })
    if (!decision.accepted) return decision

    limiter.noteClipPlayed(request.areaKey, request.intent, resolved.url, request.nowSim)
    playNpcVoiceAt(request.position, resolved.url)
    return { accepted: true, url: resolved.url }
  }
}
