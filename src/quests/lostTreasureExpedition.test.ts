/** Plan quests-progression-027 — lost treasure expedition binding/content tests. */

import { Scene } from 'three'
import { describe, expect, it } from 'vitest'
import type { CaveContentAnchor } from '../world/caves/caveContentAnchors'
import type { DungeonChamber } from '../world/caves/dungeonChambers'
import type { SettlementOpportunityNpc } from './opportunities/settlementNpcMaterialization'
import type { QuestSocialAvailabilityLookup } from './QuestManager'
import { Inventory } from '../items/Inventory'
import { settlementNpcId } from '../settlement/npcIdentity'
import { resolveCaveAdventureContentPolicy } from '../world/caves/caveAdventureContentPolicy'
import { createWorldGeneratedContainers } from '../world/worldGeneratedContainers'
import { cardinalSector } from './cardinalDirection'
import {
  DUNGEON_BANDIT_DEEP_RESERVATION_KEY,
  dungeonBanditCaveReservationRequests,
  resolveDungeonBanditTreasureBinding,
} from './dungeonBanditTreasure'
import {
  buildLostTreasureExpeditionQuest,
  createLostTreasureExpeditionJournalInstance,
  eligibleLostTreasureExpeditionCaves,
  HOME_KASIA_MEMBER_INDEX,
  isLostTreasureExpeditionJournalPackLooted,
  LOST_TREASURE_EXPEDITION_FINAL_RESERVATION_KEY,
  LOST_TREASURE_EXPEDITION_JOURNAL_TO_FAMILY_OUTCOME,
  LOST_TREASURE_EXPEDITION_JOURNAL_TO_SPONSOR_OUTCOME,
  LOST_TREASURE_EXPEDITION_KEEP_JOURNAL_OUTCOME,
  lostTreasureExpeditionCaveReservationRequests,
  lostTreasureExpeditionClaimsMatch,
  lostTreasureExpeditionContainerSpecs,
  lostTreasureExpeditionJournalInstanceId,
  type LostTreasureExpeditionNeighborRef,
  lostTreasureExpeditionQuestId,
  resolveLostTreasureExpeditionBinding,
  selectLegacyLostTreasureExpeditionIdentityNpcs,
  selectLostTreasureExpeditionNpcs,
} from './lostTreasureExpedition'
import { QuestManager } from './QuestManager'
import { validateQuestDefinitions } from './quests'

function npc(
  id: string,
  role: SettlementOpportunityNpc['role'],
  householdId: string,
  child = false,
): SettlementOpportunityNpc {
  return { id, name: id, role, child, householdId, familyIndex: 0 }
}

function chamber(nodeId: string, cls: DungeonChamber['class']): DungeonChamber {
  return { nodeId, class: cls, position: { x: 0, y: 0, z: 0 }, targetWidth: 6, targetHeight: 3 }
}

const DUNGEON_ROUTE_CHAMBERS: DungeonChamber[] = [
  chamber('dungeon-chamber-1', 'entrance-adjacent'),
  chamber('dungeon-side-chamber-1', 'side'),
  chamber('dungeon-chamber-2', 'regular'),
  chamber('dungeon-side-chamber-2', 'side'),
  chamber('dungeon-chamber-3', 'regular'),
  chamber('dungeon-deep-chamber', 'deep'),
  chamber('dungeon-final-chamber', 'final'),
]

function dungeonAnchor(
  caveId: string,
  role: CaveContentAnchor['role'],
  sourceNodeId: string,
  offset = 0,
): CaveContentAnchor {
  return {
    id: `${caveId}:${role}:${sourceNodeId}`,
    caveId,
    role,
    sourceNodeId,
    x: 10 + offset,
    y: -6 + offset,
    z: 20 + offset,
    yaw: 0.25,
  }
}

function neighbor(
  id: string,
  size: LostTreasureExpeditionNeighborRef['size'],
  npcs: SettlementOpportunityNpc[],
  extras: { name?: string, x?: number, z?: number } = {},
): LostTreasureExpeditionNeighborRef {
  return {
    id,
    name: extras.name ?? 'Brzeziny',
    x: extras.x ?? 100,
    z: extras.z ?? 0,
    size,
    npcs,
  }
}

