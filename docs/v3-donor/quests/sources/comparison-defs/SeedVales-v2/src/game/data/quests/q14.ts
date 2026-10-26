/**
 * Q14 — Weeds on the Hill (settlement--002 step 10). Giver: an elder of {H}, who can no longer bend to the family graves.
 * The legal side of the cemetery: tidy five graves ("Tidy the grave" on a headstone), report back, get a small payment from the
 * settlement treasury and some goodwill. Digging a grave while the quest is open ends it badly. No new items or money sources.
 * @domain quests
 */
import type { QuestDef } from './types'
import { flag, flagNot, message, opinion, opt, say, set, stage } from './dsl'

const cemetery = { k: 'cemetery' } as const
const TIDY_GOAL = 5

export const Q14: QuestDef = {
  id: 'q14',
  title: 'Weeds on the Hill',
  giver: 'ruth',
  cast: {
    ruth: { kind: 'npc', required: true, kin: ['elder', 'spouse', 'head'] },
  },
  start: [{ k: 'anchorExists', anchor: cemetery }, { k: 'day', from: 3 }],
  flags: { accepted: false, tidied: false },
  stages: [
    { id: 'ask', journal: '{ruth} cannot bend to the graves any more and the weeds on the cemetery hill have grown over the stones.', anchor: { k: 'actor', slot: 'ruth' } },
    { id: 'tidy', journal: 'Tidy five graves in the cemetery of {H}: walk up to a headstone and choose "Tidy the grave". Do not disturb the earth.', anchor: cemetery, progress: [{ when: [{ k: 'counter', id: 'tidied', gte: 1 }], text: 'You have started on the graves.' }] },
    { id: 'report', journal: 'The graves are tidy. Tell {ruth}.', anchor: { k: 'actor', slot: 'ruth' } },
  ],
  nodes: {
    ru_open: {
      lines: [
        say('ruth', 'The hill behind the houses is all weeds and moss now. My people lie up there, and I cannot get at them any more.'),
        say('player', 'What would you have me do?'),
        say('ruth', 'Only tidy a few graves. Pull the weeds, clear the stones. The village will pay you something for it; it is everyone\'s hill.'),
      ],
      options: [
        opt('yes', 'I will tidy five graves.', [{ k: 'accept' }, set('accepted'), stage(1), opinion('ruth', 5)], { next: 'ru_yes' }),
        opt('no', 'Not now.', [{ k: 'refuse' }], { next: 'ru_no' }),
      ],
    },
    ru_yes: { lines: [say('ruth', 'Thank you. Treat them gently; they are all someone\'s.')], options: [] },
    ru_no: { lines: [say('ruth', 'The weeds will wait. They always do.')], options: [] },
    ru_done: {
      lines: [say('ruth', '(she nods slowly) Someone has been to see them at last. Take this from the village purse, and my thanks.')],
      options: [opt('take', 'It was no trouble.', [{ k: 'end', ending: 'tended' }])],
    },
  },
  topics: [
    { slot: 'ruth', node: 'ru_open', label: 'The cemetery hill', when: [flagNot('accepted', true)] },
    { slot: 'ruth', node: 'ru_done', label: 'The tidied graves', when: [flag('tidied')] },
  ],
  observations: [],
  counters: [
    { id: 'tidied', on: 'tidy', match: { near: { anchor: cemetery, r: 60 }, distinct: true }, when: [flag('accepted')] },
    { id: 'dug', on: 'dig', match: { near: { anchor: cemetery, r: 60 }, grave: true } },
  ],
  rules: [
    { id: 'tidyDone', when: [{ k: 'counter', id: 'tidied', gte: TIDY_GOAL }, flagNot('tidied', true)], effects: [set('tidied'), stage(2), message('The cemetery looks cared for again. Tell {ruth}.', 'quest')] },
    { id: 'desecrated', when: [{ k: 'counter', id: 'dug', gte: 1 }], effects: [{ k: 'end', ending: 'desecrated' }] },
    { id: 'ignored', phase: 'both', when: [{ k: 'since', hours: 240, from: 'offered' }, flag('accepted', false)], effects: [{ k: 'lapse' }] },
  ],
  endings: [
    { id: 'tended', journal: 'You tidied the graves. {ruth} paid you 20 c from the village treasury.', effects: [{ k: 'pay', from: { treasury: 'home' }, to: 'player', amount: 20 }, { k: 'rep', delta: { helpfulness: 6 }, reason: 'You tended the cemetery' }, opinion('ruth', 20)] },
    { id: 'desecrated', journal: 'You dug into a grave while {ruth} trusted you with them. She wants nothing more to do with you.', effects: [opinion('ruth', -40), message('{ruth} will not forgive disturbing the dead.', 'bad')] },
  ],
  lapse: { journal: 'Nobody tended the cemetery hill; the weeds stayed.', effects: [] },
}
