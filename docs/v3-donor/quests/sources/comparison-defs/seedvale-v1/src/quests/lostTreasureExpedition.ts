import type { ItemInstance } from '../items/itemInstances'
import type { ItemKind } from '../items/items'
import type { NpcId } from '../settlement/npcState'
import type {
  CaveContentAnchorClaimRequest,
  CaveContentReservationRequests,
} from '../world/caves/caveAdventureContentPolicy'
import type { CaveArchetype } from '../world/caves/caveArchetype'
import type { CaveContentAnchor } from '../world/caves/caveContentAnchors'
import type { DungeonChamber } from '../world/caves/dungeonChambers'
import type { WorldGeneratedContainerSpec } from '../world/worldGeneratedContainers'
import type { CardinalSector } from './cardinalDirection'
import type { SettlementOpportunityNpc } from './opportunities/settlementNpcMaterialization'
import type { OpportunityNpc } from './opportunities/worldQuestOpportunityTypes'
import type { QuestDef, QuestDialogueReaction } from './quests'
import { rolledVillageSizeRank, type VillageSize } from '../settlement/families'
import { settlementNpcId } from '../settlement/npcIdentity'
import { caveWorldLocationId } from '../world/locations/darkForestTreasureSite'

/** Stable reservation-key prefix for lost-treasure-expedition anchor arbitration. */
export const LOST_TREASURE_EXPEDITION_RESERVATION_PREFIX = 'quests-progression-027'

export const LOST_TREASURE_EXPEDITION_CAMP_RESERVATION_KEY = `${LOST_TREASURE_EXPEDITION_RESERVATION_PREFIX}:camp`
export const LOST_TREASURE_EXPEDITION_JOURNAL_RESERVATION_KEY = `${LOST_TREASURE_EXPEDITION_RESERVATION_PREFIX}:journal`
export const LOST_TREASURE_EXPEDITION_EVIDENCE_RESERVATION_KEY = `${LOST_TREASURE_EXPEDITION_RESERVATION_PREFIX}:evidence`
export const LOST_TREASURE_EXPEDITION_FINAL_RESERVATION_KEY = `${LOST_TREASURE_EXPEDITION_RESERVATION_PREFIX}:final`

export const LOST_TREASURE_EXPEDITION_QUEST_PREFIX = 'world:lost-treasure-expedition:'

export const LOST_TREASURE_EXPEDITION_JOURNAL_TO_FAMILY_OUTCOME = 'journal_to_family'
export const LOST_TREASURE_EXPEDITION_JOURNAL_TO_SPONSOR_OUTCOME = 'journal_to_sponsor'
export const LOST_TREASURE_EXPEDITION_KEEP_JOURNAL_OUTCOME = 'keep_journal_and_treasure'

export const LOST_TREASURE_EXPEDITION_JOURNAL_KIND = 'expedition_journal' as const

/**
 * Flattened home-roster index of reserved Kasia Hornblower
 * (`Piotr`, `Anna`, `Marek`, `Kasia`). Household exclusion uses this
 * stable id, never display surname.
 *
 * @domain quests-progression
 */
export const HOME_KASIA_MEMBER_INDEX = 3

/**
 * Bounded neighboring settlement used by lost-treasure-expedition binding.
 * Identity and size come from `SettlementDef`; NPCs from
 * `settlementOpportunityNpcsFromDef` — no stream/camera dependency.
 *
 * @domain quests-progression
 */
export type LostTreasureExpeditionNeighborRef = {
  id: string
  name: string
  x: number
  z: number
  size: VillageSize
  npcs: readonly SettlementOpportunityNpc[]
}

/**
 * Presentation-only sponsor settlement wording. Derived at materialization
 * from authoritative settlement coordinates; never persisted.
 *
 * @domain quests-progression
 */
export type LostTreasureExpeditionSponsorPresentation = {
  settlementName: string
  sector: CardinalSector | null
}