describe('lost treasure expedition (plan quests-progression-027)', () => {
  const dungeonId = 'cave:dungeon-a'
  const dungeonChambersOf = (caveId: string): readonly DungeonChamber[] => (
    caveId === dungeonId ? DUNGEON_ROUTE_CHAMBERS : []
  )
  const anchors: CaveContentAnchor[] = [
    dungeonAnchor(dungeonId, 'storyFind', 'dungeon-chamber-2', 0),
    dungeonAnchor(dungeonId, 'storyFind', 'dungeon-chamber-3', 1),
    dungeonAnchor(dungeonId, 'storyFind', 'dungeon-deep-chamber', 2),
    dungeonAnchor(dungeonId, 'storyFind', 'dungeon-final-chamber', 3),
    dungeonAnchor(dungeonId, 'loot', 'dungeon-deep-chamber', 4),
    dungeonAnchor(dungeonId, 'finalTreasure', 'dungeon-final-chamber', 5),
    dungeonAnchor('cave:natural', 'storyFind', 'chamber', 6),
  ]
  const defaultNeighbors = [
    neighbor('1_0', 'LG', [npc('1_0:npc:0', 'trader', 'house-x')]),
  ]
  const bindingInput = (
    overrides: Partial<Parameters<typeof resolveLostTreasureExpeditionBinding>[0]> = {},
  ) => ({
    worldSeed: 13,
    settlementId: 'home',
    homeSize: 'SM' as const,
    homeNpcs: [npc('home:npc:0', 'trader', 'house-a'), npc('home:npc:1', 'farmer', 'house-b')],
    neighborSettlements: defaultNeighbors,
    caveIds: [dungeonId],
    archetypeOf: () => 'dungeon' as const,
    dungeonChambersOf,
    contentAnchors: anchors,
    ...overrides,
  })

  it('selects a larger neighboring Merchant as sponsor and a local stakeholder', () => {
    const pick = selectLostTreasureExpeditionNpcs('home', 'SM', [
      npc('home:npc:0', 'farmer', 'house-a'),
      npc('home:npc:1', 'trader', 'house-b'),
      npc('home:npc:2', 'guard', 'house-a'),
    ], [
      neighbor('1_0', 'LG', [npc('1_0:npc:0', 'trader', 'house-x')]),
    ])
    expect(pick?.sponsor.id).toBe('1_0:npc:0')
    expect(pick?.sponsorSettlement.id).toBe('1_0')
    expect(pick?.stakeholder?.id).toBe('home:npc:1')
  })

  it('prefers a larger nearby Merchant over a closer smaller Merchant', () => {
    const pick = selectLostTreasureExpeditionNpcs('home', 'SM', [
      npc('home:npc:0', 'farmer', 'house-a'),
      npc('home:npc:1', 'farmer', 'house-b'),
    ], [
      neighbor('0_1', 'SM', [npc('0_1:npc:0', 'trader', 'house-y')]),
      neighbor('1_0', 'LG', [npc('1_0:npc:0', 'trader', 'house-x')]),
    ])
    expect(pick?.sponsor.id).toBe('1_0:npc:0')
  })

  it('falls back to a Merchant from another nearby settlement when none is larger', () => {
    const pick = selectLostTreasureExpeditionNpcs('home', 'XL', [
      npc('home:npc:0', 'miner', 'house-a'),
      npc('home:npc:1', 'farmer', 'house-b'),
    ], [
      neighbor('0_1', 'SM', [npc('0_1:npc:0', 'farmer', 'house-y')]),
      neighbor('1_0', 'MD', [npc('1_0:npc:0', 'trader', 'house-x')]),
    ])
    expect(pick?.sponsor.id).toBe('1_0:npc:0')
  })

  it('falls back to a deterministic external adult when no Merchant exists', () => {
    const pick = selectLostTreasureExpeditionNpcs('home', 'SM', [
      npc('home:npc:0', 'trader', 'house-a'),
      npc('home:npc:1', 'farmer', 'house-b'),
    ], [
      neighbor('1_0', 'LG', [npc('1_0:npc:0', 'farmer', 'house-x')]),
    ])
    expect(pick?.sponsor.id).toBe('1_0:npc:0')
    expect(pick?.sponsor.role).toBe('farmer')
  })

  it('does not bind when the nearby pool has no external adult', () => {
    expect(selectLostTreasureExpeditionNpcs('home', 'SM', [
      npc('home:npc:0', 'trader', 'house-a'),
    ], [])).toBeNull()
    expect(selectLostTreasureExpeditionNpcs('home', 'SM', [
      npc('home:npc:0', 'trader', 'house-a'),
    ], [
      neighbor('1_0', 'LG', [npc('1_0:npc:0', 'farmer', 'house-x', true)]),
    ])).toBeNull()
  })

  it('excludes Kasia Hornblower household by stable identity, not surname', () => {
    const kasiaId = settlementNpcId('home', HOME_KASIA_MEMBER_INDEX)
    const marekId = settlementNpcId('home', 2)
    const pick = selectLostTreasureExpeditionNpcs('home', 'SM', [
      npc(settlementNpcId('home', 0), 'farmer', 'family-reserved-0'),
      npc(settlementNpcId('home', 1), 'farmer', 'family-reserved-0'),
      npc(marekId, 'guard', 'family-reserved-1'),
      npc(kasiaId, 'trader', 'family-reserved-1'),
      npc(settlementNpcId('home', 4), 'farmer', 'house-c'),
    ], defaultNeighbors)
    expect(pick?.stakeholder?.id).toBe(settlementNpcId('home', 0))
    expect(pick?.stakeholder?.householdId).not.toBe('family-reserved-1')
  })

  it('orders the storyFind trail from shallow to deep and requires an unclaimed finalTreasure', () => {
    const eligible = eligibleLostTreasureExpeditionCaves(
      [dungeonId, 'cave:natural'],
      (caveId) => (caveId === dungeonId ? 'dungeon' : 'natural'),
      dungeonChambersOf,
      anchors,
    )
    expect(eligible).toHaveLength(1)
    expect(eligible[0]!.campAnchor.sourceNodeId).toBe('dungeon-chamber-2')
    expect(eligible[0]!.journalAnchor.sourceNodeId).toBe('dungeon-chamber-3')
    expect(eligible[0]!.evidenceAnchor.sourceNodeId).toBe('dungeon-final-chamber')
    expect(eligible[0]!.finalTreasureAnchor.role).toBe('finalTreasure')
  })

  it('is ineligible when the storyFind trail is too short', () => {
    const shortAnchors = anchors.filter((a) => (
      a.role !== 'storyFind' || (a.sourceNodeId !== 'dungeon-final-chamber' && a.sourceNodeId !== 'dungeon-deep-chamber')
    ))
    const eligible = eligibleLostTreasureExpeditionCaves(
      [dungeonId],
      () => 'dungeon',
      dungeonChambersOf,
      shortAnchors,
    )
    expect(eligible).toHaveLength(0)
  })

  it('resolves deterministically', () => {
    const input = bindingInput()
    const first = resolveLostTreasureExpeditionBinding(input)
    const second = resolveLostTreasureExpeditionBinding(input)
    expect(first).toEqual(second)
    expect(first?.caveId).toBe(dungeonId)
    expect(first?.sponsorNpcId).toBe('1_0:npc:0')
    expect(first?.stakeholderNpcId).toBe('home:npc:1')
  })

  it('materializes journal instance only in the leader-pack container and suppresses reseed', () => {
    const binding = resolveLostTreasureExpeditionBinding(bindingInput({ worldSeed: 3 }))!
    const specs = lostTreasureExpeditionContainerSpecs(binding, anchors)
    expect(specs).toHaveLength(4)
    const journalSpec = specs.find((spec) => spec.id === binding.journalContainerId)!
    expect(journalSpec.initialInstances?.map((i) => i.id)).toEqual([binding.journalInstanceId])
    expect(specs.filter((spec) => spec.id !== binding.journalContainerId)
      .every((spec) => !spec.initialInstances?.length)).toBe(true)

    const scene = new Scene()
    const fresh = createWorldGeneratedContainers(scene, () => 0, [journalSpec])
    expect(fresh.containerInstances(journalSpec.id, 'expedition_journal')[0]?.id).toBe(binding.journalInstanceId)
    const looted = createWorldGeneratedContainers(scene, () => 0, [journalSpec], [{
      id: journalSpec.id,
      x: journalSpec.x,
      z: journalSpec.z,
      yaw: journalSpec.yaw,
      counts: { coin: 1 },
      instances: [],
    }])
    expect(looted.containerInstances(journalSpec.id, 'expedition_journal')).toEqual([])
    fresh.dispose()
    looted.dispose()
  })

  it('tracks the journal by exact instance identity', () => {
    const journalId = lostTreasureExpeditionJournalInstanceId(dungeonId)
    const journal = createLostTreasureExpeditionJournalInstance(dungeonId)
    expect(isLostTreasureExpeditionJournalPackLooted([journal], journalId)).toBe(false)
    expect(isLostTreasureExpeditionJournalPackLooted([], journalId)).toBe(true)

    const player = new Inventory({}, 100, [journal])
    expect(player.getInstance(journalId)?.kind).toBe('expedition_journal')
  })

  it('builds stakeholder / sponsor / keep outcomes and the ordered loot stages', () => {
    const binding = resolveLostTreasureExpeditionBinding(bindingInput({ worldSeed: 5 }))!
    const def = buildLostTreasureExpeditionQuest(binding, [
      npc('home:npc:0', 'trader', 'house-a'),
      npc('home:npc:1', 'farmer', 'house-b'),
      npc('1_0:npc:0', 'trader', 'house-x'),
    ], 'Osada', 'stary loch na wschód od osady', {
      settlementName: 'Brzeziny',
      sector: 'E',
    })
    expect(def.giver.npcId).toBe(binding.stakeholderNpcId)
    expect(def.offerLine).toContain('Brzeziny (E)')
    expect(def.offerLine).not.toMatch(/stary loch/)
    expect(`${def.offerLine} ${def.description} ${def.stages[0]?.progressLine}`).not.toMatch(/konkretn|dokładny loch|rodzin|krewny/i)
    expect(def.outcomes.map((outcome) => outcome.id)).toEqual([
      LOST_TREASURE_EXPEDITION_JOURNAL_TO_FAMILY_OUTCOME,
      LOST_TREASURE_EXPEDITION_JOURNAL_TO_SPONSOR_OUTCOME,
      LOST_TREASURE_EXPEDITION_KEEP_JOURNAL_OUTCOME,
    ])
    const lootContainerIds = def.stages
      .map((stage) => stage.objective)
      .filter((objective) => objective.type === 'loot_world_container')
      .map((objective) => (objective as { containerId: string }).containerId)
    expect(lootContainerIds).toEqual([
      binding.campContainerId,
      binding.journalContainerId,
      binding.evidenceContainerId,
      binding.finalTreasureContainerId,
    ])
  })

  it('reduces to sponsor / keep outcomes when no second stakeholder exists', () => {
    const binding = resolveLostTreasureExpeditionBinding(bindingInput({
      worldSeed: 5,
      homeNpcs: [npc('home:npc:0', 'trader', 'house-a')],
    }))!
    expect(binding.stakeholderNpcId).toBeUndefined()
    const def = buildLostTreasureExpeditionQuest(
      binding,
      [npc('home:npc:0', 'trader', 'house-a'), npc('1_0:npc:0', 'trader', 'house-x')],
      'Osada',
      'stary loch poza osadą',
    )
    expect(def.outcomes.map((outcome) => outcome.id)).toEqual([
      LOST_TREASURE_EXPEDITION_JOURNAL_TO_SPONSOR_OUTCOME,
      LOST_TREASURE_EXPEDITION_KEEP_JOURNAL_OUTCOME,
    ])
  })

  it('coexists with quest 026 on the same dungeon through disjoint anchor claims', () => {
    const banditBinding = resolveDungeonBanditTreasureBinding({
      worldSeed: 9,
      settlementId: 'home',
      homeNpcs: [npc('home:npc:0', 'guard', 'house-a'), npc('home:npc:1', 'trader', 'house-b')],
      caveIds: [dungeonId],
      archetypeOf: () => 'dungeon',
      contentAnchors: anchors,
    })!
    const expeditionBinding = resolveLostTreasureExpeditionBinding(bindingInput({
      worldSeed: 9,
      homeNpcs: [npc('home:npc:0', 'guard', 'house-a'), npc('home:npc:1', 'trader', 'house-b')],
    }))!
    const policy = resolveCaveAdventureContentPolicy([], anchors, {
      anchorClaims: [
        ...(dungeonBanditCaveReservationRequests(banditBinding).anchorClaims ?? []),
        ...(lostTreasureExpeditionCaveReservationRequests(expeditionBinding).anchorClaims ?? []),
      ],
    })
    expect(policy.unresolved).toEqual([])
    expect(policy.claimOf(DUNGEON_BANDIT_DEEP_RESERVATION_KEY)?.anchorId).toBe(banditBinding.deepLootAnchorId)
    expect(policy.claimOf(LOST_TREASURE_EXPEDITION_FINAL_RESERVATION_KEY)?.anchorId).toBe(
      expeditionBinding.finalTreasureAnchorId,
    )
    expect(lostTreasureExpeditionClaimsMatch(expeditionBinding, (key) => policy.claimOf(key))).toBe(true)
  })
})

