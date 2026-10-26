# Quests

**Status:** `verification needed`
**Created:** 2026-10-08
**Domain:** quests
**Roadmap:** -
**Depends on:** -
**Finished:** -

One index of every quest imported from the two old projects (v1 `seedvale`, v2 `SeedVales`). Every quest has its own folder `catalog/<version>/<id>/` with a `README.md` (description) and a `meta.ts` (metadata from the original project, typed by [schema.ts](schema.ts)).

All imported quests are **`verification needed`**: they describe what the old code or design says, not what the merged game will do.

## How to read the tables

- **Category** and **Difficulty** 🟡 are *inferred by an AI agent*: the originals have no such fields (v2 only has tier/scale in design docs, v1 only `offer.urgency/exposure/priority`). Which fields were inferred is listed in `derived` inside each `meta.ts`.
- **Built** = implemented in the source project (v2: all except Q10; ❓ = unknown).
- Titles of v1 quests are Polish originals with a 🟡 English working title.
- The index below is generated: `node --experimental-strip-types scripts/quests-index.mjs` (add `--check` to validate source paths and staleness). Don't edit the block by hand.

## Layout

| Path | Content |
|---|---|
| `catalog/v1/<id>/`, `catalog/v2/<id>/` | one quest: `README.md` + `meta.ts` |
| `catalog/v1/_generated/` | world-driven v1 opportunities (not per-quest) |
| `engine/` | [quests-engine.md](engine/quests-engine.md): v2 data-driven stage machine (D-QUEST-1) |
| `plans/` | v2 implementation plans `quests--001..003` |
| `roadmaps/v1/` | v1 quest-domain roadmaps |
| `progression-plans/v1/` | v1 `quests-progression-NNN-*` plans |
| `v2-shared/` | shared v2 design material: [QUEST-WORLD.md](v2-shared/QUEST-WORLD.md) (cast, places, reward calibration; wins on conflict), [pack index](v2-shared/designs-README.md), pack notes |

## Index

<!-- AUTO-GENERATED:START -->

### v2 (SeedVales) (22)

#### delivery

| Id | Title | Giver | Difficulty 🟡 | Status | Built |
|---|---|---|---|---|---|
| `G03` | [Night Torches](catalog/v2/g03-night-torches/README.md) | Mark Hornblower | easy | verification needed | yes |
| `G04` | [Root by the Stream](catalog/v2/g04-root-by-the-stream/README.md) | Dora Herbert | medium | verification needed | yes |
| `Q06` | [Room for One More](catalog/v2/q06-room-for-one-more/README.md) | Miles Hewer | medium | verification needed | yes |

#### hunting

| Id | Title | Giver | Difficulty 🟡 | Status | Built |
|---|---|---|---|---|---|
| `Q01` | [A Hare Out of Place](catalog/v2/q01-a-hare-out-of-place/README.md) | Jacob Bowman | easy | verification needed | yes |
| `G07` | [Trail of the Grey Wolf](catalog/v2/g07-trail-of-greybeard/README.md) | Jacob Bowman | medium | verification needed | yes |
| `Q02` | [The Hollow Below the Road](catalog/v2/q02-the-hollow-below-the-road/README.md) | Edith Fowler | medium | verification needed | yes |

#### investigation

| Id | Title | Giver | Difficulty 🟡 | Status | Built |
|---|---|---|---|---|---|
| `G01` | [Lost Lamb](catalog/v2/g01-lost-lamb/README.md) | Molly Lambert | easy | verification needed | yes |
| `G08` | [Well and Rumor](catalog/v2/g08-well-and-rumor/README.md) | Ralph Fieldman | medium | verification needed | yes |

#### other

| Id | Title | Giver | Difficulty 🟡 | Status | Built |
|---|---|---|---|---|---|
| `Q14` | [Weeds on the Hill](catalog/v2/q14-weeds-on-the-hill/README.md) | ruth | easy | verification needed | yes |
| `Q08` | [The Long Way to Water](catalog/v2/q08-the-long-way-to-water/README.md) | Elspeth Shepherd | medium | verification needed | yes |

#### repair