function stableHash(text: string): number {
  let hash = 2166136261
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

/**
 * Derived world/quest binding — reconstructed on each boot, never persisted.
 *
 * @domain quests-progression
 */
export type LostTreasureExpeditionBinding = {
  questId: string
  settlementId: string
  sponsorSettlementId: string
  sponsorNpcId: NpcId
  stakeholderNpcId?: NpcId
  caveId: string
  caveLocationId: string
  campAnchorId: string
  journalAnchorId: string
  evidenceAnchorId: string
  finalTreasureAnchorId: string
  campContainerId: string
  journalContainerId: string
  evidenceContainerId: string
  finalTreasureContainerId: string
  journalInstanceId: string
}

export function lostTreasureExpeditionContainerId(anchorId: string): string {
  return `world-container:${LOST_TREASURE_EXPEDITION_RESERVATION_PREFIX}:${anchorId}`
}

export function lostTreasureExpeditionJournalInstanceId(caveId: string): string {
  return `quest:lost-treasure-expedition:${caveId}:journal`
}

export function lostTreasureExpeditionQuestId(
  settlementId: string,
  caveId: string,
  sponsorNpcId: NpcId,
  stakeholderNpcId?: NpcId,
): string {
  const suffix = stakeholderNpcId ? `:${sponsorNpcId}:${stakeholderNpcId}` : `:${sponsorNpcId}`
  return `${LOST_TREASURE_EXPEDITION_QUEST_PREFIX}${settlementId}:${caveId}${suffix}`
}

export function createLostTreasureExpeditionJournalInstance(caveId: string): ItemInstance {
  return { id: lostTreasureExpeditionJournalInstanceId(caveId), kind: LOST_TREASURE_EXPEDITION_JOURNAL_KIND }
}

const CAMP_SUPPLY: Partial<Record<ItemKind, number>> = {
  coin: 4,
  bandage: 1,
}

const JOURNAL_PACK_SUPPLY: Partial<Record<ItemKind, number>> = {
  coin: 6,
}

const EVIDENCE_SUPPLY: Partial<Record<ItemKind, number>> = {
  coin: 8,
  bandage: 1,
}

const FINAL_TREASURE_SUPPLY: Partial<Record<ItemKind, number>> = {
  coin: 50,
  ruby_medium: 1,
}

function adults(npcs: readonly SettlementOpportunityNpc[]): SettlementOpportunityNpc[] {
  return npcs.filter((npc) => !npc.child)
}

function byNpcId(a: SettlementOpportunityNpc, b: SettlementOpportunityNpc): number {
  return a.id.localeCompare(b.id)
}

/**
 * Canonical village-size rank for sponsor preference. `OUTPOST` sits below
 * every rolled size rather than being coerced to `RolledVillageSize`.
 *
 * @domain quests-progression
 */
export function lostTreasureExpeditionVillageSizeRank(size: VillageSize): number {
  if (size === 'OUTPOST') return -1
  return rolledVillageSizeRank(size)
}

function firstTrader(npcs: readonly SettlementOpportunityNpc[]): SettlementOpportunityNpc | undefined {
  return [...adults(npcs)].sort(byNpcId).find((npc) => npc.role === 'trader')
}

function firstAdult(npcs: readonly SettlementOpportunityNpc[]): SettlementOpportunityNpc | undefined {
  return [...adults(npcs)].sort(byNpcId)[0]
}

/**
 * Pre-079 identity-only sponsor/stakeholder pick. Quest id continues to
 * embed these ids so accepted saves do not strand when the operational
 * sponsor becomes an external Merchant.
 *
 * @domain quests-progression
 */
export function selectLegacyLostTreasureExpeditionIdentityNpcs(
  homeNpcs: readonly SettlementOpportunityNpc[],
  neighborNpcsBySettlement: ReadonlyMap<string, readonly SettlementOpportunityNpc[]> = new Map(),
): { sponsor: SettlementOpportunityNpc, stakeholder?: SettlementOpportunityNpc } | null {
  const homeAdults = adults(homeNpcs)
  if (homeAdults.length === 0) return null

  const sponsor = homeAdults.find((npc) => npc.role === 'trader')
    ?? homeAdults.find((npc) => npc.role === 'miner')
    ?? homeAdults[0]!

  const homeStakeholderPool = homeAdults
    .filter((npc) => npc.id !== sponsor.id && npc.householdId !== sponsor.householdId)
    .sort(byNpcId)
  if (homeStakeholderPool[0]) return { sponsor, stakeholder: homeStakeholderPool[0] }

  const neighborSettlementIds = [...neighborNpcsBySettlement.keys()].sort()
  for (const settlementId of neighborSettlementIds) {
    const pool = adults(neighborNpcsBySettlement.get(settlementId) ?? []).sort(byNpcId)
    if (pool[0]) return { sponsor, stakeholder: pool[0] }
  }

  return { sponsor }
}

function selectLocalStakeholder(
  homeSettlementId: string,
  homeNpcs: readonly SettlementOpportunityNpc[],
): SettlementOpportunityNpc | undefined {
  const homeAdults = [...adults(homeNpcs)].sort(byNpcId)
  if (homeAdults.length === 0) return undefined

  const kasia = homeNpcs.find((npc) => npc.id === settlementNpcId(homeSettlementId, HOME_KASIA_MEMBER_INDEX))
  if (kasia) {
    const outsideHousehold = homeAdults.filter((npc) => npc.householdId !== kasia.householdId)
    if (outsideHousehold[0]) return outsideHousehold[0]
    return homeAdults.find((npc) => npc.id !== kasia.id)
  }

  const firstHousehold = homeAdults[0]!.householdId
  const otherHousehold = homeAdults.find((npc) => npc.householdId !== firstHousehold)
  if (otherHousehold) return otherHousehold
  return homeAdults[1]
}

type OperationalLostTreasureExpeditionNpcs = {
  sponsor: SettlementOpportunityNpc
  sponsorSettlement: LostTreasureExpeditionNeighborRef
  stakeholder?: SettlementOpportunityNpc
}

/**
 * Deterministic external-sponsor / local-stakeholder selection. Sponsor is
 * never a home resident. Stakeholder is an adult home resident outside
 * Kasia Hornblower's household when that household can be resolved.
 *
 * @domain quests-progression
 */
export function selectLostTreasureExpeditionNpcs(
  homeSettlementId: string,
  homeSize: VillageSize,
  homeNpcs: readonly SettlementOpportunityNpc[],
  neighborSettlements: readonly LostTreasureExpeditionNeighborRef[],
): OperationalLostTreasureExpeditionNpcs | null {
  const homeRank = lostTreasureExpeditionVillageSizeRank(homeSize)

  const pickFrom = (
    predicate: (neighbor: LostTreasureExpeditionNeighborRef) => SettlementOpportunityNpc | undefined,
  ): OperationalLostTreasureExpeditionNpcs | null => {
    for (const neighbor of neighborSettlements) {
      const sponsor = predicate(neighbor)
      if (!sponsor) continue
      const stakeholder = selectLocalStakeholder(homeSettlementId, homeNpcs)
      return {
        sponsor,
        sponsorSettlement: neighbor,
        ...(stakeholder ? { stakeholder } : {}),
      }
    }
    return null
  }

  return pickFrom((neighbor) => (
    lostTreasureExpeditionVillageSizeRank(neighbor.size) > homeRank
      ? firstTrader(neighbor.npcs)
      : undefined
  ))
    ?? pickFrom((neighbor) => firstTrader(neighbor.npcs))
    ?? pickFrom((neighbor) => firstAdult(neighbor.npcs))
}

export type EligibleLostTreasureExpeditionCave = {
  caveId: string
  campAnchor: CaveContentAnchor
  journalAnchor: CaveContentAnchor
  evidenceAnchor: CaveContentAnchor
  finalTreasureAnchor: CaveContentAnchor
}

/**
 * Orders a dungeon's `storyFind` anchors from shallower to deeper progression
 * using `Caves.dungeonChambersOf()`'s own stable route order — never array
 * position or raw topology-node Y.
 *
 * @domain quests-progression
 */
function orderedStoryFindTrail(
  caveId: string,
  dungeonChambersOf: (caveId: string) => readonly DungeonChamber[],
  contentAnchors: readonly CaveContentAnchor[],
  reservedAnchorIds: ReadonlySet<string>,
): CaveContentAnchor[] {
  const chambers = dungeonChambersOf(caveId).filter((chamber) => (
    chamber.class === 'regular' || chamber.class === 'deep' || chamber.class === 'final'
  ))
  const caveAnchors = contentAnchors.filter((anchor) => anchor.caveId === caveId)
  const trail: CaveContentAnchor[] = []
  for (const chamber of chambers) {
    const anchor = caveAnchors.find((candidate) => (
      candidate.role === 'storyFind'
      && candidate.sourceNodeId === chamber.nodeId
      && !reservedAnchorIds.has(candidate.id)
    ))
    if (anchor) trail.push(anchor)
  }
  return trail
}

/**
 * Lists dungeons exposing an ordered `storyFind` trail (early camp, leader
 * pack, final evidence) plus an unclaimed `finalTreasure` anchor. Never
 * synthesizes a missing anchor — a dungeon short of either is ineligible.
 *
 * @domain quests-progression
 */
export function eligibleLostTreasureExpeditionCaves(
  caveIds: readonly string[],
  archetypeOf: (caveId: string) => CaveArchetype | null,
  dungeonChambersOf: (caveId: string) => readonly DungeonChamber[],
  contentAnchors: readonly CaveContentAnchor[],
  reservedAnchorIds: ReadonlySet<string> = new Set(),
): EligibleLostTreasureExpeditionCave[] {
  const eligible: EligibleLostTreasureExpeditionCave[] = []
  for (const caveId of [...caveIds].sort()) {
    if (archetypeOf(caveId) !== 'dungeon') continue
    const trail = orderedStoryFindTrail(caveId, dungeonChambersOf, contentAnchors, reservedAnchorIds)
    if (trail.length < 3) continue
    const finalTreasureAnchor = contentAnchors.find((anchor) => (
      anchor.caveId === caveId && anchor.role === 'finalTreasure' && !reservedAnchorIds.has(anchor.id)
    ))
    if (!finalTreasureAnchor) continue
    eligible.push({
      caveId,
      campAnchor: trail[0]!,
      journalAnchor: trail[1]!,
      evidenceAnchor: trail[trail.length - 1]!,
      finalTreasureAnchor,
    })
  }
  return eligible
}

/**
 * Resolves the lost-treasure-expedition binding from stable settlement/cave
 * identity. Emits declarative cave anchor claims; callers must feed them into
 * `resolveCaveAdventureContentPolicy` before container materialization.
 *
 * @domain quests-progression
 */
export function resolveLostTreasureExpeditionBinding(input: {
  worldSeed: number
  settlementId: string
  homeSize: VillageSize
  homeNpcs: readonly SettlementOpportunityNpc[]
  neighborSettlements?: readonly LostTreasureExpeditionNeighborRef[]
  caveIds: readonly string[]
  archetypeOf: (caveId: string) => CaveArchetype | null
  dungeonChambersOf: (caveId: string) => readonly DungeonChamber[]
  contentAnchors: readonly CaveContentAnchor[]
  reservedAnchorIds?: ReadonlySet<string>
}): LostTreasureExpeditionBinding | null {
  const neighborSettlements = input.neighborSettlements ?? []
  const npcPick = selectLostTreasureExpeditionNpcs(
    input.settlementId,
    input.homeSize,
    input.homeNpcs,
    neighborSettlements,
  )
  if (!npcPick) return null
  const eligible = eligibleLostTreasureExpeditionCaves(
    input.caveIds,
    input.archetypeOf,
    input.dungeonChambersOf,
    input.contentAnchors,
    input.reservedAnchorIds ?? new Set(),
  )
  if (eligible.length === 0) return null
  const pick = stableHash(
    `${input.worldSeed}\0${input.settlementId}\0lost-treasure-expedition`,
  ) % eligible.length
  const chosen = eligible[pick]!
  const neighborNpcsBySettlement = new Map(
    neighborSettlements.map((neighbor) => [neighbor.id, neighbor.npcs] as const),
  )
  const identityPick = selectLegacyLostTreasureExpeditionIdentityNpcs(
    input.homeNpcs,
    neighborNpcsBySettlement,
  )
  const questId = lostTreasureExpeditionQuestId(
    input.settlementId,
    chosen.caveId,
    identityPick?.sponsor.id ?? npcPick.sponsor.id,
    identityPick?.stakeholder?.id ?? npcPick.stakeholder?.id,
  )
  return {
    questId,
    settlementId: input.settlementId,
    sponsorSettlementId: npcPick.sponsorSettlement.id,
    sponsorNpcId: npcPick.sponsor.id,
    ...(npcPick.stakeholder ? { stakeholderNpcId: npcPick.stakeholder.id } : {}),
    caveId: chosen.caveId,
    caveLocationId: caveWorldLocationId(chosen.caveId),
    campAnchorId: chosen.campAnchor.id,
    journalAnchorId: chosen.journalAnchor.id,
    evidenceAnchorId: chosen.evidenceAnchor.id,
    finalTreasureAnchorId: chosen.finalTreasureAnchor.id,
    campContainerId: lostTreasureExpeditionContainerId(chosen.campAnchor.id),
    journalContainerId: lostTreasureExpeditionContainerId(chosen.journalAnchor.id),
    evidenceContainerId: lostTreasureExpeditionContainerId(chosen.evidenceAnchor.id),
    finalTreasureContainerId: lostTreasureExpeditionContainerId(chosen.finalTreasureAnchor.id),
    journalInstanceId: lostTreasureExpeditionJournalInstanceId(chosen.caveId),
  }
}

export function lostTreasureExpeditionAnchorClaims(
  binding: LostTreasureExpeditionBinding,
): readonly CaveContentAnchorClaimRequest[] {
  return [
    { reservationKey: LOST_TREASURE_EXPEDITION_CAMP_RESERVATION_KEY, anchorId: binding.campAnchorId },
    { reservationKey: LOST_TREASURE_EXPEDITION_JOURNAL_RESERVATION_KEY, anchorId: binding.journalAnchorId },
    { reservationKey: LOST_TREASURE_EXPEDITION_EVIDENCE_RESERVATION_KEY, anchorId: binding.evidenceAnchorId },
    { reservationKey: LOST_TREASURE_EXPEDITION_FINAL_RESERVATION_KEY, anchorId: binding.finalTreasureAnchorId },
  ]
}

export function lostTreasureExpeditionCaveReservationRequests(
  binding: LostTreasureExpeditionBinding,
): CaveContentReservationRequests {
  return { anchorClaims: lostTreasureExpeditionAnchorClaims(binding) }
}

/**
 * True when every expected reservation key resolved to the binding's anchors.
 *
 * @domain quests-progression
 */
export function lostTreasureExpeditionClaimsMatch(
  binding: LostTreasureExpeditionBinding,
  claimOf: (reservationKey: string) => { anchorId: string, caveId: string } | undefined,
): boolean {
  for (const claim of lostTreasureExpeditionAnchorClaims(binding)) {
    const resolved = claimOf(claim.reservationKey)
    if (!resolved || resolved.anchorId !== claim.anchorId || resolved.caveId !== binding.caveId) return false
  }
  return true
}

function anchorContainerSpec(
  containerId: string,
  anchor: CaveContentAnchor,
  caveId: string,
  initialCounts: Partial<Record<ItemKind, number>>,
  initialInstances?: readonly ItemInstance[],
): WorldGeneratedContainerSpec {
  return {
    id: containerId,
    kind: 'chest',
    x: anchor.x,
    y: anchor.y,
    z: anchor.z,
    yaw: anchor.yaw,
    initialCounts,
    ...(initialInstances ? { initialInstances } : {}),
    spatialContext: { kind: 'cave', caveId },
  }
}

/**
 * World-generated expedition content at the claimed dungeon `storyFind` /
 * `finalTreasure` anchors. Ordinary loot plus the journal instance in the
 * leader-pack container; exists before quest acceptance.
 *
 * @domain quests-progression
 */
export function lostTreasureExpeditionContainerSpecs(
  binding: LostTreasureExpeditionBinding,
  contentAnchors: readonly CaveContentAnchor[],
): WorldGeneratedContainerSpec[] {
  const byId = new Map(contentAnchors.map((anchor) => [anchor.id, anchor]))
  const camp = byId.get(binding.campAnchorId)
  const journal = byId.get(binding.journalAnchorId)
  const evidence = byId.get(binding.evidenceAnchorId)
  const finalTreasure = byId.get(binding.finalTreasureAnchorId)
  if (!camp || !journal || !evidence || !finalTreasure) return []
  return [
    anchorContainerSpec(binding.campContainerId, camp, binding.caveId, CAMP_SUPPLY),
    anchorContainerSpec(binding.journalContainerId, journal, binding.caveId, JOURNAL_PACK_SUPPLY, [
      createLostTreasureExpeditionJournalInstance(binding.caveId),
    ]),
    anchorContainerSpec(binding.evidenceContainerId, evidence, binding.caveId, EVIDENCE_SUPPLY),
    anchorContainerSpec(binding.finalTreasureContainerId, finalTreasure, binding.caveId, FINAL_TREASURE_SUPPLY),
  ]
}

export function isLostTreasureExpeditionJournalPackLooted(
  instances: readonly { id: string }[],
  journalInstanceId: string,
): boolean {
  return !instances.some((instance) => instance.id === journalInstanceId)
}

function suppliesLooted(
  counts: Partial<Record<string, number>>,
  supply: Partial<Record<ItemKind, number>>,
): boolean {
  return (Object.keys(supply) as ItemKind[]).every((kind) => (counts[kind] ?? 0) === 0)
}

export function isLostTreasureExpeditionCampLooted(counts: Partial<Record<string, number>>): boolean {
  return suppliesLooted(counts, CAMP_SUPPLY)
}

export function isLostTreasureExpeditionEvidenceLooted(counts: Partial<Record<string, number>>): boolean {
  return suppliesLooted(counts, EVIDENCE_SUPPLY)
}

export function isLostTreasureExpeditionFinalTreasureLooted(counts: Partial<Record<string, number>>): boolean {
  return suppliesLooted(counts, FINAL_TREASURE_SUPPLY)
}

function sponsorVisitLabel(
  sponsorName: string,
  settlementName: string,
  sector: CardinalSector | null,
): string {
  return sector
    ? `${sponsorName} w ${settlementName} (${sector})`
    : `${sponsorName} w ${settlementName}`
}

/**
 * Materializes the lost-treasure-expedition quest for one resolved binding.
 *
 * @domain quests-progression
 */
export function buildLostTreasureExpeditionQuest(
  binding: LostTreasureExpeditionBinding,
  npcs: readonly OpportunityNpc[],
  settlementName: string,
  caveDescription: string,
  sponsorPresentation?: LostTreasureExpeditionSponsorPresentation,
): QuestDef {
  const sponsor = npcs.find((npc) => npc.id === binding.sponsorNpcId)
  const stakeholder = binding.stakeholderNpcId
    ? npcs.find((npc) => npc.id === binding.stakeholderNpcId)
    : undefined
  const sponsorName = sponsor?.name ?? 'Kupiec'
  const stakeholderName = stakeholder?.name ?? 'Mieszkaniec'
  const sponsorSettlementName = sponsorPresentation?.settlementName ?? settlementName
  const sponsorSector = sponsorPresentation?.sector ?? null
  const visitLabel = sponsorVisitLabel(sponsorName, sponsorSettlementName, sponsorSector)
  const giverNpcId = binding.stakeholderNpcId ?? binding.sponsorNpcId
  const giverName = binding.stakeholderNpcId ? stakeholderName : sponsorName

  const dialogueActions: NonNullable<QuestDef['stages'][number]['dialogueActions']>[number][] = []
  if (binding.stakeholderNpcId) {
    const contactWarmth: QuestDialogueReaction = {
      when: [{ type: 'relation', npc: { npcId: binding.stakeholderNpcId }, minimum: 'friendly' }],
      npcLine: 'Przyniosłeś go tutaj. Dobrze. Bałem się, że już nikt go nie zobaczy.',
      consequences: { relations: [{ npc: { npcId: binding.stakeholderNpcId }, delta: 1 }] },
    }
    dialogueActions.push({
      npc: { npcId: binding.stakeholderNpcId },
      playerLine: `Znalazłem dziennik zaginionej wyprawy. Oddaję go tobie, ${stakeholderName}.`,
      npcLine: 'Dziękuję. Przynajmniej będziemy wiedzieć, co się z nimi naprawdę stało.',
      physicalOutcomeId: LOST_TREASURE_EXPEDITION_JOURNAL_TO_FAMILY_OUTCOME,
      requireItemInstanceId: binding.journalInstanceId,
      reactions: [contactWarmth],
    })
  }
  const sponsorRecognition: QuestDialogueReaction = {
    when: [{ type: 'reputation', dimension: 'competence', minimum: 5 }],
    npcLine: 'Wiedziałem, że jeśli ktoś zamknie tę sprawę, to ty. Zostaw dziennik.',
  }
  dialogueActions.push({
    npc: { npcId: binding.sponsorNpcId },
    playerLine: `Oto dziennik wyprawy, którą sfinansowałeś, ${sponsorName}.`,
    npcLine: 'Dobrze. Ta historia zasługuje na formalne zamknięcie — i zapłatę dla ciebie.',
    physicalOutcomeId: LOST_TREASURE_EXPEDITION_JOURNAL_TO_SPONSOR_OUTCOME,
    requireItemInstanceId: binding.journalInstanceId,
    reactions: [sponsorRecognition],
  })
  const keepJournalReactions: readonly QuestDialogueReaction[] = [
    {
      when: [{ type: 'relation', npc: { npcId: binding.sponsorNpcId }, minimum: 'friendly' }],
      npcLine: 'Tobie powierzyłem tę wyprawę do końca. Dziennik też był częścią tej sprawy.',
      consequences: { relations: [{ npc: { npcId: binding.sponsorNpcId }, delta: -1 }] },
    },
    {
      when: [{ type: 'reputation', dimension: 'integrity', maximum: 0 }],
      npcLine: 'Czyli jednak coś miało zostać tylko dla ciebie.',
    },
  ]
  dialogueActions.push({
    npc: { npcId: binding.sponsorNpcId },
    playerLine: 'Skarb jest twój, ale dziennik wyprawy zostaje przy mnie.',
    npcLine: 'Skarb miał wrócić z nimi, ale przynajmniej trafił w czyjeś ręce. Resztę zachowaj dla siebie.',
    physicalOutcomeId: LOST_TREASURE_EXPEDITION_KEEP_JOURNAL_OUTCOME,
    requireItemInstanceId: binding.journalInstanceId,
    reactions: [...keepJournalReactions],
  })

  const revealDungeon = {
    type: 'reveal_location' as const,
    locationId: binding.caveLocationId,
    setNavigation: true,
  }

  const stages: QuestDef['stages'][number][] = [
    {
      objective: { type: 'talk_to_npc', npc: { npcId: binding.sponsorNpcId } },
      description: `Porozmawiaj z ${visitLabel}.`,
      reminderLine: `Kupiec ${visitLabel} zlecił odnalezienie zaginionej wyprawy.`,
      playerLine: 'Słyszałem, że sfinansowałeś wyprawę po legendarny skarb, która nie wróciła.',
      progressLine: binding.stakeholderNpcId
        ? `Wyprawa, którą sfinansowałem, nie wróciła. Dokładnego miejsca nie znam — ${stakeholderName} w twojej osadzie był z nimi związany i może wiedzieć więcej.`
        : `Wyprawa nie wróciła. Ostatni raz widziano ją przy wejściu tutaj: ${caveDescription}.`,
      ...(binding.stakeholderNpcId ? {} : { effects: [revealDungeon] }),
    },
  ]
  if (binding.stakeholderNpcId) {
    stages.push({
      objective: { type: 'talk_to_npc', npc: { npcId: binding.stakeholderNpcId } },
      description: `Porozmawiaj z ${stakeholderName} — zna lokalne szczegóły wyprawy.`,
      reminderLine: `${stakeholderName} powinien wiedzieć, dokąd wyruszyła wyprawa.`,
      playerLine: `${sponsorName} zlecił mi odnalezienie wyprawy. Czy wiesz, dokąd wyruszyli?`,
      progressLine:
        `Znaliśmy ich osobiście. Ostatni raz widziano wyprawę tutaj: ${caveDescription}.`,
      effects: [revealDungeon],
    })
  }
  stages.push(
    {
      objective: { type: 'loot_world_container', containerId: binding.campContainerId },
      description: 'Znajdź porzucony obóz wyprawy przy wejściu do lochu.',
      reminderLine: 'Przy wejściu do lochu powinien leżeć porzucony obóz wyprawy.',
      progressLine: 'Obóz jest opuszczony, ale wyprawa dotarła dalej. Trzeba iść głębiej.',
    },
    {
      objective: { type: 'loot_world_container', containerId: binding.journalContainerId },
      description: 'Odnajdź tobół dowódcy wyprawy z dziennikiem.',
      reminderLine: 'Głębiej w lochu powinien leżeć tobół dowódcy z dziennikiem wyprawy.',
      progressLine: 'Dziennik dowódcy opisuje ostatnie dni wyprawy — skarb miał być jeszcze głębiej.',
    },
    {
      objective: { type: 'loot_world_container', containerId: binding.evidenceContainerId },
      description: 'Odnajdź ostatnie ślady wyprawy — osobiste rzeczy uczestników.',
      reminderLine: 'Najgłębsza część lochu powinna kryć ostatnie osobiste rzeczy wyprawy.',
      progressLine: 'To koniec wyprawy. Prawdziwy skarb musi być bardzo blisko.',
    },
    {
      objective: { type: 'loot_world_container', containerId: binding.finalTreasureContainerId },
      description: `Odnajdź legendarny skarb, po który wysłał ich ${sponsorName}.`,
      reminderLine: 'Skarb powinien być w najgłębszej części lochu.',
      progressLine: 'Skarb jest prawdziwy i należy teraz do ciebie. Zostaje decyzja, co zrobić z dziennikiem.',
    },
    {
      objective: { type: 'await_quest_outcome' },
      description: binding.stakeholderNpcId
        ? `Zdecyduj, komu przekazać dziennik wyprawy — ${stakeholderName}, ${sponsorName}, albo zatrzymaj go dla siebie.`
        : `Zdecyduj, czy oddać dziennik wyprawy ${sponsorName}, czy zatrzymać go dla siebie.`,
      reminderLine: 'Dziennik wyprawy wciąż wymaga decyzji.',
      dialogueActions,
    },
  )

  const outcomes: QuestDef['outcomes'][number][] = []
  if (binding.stakeholderNpcId) {
    outcomes.push({
      id: LOST_TREASURE_EXPEDITION_JOURNAL_TO_FAMILY_OUTCOME,
      state: 'complete',
      resultText: 'Dziennik wyprawy wrócił do osoby związanej z uczestnikami. Skarb zostaje przy tobie.',
      consequences: {
        relations: [{ npc: { npcId: binding.stakeholderNpcId }, delta: 3 }],
        social: {
          reputation: { trust: 4, benevolence: 5, integrity: 3 },
          renown: 2,
        },
      },
    })
  }
  outcomes.push({
    id: LOST_TREASURE_EXPEDITION_JOURNAL_TO_SPONSOR_OUTCOME,
    state: 'complete',
    resultText: 'Dziennik trafił do sponsora wyprawy, wraz z zapłatą za odnalezienie prawdy. Skarb zostaje przy tobie.',
    reward: { visibility: 'shown', items: [{ kind: 'coin', count: 25 }] },
    consequences: {
      relations: [
        { npc: { npcId: binding.sponsorNpcId }, delta: 3 },
        ...(binding.stakeholderNpcId ? [{ npc: { npcId: binding.stakeholderNpcId }, delta: -1 }] : []),
      ],
      social: {
        reputation: { competence: 3, integrity: 2 },
        renown: 3,
      },
    },
  })
  outcomes.push({
    id: LOST_TREASURE_EXPEDITION_KEEP_JOURNAL_OUTCOME,
    state: 'complete',
    resultText: 'Skarb i dziennik zostają przy tobie. Prawda o losie wyprawy nigdy do nikogo nie trafia.',
    consequences: {
      relations: [
        { npc: { npcId: binding.sponsorNpcId }, delta: -2 },
        ...(binding.stakeholderNpcId ? [{ npc: { npcId: binding.stakeholderNpcId }, delta: -2 }] : []),
      ],
      social: {
        reputation: { trust: -2, integrity: -3 },
        renown: 1,
      },
    },
  })

  return {
    id: binding.questId,
    title: 'Zaginiona wyprawa po skarb',
    description:
      `${sponsorName} z osady ${sponsorSettlementName} sfinansował wyprawę po legendarny skarb, `
      + 'która nigdy nie wróciła.',
    giverName,
    giver: { npcId: giverNpcId },
    settlementId: binding.settlementId,
    offerLine: binding.stakeholderNpcId
      ? `Kupiec ${visitLabel} sfinansował wyprawę po skarb, która nie wróciła. Porozmawiaj z nim — on zleci odnalezienie wyprawy.`
      : `Wysłałem ludzi po legendarny skarb. To ${caveDescription}. Nie wrócili, `
        + 'a ja wciąż nie wiem, co się z nimi stało.',
    stages,
    reportLine: 'Sprawa zaginionej wyprawy ma wreszcie zakończenie.',
    outcomes,
    // The carried journal's own family/sponsor/keep choice IS the resolution
    // (plan quests-progression-033) — a generic opt-out here would strand
    // that carried instance outside any quest tracking.
    abandonment: { allowed: false },
  }
}