describe('lost treasure expedition external sponsor flow (plan quests-progression-079)', () => {
  const dungeonId = 'cave:dungeon-a'
  const dungeonChambersOf = (caveId: string): readonly DungeonChamber[] => (
    caveId === dungeonId ? DUNGEON_ROUTE_CHAMBERS : []
  )
  const anchors: CaveContentAnchor[] = [
    dungeonAnchor(dungeonId, 'storyFind', 'dungeon-chamber-2', 0),
    dungeonAnchor(dungeonId, 'storyFind', 'dungeon-chamber-3', 1),
    dungeonAnchor(dungeonId, 'storyFind', 'dungeon-deep-chamber', 2),
    dungeonAnchor(dungeonId, 'storyFind', 'dungeon-final-chamber', 3),
    dungeonAnchor(dungeonId, 'finalTreasure', 'dungeon-final-chamber', 5),
  ]
  const homeNpcs = [
    npc(settlementNpcId('home', 0), 'farmer', 'family-reserved-0'),
    npc(settlementNpcId('home', 1), 'trader', 'family-reserved-0'),
    npc(settlementNpcId('home', 2), 'guard', 'family-reserved-1'),
    npc(settlementNpcId('home', 3), 'trader', 'family-reserved-1'),
  ]

  it('keeps the pre-079 quest id while the operational sponsor is external', () => {
    const neighbors = [neighbor('1_0', 'LG', [npc('1_0:npc:0', 'trader', 'house-x')])]
    const binding = resolveLostTreasureExpeditionBinding({
      worldSeed: 5,
      settlementId: 'home',
      homeSize: 'SM',
      homeNpcs,
      neighborSettlements: neighbors,
      caveIds: [dungeonId],
      archetypeOf: () => 'dungeon',
      dungeonChambersOf,
      contentAnchors: anchors,
    })!
    const legacy = selectLegacyLostTreasureExpeditionIdentityNpcs(
      homeNpcs,
      new Map([['1_0', neighbors[0]!.npcs]]),
    )!
    expect(binding.sponsorNpcId).toBe('1_0:npc:0')
    expect(binding.questId).toBe(lostTreasureExpeditionQuestId(
      'home',
      dungeonId,
      legacy.sponsor.id,
      legacy.stakeholder?.id,
    ))
    expect(binding.questId).not.toContain('1_0:npc:0')
  })

  it('puts settlement name and derived compass sector on the sponsor objective', () => {
    const sponsor = neighbor('1_0', 'LG', [npc('1_0:npc:0', 'trader', 'house-x', false)], {
      name: 'Brzeziny',
      x: 100,
      z: -100,
    })
    const binding = resolveLostTreasureExpeditionBinding({
      worldSeed: 5,
      settlementId: 'home',
      homeSize: 'SM',
      homeNpcs,
      neighborSettlements: [sponsor],
      caveIds: [dungeonId],
      archetypeOf: () => 'dungeon',
      dungeonChambersOf,
      contentAnchors: anchors,
    })!
    const sector = cardinalSector(sponsor.x - 0, sponsor.z - 0)
    const def = buildLostTreasureExpeditionQuest(
      binding,
      [...homeNpcs, npc('1_0:npc:0', 'trader', 'house-x')],
      'Osada',
      'stary loch',
      { settlementName: sponsor.name, sector },
    )
    expect(sector).toBe('NE')
    expect(def.stages[0]?.description).toContain('Brzeziny (NE)')
    expect(def.offerLine).toContain('Brzeziny (NE)')
  })

  it('reveals the dungeon on the local stakeholder conversation, not the sponsor talk', () => {
    const binding = resolveLostTreasureExpeditionBinding({
      worldSeed: 5,
      settlementId: 'home',
      homeSize: 'SM',
      homeNpcs,
      neighborSettlements: [neighbor('1_0', 'LG', [npc('1_0:npc:0', 'trader', 'house-x')])],
      caveIds: [dungeonId],
      archetypeOf: () => 'dungeon',
      dungeonChambersOf,
      contentAnchors: anchors,
    })!
    const def = buildLostTreasureExpeditionQuest(
      binding,
      [...homeNpcs, npc('1_0:npc:0', 'trader', 'house-x')],
      'Osada',
      'stary loch',
      { settlementName: 'Brzeziny', sector: 'E' },
    )
    expect(def.stages[0]?.objective).toEqual({ type: 'talk_to_npc', npc: { npcId: binding.sponsorNpcId } })
    expect(def.stages[0]?.effects).toBeUndefined()
    expect(def.stages[1]?.objective).toEqual({
      type: 'talk_to_npc',
      npc: { npcId: binding.stakeholderNpcId },
    })
    expect(def.stages[1]?.effects).toEqual([{
      type: 'reveal_location',
      locationId: binding.caveLocationId,
      setNavigation: true,
    }])
    expect(def.stages[0]?.progressLine).not.toContain('stary loch')
    expect(def.stages[1]?.progressLine).toContain('stary loch')
  })

  it('does not claim unsupported kinship in player-facing copy', () => {
    const binding = resolveLostTreasureExpeditionBinding({
      worldSeed: 5,
      settlementId: 'home',
      homeSize: 'SM',
      homeNpcs,
      neighborSettlements: [neighbor('1_0', 'LG', [npc('1_0:npc:0', 'trader', 'house-x')])],
      caveIds: [dungeonId],
      archetypeOf: () => 'dungeon',
      dungeonChambersOf,
      contentAnchors: anchors,
    })!
    const def = buildLostTreasureExpeditionQuest(
      binding,
      [...homeNpcs, npc('1_0:npc:0', 'trader', 'house-x')],
      'Osada',
      'stary loch',
      { settlementName: 'Brzeziny', sector: 'E' },
    )
    const spoken = [
      def.offerLine,
      def.description,
      def.outcomes.map((outcome) => outcome.resultText).join(' '),
      def.stages.flatMap((stage) => [
        stage.description,
        stage.playerLine,
        stage.progressLine,
        ...(stage.dialogueActions ?? []).map((action) => action.playerLine),
      ]).join(' '),
    ].join(' ')
    expect(spoken).not.toMatch(/krewny|rodziny zaginionego|Należy do was/i)
  })
})

