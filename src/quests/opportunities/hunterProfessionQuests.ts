import type { PreySpawner } from '../../fauna/AnimalSpawner'
import type { ItemKind } from '../../items/items'
import type { NpcId } from '../../settlement/npcState'
import type { QuestDef } from '../quests'
import type { OpportunityNpc } from './worldQuestOpportunityTypes'
import { adultOpportunityNpcs } from './rpgQuestMatrices'

const HUNTER_QUEST_PREFIX = 'hunter-profession:'
const HUNTER_I_OUTCOME = 'hunter_i_complete'
const HUNTER_II_OUTCOME = 'hunter_ii_complete'
/** Terminal Hunter III outcome that later story continuation can prerequisite. */
export const HUNTER_III_COMPLETE_OUTCOME = 'hunter_iii_complete'

const HABITAT_FEED_FOODS: readonly ItemKind[] = ['apple', 'carrot', 'berries']

function stableHash(text: string): number {
  let hash = 2166136261
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

/**
 * Stable quest id for one Hunter profession step at a settlement.
 *
 * @domain quests-progression
 */
export function hunterProfessionQuestId(settlementId: string, giverNpcId: NpcId, step: 1 | 2 | 3): string {
  return `${HUNTER_QUEST_PREFIX}${settlementId}:${giverNpcId}:${step}`
}

export function parseHunterProfessionQuestId(questId: string): {
  settlementId: string
  giverNpcId: NpcId
  step: 1 | 2 | 3
} | null {
  if (!questId.startsWith(HUNTER_QUEST_PREFIX)) return null
  const rest = questId.slice(HUNTER_QUEST_PREFIX.length)
  const parts = rest.split(':')
  if (parts.length < 3) return null
  const stepRaw = parts[parts.length - 1]
  const step = Number(stepRaw)
  if (step !== 1 && step !== 2 && step !== 3) return null
  const giverNpcId = parts[parts.length - 2] as NpcId
  const settlementId = parts.slice(0, parts.length - 2).join(':')
  if (!settlementId || !giverNpcId) return null
  return { settlementId, giverNpcId, step }
}

/** Deterministic adult Hunter giver for a settlement (plan quests-progression-020). */
export function selectHunterQuestGiver(npcs: readonly OpportunityNpc[]): OpportunityNpc | undefined {
  return adultOpportunityNpcs(npcs).find((npc) => npc.role === 'hunter')
}

function pickSettlementThicket(
  spawners: readonly PreySpawner[],
  settlementId: string,
  giverNpcId: NpcId,
): PreySpawner | undefined {
  const thickets = spawners
    .filter((spawner) => spawner.type === 'thicket' && spawner.id.startsWith(`${settlementId}:`))
    .slice()
    .sort((a, b) => a.id.localeCompare(b.id))
  if (thickets.length === 0) return undefined
  const index = stableHash(`${settlementId}\0${giverNpcId}`) % thickets.length
  return thickets[index]
}

function materializeHunterI(giver: OpportunityNpc, settlementId: string, settlementName: string): QuestDef {
  const id = hunterProfessionQuestId(settlementId, giver.id, 1)
  return {
    id,
    title: 'Pierwsze trofea',
    description:
      `${giver.name} z osady ${settlementName} uczy podstaw polowania — sarny i skóry, nie tylko mięso w plecaku.`,
    giverName: giver.name,
    giver: { npcId: giver.id },
    settlementId,
    offerLine:
      'Samo trafić zwierzynę to jeszcze nie sztuka. Pokaż, że potrafisz też dobrze ją oprawić. Przynieś mi skóry z trzech saren, a dam ci łuk, z którym można zacząć prawdziwe polowanie.',
    stages: [
      {
        objective: { type: 'harvest_animals', kind: 'deer', count: 3 },
        description: 'Upoluj i opraw trzy sarny.',
        reminderLine: 'Nie liczy się samo polowanie. Chcę zobaczyć, że potrafisz porządnie oprawić zwierzynę.',
      },
      {
        objective: { type: 'gather_item', kind: 'hide', count: 3 },
        description: 'Oddaj trzy skóry myśliwemu.',
        reminderLine: 'Masz już skóry z tych saren?',
        playerLine: 'Mam trzy skóry. Sam je oprawiłem.',
      },
    ],
    reportPromptLine: 'No i jak poszło pierwsze polowanie?',
    reportPlayerLine: 'Upolowałem trzy sarny i przyniosłem skóry.',
    reportLine: 'Dobrze. Widać, że nie zmarnowałeś zwierzyny. Weź ten łuk — przyda ci się przy następnych łowach.',
    outcomes: [
      {
        id: HUNTER_I_OUTCOME,
        state: 'complete',
        reward: { visibility: 'shown', items: [{ kind: 'short_bow', count: 1 }] },
        consequences: {
          relations: [{ npc: { npcId: giver.id }, delta: 2 }],
          social: { reputation: { competence: 4, trust: 2 }, renown: 4 },
        },
      },
    ],
  }
}

function materializeHunterII(
  giver: OpportunityNpc,
  settlementId: string,
  settlementName: string,
  hunterIQuestId: string,
): QuestDef {
  const id = hunterProfessionQuestId(settlementId, giver.id, 2)
  return {
    id,
    title: 'Poroża jeleni',
    description:
      `${giver.name} z osady ${settlementName} prosi o poroża z dorosłych jeleni — trofeum z prawdziwego polowania, nie z magazynu.`,
    giverName: giver.name,
    giver: { npcId: giver.id },
    settlementId,
    availability: { prerequisites: [{ type: 'quest_outcome', questId: hunterIQuestId, outcomeIds: [HUNTER_I_OUTCOME] }] },
    offerLine:
      'Z sarnami sobie poradziłeś. Teraz spróbuj z jeleniem — jest silniejszy i łatwiej go spłoszyć. Przynieś mi dwa poroża. Będę wiedział, że potrafisz podejść większą zwierzynę.',
    stages: [
      {
        objective: { type: 'harvest_animals', kind: 'stag', count: 2 },
        description: 'Opraw dwa dorosłe jelenie.',
        reminderLine: 'Jeleń nie da ci podejść tak łatwo jak sarna. Nie spiesz się i dobrze wybierz moment.',
      },
      {
        objective: { type: 'gather_item', kind: 'antler', count: 2 },
        description: 'Oddaj dwa poroża.',
        reminderLine: 'Masz już poroża?',
        playerLine: 'Mam dwa poroża z upolowanych jeleni.',
      },
    ],
    reportPromptLine: 'Jak poszło z jeleniami?',
    reportPlayerLine: 'Upolowałem jelenie i mam poroża.',
    reportLine: 'No, teraz już można mówić o polowaniu. Weź ten łuk — na większą zwierzynę sprawdzi się lepiej.',
    outcomes: [
      {
        id: HUNTER_II_OUTCOME,
        state: 'complete',
        reward: { visibility: 'shown', items: [{ kind: 'hunting_bow', count: 1 }] },
        consequences: {
          relations: [{ npc: { npcId: giver.id }, delta: 2 }],
          social: { reputation: { competence: 6, trust: 3 }, renown: 6 },
        },
      },
    ],
  }
}

function materializeHunterIII(
  giver: OpportunityNpc,
  settlementId: string,
  spawnerId: string,
  hunterIIQuestId: string,
): QuestDef {
  const id = hunterProfessionQuestId(settlementId, giver.id, 3)
  return {
    id,
    title: 'Pomoc przy zagajniku',
    description:
      `${giver.name} wskazuje zagajnik, gdzie zwierzyna ma gorszy dostęp do pożywienia — zostaw tam coś do jedzenia.`,
    giverName: giver.name,
    giver: { npcId: giver.id },
    settlementId,
    availability: { prerequisites: [{ type: 'quest_outcome', questId: hunterIIQuestId, outcomeIds: [HUNTER_II_OUTCOME] }] },
    offerLine:
      'Dobry myśliwy nie tylko bierze z lasu. Przy jednym z zagajników zwierzyna ma mało pożywienia. Zostaw tam coś, co zjedzą sarny i jelenie. Chcę zobaczyć, czy rozumiesz różnicę między polowaniem a wybijaniem wszystkiego, co się rusza.',
    stages: [
      {
        objective: {
          type: 'feed_habitat_animals',
          spawnerId,
          kinds: ['deer', 'stag'],
          count: 3,
          foodKinds: HABITAT_FEED_FOODS,
        },
        description: 'Nakarm trzy zwierzęta z tego zagajnika zostawionym jedzeniem.',
        reminderLine: 'Zostaw jedzenie przy zagajniku i daj zwierzynie czas. Jeśli zaczną tam żerować, będziemy wiedzieli, że miejsce jeszcze da się odbudować.',
      },
    ],
    reportPromptLine: 'Przyjęły jedzenie?',
    reportPlayerLine: 'Tak. Zwierzyna przyszła i zaczęła żerować.',
    reportLine: 'Dobrze. Pamiętaj o tym. Jeśli łowisko umrze, myśliwy długo po nim nie przetrwa.',
    outcomes: [
      {
        id: HUNTER_III_COMPLETE_OUTCOME,
        state: 'complete',
        consequences: {
          relations: [{ npc: { npcId: giver.id }, delta: 2 }],
          social: { reputation: { competence: 5, benevolence: 4, trust: 2 }, renown: 5 },
        },
      },
    ],
  }
}

/**
 * Hunter profession chain for one settlement (plan quests-progression-020).
 * Materializes only when an adult Hunter NPC exists; step III additionally
 * requires a settlement thicket spawner.
 *
 * @domain quests-progression
 */
export function buildHunterProfessionQuests(input: {
  settlementId: string
  settlementName: string
  npcs: readonly OpportunityNpc[]
  spawners: readonly PreySpawner[]
  persistedQuestIds?: readonly string[]
}): QuestDef[] {
  const giver = selectHunterQuestGiver(input.npcs)
  if (!giver) return []
  const hunterIId = hunterProfessionQuestId(input.settlementId, giver.id, 1)
  const hunterIIId = hunterProfessionQuestId(input.settlementId, giver.id, 2)
  const hunterIIIId = hunterProfessionQuestId(input.settlementId, giver.id, 3)
  const persisted = new Set(input.persistedQuestIds ?? [])
  const needIII = persisted.has(hunterIIIId)
  const thicket = pickSettlementThicket(input.spawners, input.settlementId, giver.id)
  const defs = [
    materializeHunterI(giver, input.settlementId, input.settlementName),
    materializeHunterII(giver, input.settlementId, input.settlementName, hunterIId),
  ]
  if (thicket || needIII) {
    if (!thicket) return defs
    defs.push(materializeHunterIII(
      giver,
      input.settlementId,
      thicket.id,
      hunterIIId,
    ))
  }
  return defs
}