| Id | Title | Giver | Difficulty 🟡 | Status | Built |
|---|---|---|---|---|---|
| `Q03` | [A Roof Before Rain](catalog/v2/q03-a-roof-before-rain/README.md) | Miles Hewer | easy | verification needed | yes |
| `Q04` | [The Handle Remembers](catalog/v2/q04-the-handle-remembers/README.md) | Sophie Smith | easy | verification needed | yes |

#### social

| Id | Title | Giver | Difficulty 🟡 | Status | Built |
|---|---|---|---|---|---|
| `Q07` | [Six Bowls, One Pan](catalog/v2/q07-six-bowls-one-pan/README.md) | Lucy Hewer | easy | verification needed | yes |
| `G05` | [Disputed Oak](catalog/v2/g05-disputed-oak/README.md) | Miles Hewer | medium | verification needed | yes |

#### story

| Id | Title | Giver | Difficulty 🟡 | Status | Built |
|---|---|---|---|---|---|
| `Q10` | [What the Mountain Owes](catalog/v2/q10-what-the-mountain-owes/README.md) | Agnes Collier | epic | verification needed | no |

#### trade

| Id | Title | Giver | Difficulty 🟡 | Status | Built |
|---|---|---|---|---|---|
| `Q09` | [Goods on the Ground](catalog/v2/q09-goods-on-the-ground/README.md) | Stephen Chapman | easy | verification needed | yes |
| `G02` | [Rusty Debt](catalog/v2/g02-rusty-debt/README.md) | Bernard Smith | medium | verification needed | yes |
| `G06` | [The Trader's Letter](catalog/v2/g06-traders-letter/README.md) | Stephen Chapman | medium | verification needed | yes |

#### treasure

| Id | Title | Giver | Difficulty 🟡 | Status | Built |
|---|---|---|---|---|---|
| `Q05` | [The Map That Missed the River](catalog/v2/q05-the-map-that-missed-the-river/README.md) | Rosalind Marchant | hard | verification needed | yes |
| `Q11` | [The Bell in Blackwater](catalog/v2/q11-bell-in-blackwater/README.md) | Eve Boatwright | hard | verification needed | yes |
| `Q12` | [The Iron Under the Pine](catalog/v2/q12-iron-under-the-pine/README.md) | Duncan Wakeman | hard | verification needed | yes |
| `Q13` | [The Ash House Vault](catalog/v2/q13-ash-house-vault/README.md) | Irene Taylor | hard | verification needed | yes |

### v1 (seedvale) (39)

#### delivery

| Id | Title | Giver | Difficulty 🟡 | Status | Built |
|---|---|---|---|---|---|
| `woda-dla-marka` | [Woda dla Marka (Water for Marek)](catalog/v1/v1-woda-dla-marka/README.md) | Marek | easy | verification needed | yes |
| `zaginiona-przesylka` | [Zaginiona przesyłka (Lost Parcel)](catalog/v1/v1-zaginiona-przesylka/README.md) | Kasia | medium | verification needed | yes |

#### gathering

| Id | Title | Giver | Difficulty 🟡 | Status | Built |
|---|---|---|---|---|---|
| `shells-dla-kasi` | [Muszle dla Kasi (Shells for Kasia)](catalog/v1/v1-shells-dla-kasi/README.md) | Kasia | easy | verification needed | yes |
| `story:lost-treasure-chronicles:cemetery-favour` | [Porządek na cmentarzu (Order in the Cemetery)](catalog/v1/v1-lost-treasure-cemetery-favour/README.md) | ❓ | easy | verification needed | yes |
| `story:lost-treasure-chronicles:elder:winter` | [Przygotowania do zimy (Preparing for Winter)](catalog/v1/v1-lost-treasure-chronicles-elder-winter/README.md) | ❓ | easy | verification needed | yes |
| `ziola-dla-anny` | [Zioła dla Anny (Herbs for Anna)](catalog/v1/v1-ziola-dla-anny/README.md) | Anna | easy | verification needed | yes |

#### hunting

| Id | Title | Giver | Difficulty 🟡 | Status | Built |
|---|---|---|---|---|---|
| `lis-przy-osadzie` | [Lis przy osadzie (Fox by the Settlement)](catalog/v1/v1-lis-przy-osadzie/README.md) | Marek | easy | verification needed | yes |
| `dzik-przy-szlaku` | [Dzik przy szlaku (Boar by the Trail)](catalog/v1/v1-dzik-przy-szlaku/README.md) | Marek | hard | verification needed | yes |
| `grozny-wilk` | [Groźny wilk (Dangerous Wolf)](catalog/v1/v1-grozny-wilk/README.md) | Anna | hard | verification needed | yes |
| `wilcza-jama` | [Wilcza jama (Wolf Den)](catalog/v1/v1-wilcza-jama/README.md) | Anna | hard | verification needed | yes |
| `wilki-pod-osada` | [Wilki pod osadą (Wolves Under the Settlement)](catalog/v1/v1-wilki-pod-osada/README.md) | Anna | hard | verification needed | yes |
| `wilki-u-kupca` | [Wilki u kupca (Wolves at the Merchant)](catalog/v1/v1-wilki-u-kupca/README.md) | Kasia | hard | verification needed | yes |

#### investigation

| Id | Title | Giver | Difficulty 🟡 | Status | Built |
|---|---|---|---|---|---|
| `samotna-wieza` | [Samotna wieża (Lonely Tower)](catalog/v1/v1-samotna-wieza/README.md) | Piotr | easy | verification needed | yes |
| `sprawdz-szlak` | [Sprawdzenie skalnej groty (Checking the Rock Cave)](catalog/v1/v1-sprawdz-szlak/README.md) | Kasia | easy | verification needed | yes |
| `stare-ruiny` | [Stare ruiny (Old Ruins)](catalog/v1/v1-stare-ruiny/README.md) | Piotr | easy | verification needed | yes |
| `zaginiony-ladunek` | [Zaginiony ładunek (Missing Cargo)](catalog/v1/v1-zaginiony-ladunek/README.md) | Marek | easy | verification needed | yes |
| `zagubiona-owca` | [Zagubiona owca (Lost Sheep)](catalog/v1/v1-zagubiona-owca/README.md) | Anna | easy | verification needed | yes |
| `zapomniany-cmentarz` | [Zapomniany cmentarz (Forgotten Cemetery)](catalog/v1/v1-zapomniany-cmentarz/README.md) | Kasia | easy | verification needed | yes |
| `rpg:suspicious-transport:<settlementId>:<counterpartId>` | [Podejrzany transport (Suspicious Transport)](catalog/v1/v1-suspicious-transport-cave-cache/README.md) | ❓ | medium | verification needed | yes |
| `slad-przy-monolicie` | [Ślad przy monolicie (Trail by the Monolith)](catalog/v1/v1-slad-przy-monolicie/README.md) | Anna | medium | verification needed | yes |
| `story:lost-treasure-chronicles:chronicle-deciphering` | [Odczytanie kroniki (Deciphering the Chronicle)](catalog/v1/v1-lost-treasure-chronicle-deciphering/README.md) | ❓ | medium | verification needed | yes |
| `story:lost-treasure-chronicles:chronicle-search` | [Zakodowana kronika (Encoded Chronicle)](catalog/v1/v1-lost-treasure-chronicle-search/README.md) | ❓ | medium | verification needed | yes |
| `world:lost-hunter:<settlementId>:<caveId>` | [Zaginiony myśliwy (Missing Hunter)](catalog/v1/v1-lost-hunter-natural-cave/README.md) | ❓ | medium | verification needed | yes |
| `world:old-bones:<settlementId>:<caveId>` | [Stare kości (Old Bones)](catalog/v1/v1-old-bones-adventure-cave/README.md) | ❓ | medium | verification needed | yes |
| `zwiadowca` | [Zwiad okolicy (Scouting the Area)](catalog/v1/v1-zwiadowca/README.md) | Piotr | medium | verification needed | yes |

#### other

| Id | Title | Giver | Difficulty 🟡 | Status | Built |
|---|---|---|---|---|---|
| `plaga-szcurow` | [Plaga szczurów (Rat Plague)](catalog/v1/v1-plaga-szcurow/README.md) | Marek | medium | verification needed | yes |

#### profession

| Id | Title | Giver | Difficulty 🟡 | Status | Built |
|---|---|---|---|---|---|
| `hunters-brotherhood-intro:<homeSettlementId>:<inviterNpcId>` | [Krąg myśliwych (Circle of Hunters)](catalog/v1/v1-hunters-brotherhood-introduction/README.md) | ❓ | easy | verification needed | yes |
| `hunters-brotherhood-investigation:<homeSettlementId>:<inviterNpcId>:<spawnerId>` | [Niepokojące łowisko (Troubling Hunting Ground)](catalog/v1/v1-hunters-brotherhood-investigation/README.md) | ❓ | easy | verification needed | yes |

#### repair

| Id | Title | Giver | Difficulty 🟡 | Status | Built |
|---|---|---|---|---|---|
| `drewno-dla-anny` | [Drewno dla Anny (Wood for Anna)](catalog/v1/v1-drewno-dla-anny/README.md) | Anna | easy | verification needed | yes |
| `drewno-dla-piotra` | [Drewno dla Piotra (Wood for Piotr)](catalog/v1/v1-drewno-dla-piotra/README.md) | Piotr | easy | verification needed | yes |
| `drewno-na-naprawe` | [Drewno na naprawę (Wood for Repairs)](catalog/v1/v1-drewno-na-naprawe/README.md) | Piotr | easy | verification needed | yes |
| `kamienie-dla-piotra` | [Kamienie dla Piotra (Stones for Piotr)](catalog/v1/v1-kamienie-dla-piotra/README.md) | Piotr | easy | verification needed | yes |

#### social

| Id | Title | Giver | Difficulty 🟡 | Status | Built |
|---|---|---|---|---|---|
| `relay-anna-piotr` | [Wiadomość dla Piotra (Message for Piotr)](catalog/v1/v1-relay-anna-piotr/README.md) | Anna | easy | verification needed | yes |
| `sporne-drewno` | [Sporne drewno (Disputed Wood)](catalog/v1/v1-sporne-drewno/README.md) | Anna | medium | verification needed | yes |
| `story:lost-treasure-chronicles:elder:dispute` | [Stara uraza (Old Grudge)](catalog/v1/v1-lost-treasure-chronicles-elder-dispute/README.md) | ❓ | medium | verification needed | yes |

#### treasure

| Id | Title | Giver | Difficulty 🟡 | Status | Built |
|---|---|---|---|---|---|
| `mapa-do-skarbu` | [Mapa do skarbu (Treasure Map)](catalog/v1/v1-mapa-do-skarbu/README.md) | Piotr | hard | verification needed | yes |
| `world:dungeon-bandit:<settlementId>:<caveId>:<giverNpcId>:<claimantNpcId>` | [Skrytka bandytów (Bandits' Stash)](catalog/v1/v1-dungeon-bandit-treasure/README.md) | ❓ | hard | verification needed | yes |
| `skarb-jaskini-niedzwiedzia` | [Stary skarb w jaskini (Old Treasure in the Cave)](catalog/v1/v1-skarb-jaskini-niedzwiedzia/README.md) | Marek | epic | verification needed | yes |
| `world:lost-treasure-expedition:<settlementId>:<caveId>[:<sponsorNpcId>[:<stakeholderNpcId>]]` | [Zaginiona wyprawa po skarb (Lost Treasure Expedition)](catalog/v1/v1-lost-treasure-expedition/README.md) | ❓ | epic | verification needed | yes |

<!-- AUTO-GENERATED:END -->

## Known gaps

- v2 design docs linked from the v2 pack notes but missing in this repo: `grok-quest-02-rusty-debt`, `grok-quest-04-root-by-the-stream` (G02 and G04 have `meta.ts` and a stub README from code only), `REVIEW.md`, `REVIEW-2026-10-01.md`, `grok-quest-*-review.md`, `codex-treasure-quest-review-log.md`.
- v2 Q14 (*Weeds on the Hill*) has code and a test but no design doc.
- Some plans in `plans/` and `v2-shared/` link to files outside `docs/quests/` that do not exist here (`../reviews/`, `../roadmap/later-vision-backlog.md`, state files, other plans). Left as they were.
- v1 generated opportunities are described in one place only: [catalog/v1/_generated/](catalog/v1/_generated/README.md).