describe('lost treasure expedition socially consequential dialogue (plan quests-progression-052)', () => {
  const withStakeholder = {
    questId: 'world:lost-treasure-expedition:home:cave:s:f',
    settlementId: 'home',
    sponsorSettlementId: '1_0',
    sponsorNpcId: 'home:npc:0',
    stakeholderNpcId: 'home:npc:1',
    caveId: 'cave:dungeon-a',
    caveLocationId: 'cave:cave:dungeon-a',
    campAnchorId: 'camp',
    journalAnchorId: 'journal',
    evidenceAnchorId: 'evidence',
    finalTreasureAnchorId: 'final',
    campContainerId: 'camp-box',
    journalContainerId: 'journal-box',
    evidenceContainerId: 'evidence-box',
    finalTreasureContainerId: 'final-box',
    journalInstanceId: lostTreasureExpeditionJournalInstanceId('cave:dungeon-a'),
  }
  const withoutStakeholder = {
    ...withStakeholder,
    stakeholderNpcId: undefined,
  }
  const npcs = [
    npc('home:npc:0', 'trader', 'house-a'),
    npc('home:npc:1', 'farmer', 'house-b'),
  ]

  function terminalManager(
    binding: typeof withStakeholder | typeof withoutStakeholder,
    relations: Record<string, number>,
    social?: QuestSocialAvailabilityLookup,
  ) {
    const def = buildLostTreasureExpeditionQuest(binding, npcs, 'Osada', 'stary loch')
    const inventory = new Inventory({}, Infinity, [
      createLostTreasureExpeditionJournalInstance(binding.caveId),
    ])
    const qm = new QuestManager(
      [def],
      undefined,
      inventory,
      { progress: [{ id: def.id, state: 'active', stageIndex: def.stages.length - 1 }], relations },
      undefined,
      undefined,
      undefined,
      undefined,
      social,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      { canResolve: () => true, onResolve: () => {} },
    )
    return { def, qm }
  }

  it('keeps journal outcomes, instance gate and stakeholder-absent materialization', () => {
    const withFamily = buildLostTreasureExpeditionQuest(withStakeholder, npcs, 'Osada', 'loch')
    const sponsorOnly = buildLostTreasureExpeditionQuest(withoutStakeholder, npcs, 'Osada', 'loch')
    expect(() => validateQuestDefinitions([withFamily, sponsorOnly])).not.toThrow()
    const familyActions = withFamily.stages[withFamily.stages.length - 1]?.dialogueActions ?? []
    expect(familyActions.map((action) => action.physicalOutcomeId)).toEqual([
      LOST_TREASURE_EXPEDITION_JOURNAL_TO_FAMILY_OUTCOME,
      LOST_TREASURE_EXPEDITION_JOURNAL_TO_SPONSOR_OUTCOME,
      LOST_TREASURE_EXPEDITION_KEEP_JOURNAL_OUTCOME,
    ])
    expect(familyActions.every((action) => action.requireItemInstanceId === withStakeholder.journalInstanceId)).toBe(true)
    expect(sponsorOnly.outcomes.map((outcome) => outcome.id)).toEqual([
      LOST_TREASURE_EXPEDITION_JOURNAL_TO_SPONSOR_OUTCOME,
      LOST_TREASURE_EXPEDITION_KEEP_JOURNAL_OUTCOME,
    ])
    expect(withFamily.outcomes.find((outcome) => outcome.id === LOST_TREASURE_EXPEDITION_JOURNAL_TO_SPONSOR_OUTCOME)?.reward)
      .toEqual({ visibility: 'shown', items: [{ kind: 'coin', count: 25 }] })
  })

  it('selects family, sponsor and keep-journal replies from live social context', () => {
    const familyLow = terminalManager(withStakeholder, {})
    expect(familyLow.qm.onInteract('home:npc:1')?.actions?.[0]?.onSelect())
      .toBe('Dziękuję. Przynajmniej będziemy wiedzieć, co się z nimi naprawdę stało.')
    expect(familyLow.qm.getRelation('home:npc:1')).toBe(3)

    const familyWarm = terminalManager(withStakeholder, { 'home:npc:1': 3 })
    expect(familyWarm.qm.onInteract('home:npc:1')?.actions?.[0]?.onSelect())
      .toBe('Przyniosłeś go tutaj. Dobrze. Bałem się, że już nikt go nie zobaczy.')
    expect(familyWarm.qm.getRelation('home:npc:1')).toBe(7)

    const socialHigh: QuestSocialAvailabilityLookup = {
      getReputationDimension: (_settlementId, dimension) => (dimension === 'competence' ? 5 : 3),
      getRenown: () => 0,
    }
    const sponsorHigh = terminalManager(withoutStakeholder, {}, socialHigh)
    expect(sponsorHigh.qm.onInteract('home:npc:0')?.actions?.[0]?.onSelect())
      .toBe('Wiedziałem, że jeśli ktoś zamknie tę sprawę, to ty. Zostaw dziennik.')
    expect(sponsorHigh.qm.exportProgress()[0]?.resolvedOutcomeId)
      .toBe(LOST_TREASURE_EXPEDITION_JOURNAL_TO_SPONSOR_OUTCOME)

    const sponsorNeutral = terminalManager(withoutStakeholder, {}, {
      getReputationDimension: () => 3,
      getRenown: () => 0,
    })
    expect(sponsorNeutral.qm.onInteract('home:npc:0')?.actions?.[0]?.onSelect())
      .toBe('Dobrze. Ta historia zasługuje na formalne zamknięcie — i zapłatę dla ciebie.')

    const keepHurt = terminalManager(withoutStakeholder, { 'home:npc:0': 3 })
    expect(keepHurt.qm.onInteract('home:npc:0')?.actions?.[1]?.onSelect())
      .toBe('Tobie powierzyłem tę wyprawę do końca. Dziennik też był częścią tej sprawy.')
    expect(keepHurt.qm.getRelation('home:npc:0')).toBe(0)

    const keepLowIntegrity = terminalManager(withoutStakeholder, {}, {
      getReputationDimension: (_settlementId, dimension) => (dimension === 'integrity' ? 0 : 3),
      getRenown: () => 0,
    })
    expect(keepLowIntegrity.qm.onInteract('home:npc:0')?.actions?.[1]?.onSelect())
      .toBe('Czyli jednak coś miało zostać tylko dla ciebie.')
  })
})
