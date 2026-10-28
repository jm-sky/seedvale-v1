# Plans — Current Planning Map

Current planning map for implementation plans: backlog, dependencies, active threads and verification queue. Detailed implementation lives in the plan files; implementation notes and reviews live in their dedicated folders; history lives in [archive/](./archive/README.md).

## Metadata reference

Generated from `scripts/docs/config.ts` by `pnpm docs:generate-plan-docs` — see `docs/plans/PLAN-METADATA.md` for the full contract.

Status: `draft` 📝 · `planned` 📋 · `in progress` 🔄 · `verification needed` 🔍 · `done` ✅
Priority: 🔴 high · 🟡 medium · ⚪ low
Effort: `XS` minutes · `S` ~15–30 min · `M` ~30–90 min · `L` ~1–3 h · `XL` several sessions
Type: `feature` · `bug` · `fix` · `polish` · `optimization` · `refactor` · `infrastructure`

Unless noted otherwise, `verification needed` means implementation has passed automated checks but still needs browser/manual verification.

**Depends on** = implementation prerequisites (plan IDs). ~~done~~ is crossed out. Thematic overlap is not a dependency.

---

## Drafts

| File                                                                           | Pri | Effort | Depends                                                                                                                                                                                                                                                                                    | Roadmap                                   |
| ------------------------------------------------------------------------------ | --- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------- |
| `fauna-032-exceptional-animal-appearance-morphs.md`                            | 🟡 | M      | ~~fauna-018~~, ~~fauna-022~~                                                                                                                                                                                                                                                               | quests-hunters-brotherhood                |
| `fauna-048-agent-performance-village-query-scaling.md`                         | 🟡 | S      | ~~fauna-042~~                                                                                                                                                                                                                                                                              | -                                         |
| `items-player-037-ubc-runtime-per-slot-outfits.md`                             | 🟡 | XL     | ~~items-player-030~~, ~~items-player-036~~                                                                                                                                                                                                                                                 | -                                         |
| `items-player-061-lifecycle-mounted-livestock-reference.md`                    | 🔴 | S      | ~~items-player-057~~, ~~settlements-npcs-048~~                                                                                                                                                                                                                                             | -                                         |
| `npc-004-npc-genealogy-lineages.md`                                            | ⚪ | S      | -                                                                                                                                                                                                                                                                                          | npc-professions-households-and-age        |
| `npc-035-shared-expedition-relationship-consequences.md`                       | 🔴 | L      | ~~npc-029~~, npc-032, npc-033, npc-034                                                                                                                                                                                                                                                     | companions                                |
| `npc-038-work-contract-actor-capability-gating.md`                             | 🔴 | M      | -                                                                                                                                                                                                                                                                                          | -                                         |
| `npc-051-elder-daily-life-and-settlement-care.md`                              | 🟡 | L      | ~~settlements-npcs-045~~, settlements-npcs-022, ~~npc-011~~                                                                                                                                                                                                                                | npc-professions-households-and-age        |
| `npc-063-agent-performance-update-cost-attribution.md`                         | 🔴 | S      | -                                                                                                                                                                                                                                                                                          | -                                         |
| `npc-064-agent-performance-spatial-state-seam.md`                              | 🟡 | XL     | -                                                                                                                                                                                                                                                                                          | -                                         |
| `persistence-007-lifecycle-new-game-rebuild-failure-safety.md`                 | 🔴 | S      | ~~persistence-004~~, ~~world-033~~, ~~items-player-056~~                                                                                                                                                                                                                                   | -                                         |
| `quests-progression-062-builder-new-outpost.md`                                | 🔴 | L      | ~~world-031~~, settlements-npcs-044                                                                                                                                                                                                                                                        | quests-professions-and-world-consequences |
| `quests-progression-064-healer-difficult-case.md`                              | 🟡 | M      | quests-progression-063                                                                                                                                                                                                                                                                     | quests-professions-and-world-consequences |
| `quests-progression-066-elder-knowledge-and-teaching.md`                       | 🟡 | L      | ~~settlements-npcs-045~~, ~~items-player-016~~                                                                                                                                                                                                                                             | npc-professions-households-and-age        |
| `quests-progression-067-missing-merchant-systemic-investigation.md`            | 🔴 | L      | world-032                                                                                                                                                                                                                                                                                  | quests-travelling-merchant-journeys       |
| `quests-progression-068-dangerous-merchant-route-and-persistent-world-consequence.md` | 🟡 | L      | quests-progression-067, world-032, ~~world-031~~, settlements-npcs-051                                                                                                                                                                                                                     | quests-travelling-merchant-journeys       |
| `quests-progression-082-quest-ui-world-objective-reconciliation-coverage.md`   | 🔴 | M      | ~~quests-progression-078~~, ~~quests-progression-080~~                                                                                                                                                                                                                                     | -                                         |
| `settlements-023-settlement-streaming-lifecycle-and-construction-rollback.md`  | 🔴 | XL     | -                                                                                                                                                                                                                                                                                          | -                                         |
| `settlements-npcs-050-merchant-journey-provisioning-and-readiness.md`          | 🔴 | L      | ~~settlements-npcs-048~~, settlements-npcs-049, ~~fauna-039~~, ~~npc-053~~                                                                                                                                                                                                                 | quests-travelling-merchant-journeys       |
| `settlements-npcs-057-agent-performance-offscreen-pack-animal-continuity.md`   | 🔴 | M      | ~~settlements-npcs-048~~                                                                                                                                                                                                                                                                   | -                                         |
| `tools-000-weapon-browser-observatory.md`                                      | 🟡 | M      | -                                                                                                                                                                                                                                                                                          | -                                         |
| `tools-005-seedvale-character-preparation-panel.md`                            | 🔴 | M      | -                                                                                                                                                                                                                                                                                          | -                                         |
| `tools-006--world-observatory.md`                                              | ⚪ | XL     | -                                                                                                                                                                                                                                                                                          | -                                         |
| `tools-007--mpfb2-npc-hero-character-pipeline.md`                              | 🔴 | L      | -                                                                                                                                                                                                                                                                                          | -                                         |
| `ui-input-038-quest-ui-interaction-actionability-ranking-parity.md`            | 🔴 | S      | ~~ui-input-015~~, ~~ui-input-028~~, ~~ui-input-029~~                                                                                                                                                                                                                                       | -                                         |
| `world-032-travelling-merchant-journey-failure-and-persistent-road-evidence.md` | 🔴 | L      | ~~settlements-npcs-048~~, settlements-npcs-050, settlements-npcs-051, ~~fauna-039~~                                                                                                                                                                                                        | quests-travelling-merchant-journeys       |
| `world-039-lifecycle-fresh-world-failure-cleanup.md`                           | 🔴 | XS     | ~~world-033~~                                                                                                                                                                                                                                                                              | -                                         |
| `world-terrain-009-seasonal-ground-and-grass-appearance.md`                    | ⚪ | M      | -                                                                                                                                                                                                                                                                                          | -                                         |
| `world-terrain-015-water-reflection-content-budget.md`                         | ⚪ | S      | -                                                                                                                                                                                                                                                                                          | -                                         |
| `world-terrain-050-agent-performance-render-census-and-lod.md`                 | 🔴 | M      | ~~world-terrain-041~~                                                                                                                                                                                                                                                                      | -                                         |
| `world-terrain-051-lifecycle-resident-ground-authority-completion.md`          | 🔴 | S      | ~~world-terrain-044~~                                                                                                                                                                                                                                                                      | -                                         |
| `world-terrain-052-lifecycle-resident-local-water-agent-authority.md`          | 🔴 | M      | ~~world-terrain-044~~, ~~world-terrain-045~~                                                                                                                                                                                                                                               | -                                         |

---

## In progress

| File                                                      | Summary                                                               | Pri | Effort | Depends         |
| --------------------------------------------------------- | --------------------------------------------------------------------- | --- | ------ | --------------- |
| `2026-08-17--149--shader-program-first-use-hitch.md`      | Phase C: `Green` / `MI_WindowGlass` / `Wood`                          | 🔴  | M/L    | -               |
| `settlements-003-colony-bootstrap.md`                     | Stages 1/3 implemented; Stages 2/4 (live materialization/streaming) deferred — see plan's "Implementation status" | 🔴  | L      | ~~world-019~~, ~~settlements-npcs-028~~ |
| `settlements-npcs-024-household-owned-profession-workplaces.md` | Stage 1 implemented; Stage 2 (profession-aware yard sizing) not started | 🔴  | M      | ~~settlements-npcs-002~~ ~~settlements-npcs-011~~ |
| `settlements-npcs-025-resource-storage-visualization.md`  | Stages 2/3A implemented on `main`; Stage 3B (open-container fill) remains; visual checks user-owned | ⚪  | M      | ~~settlements-npcs-009~~, ~~settlements-npcs-010~~ |
| `world-015-seed-library-and-persistent-worldgen-cache.md` | Library + coarse cache shipped; §14 second landmark cache namespace deferred; §20 measurements unperformed | 🔴  | L      | ~~world-013~~ |
| `world-terrain-010-waterways-and-vegetation.md`           | Phases 2/8/9 deferred — see plan's "Implementation status"            | 🟡  | M      | -      |

---

## Planned

> 💡 - plan have `-implementation-notes.md`, ◼️ - have not

| File                                                                           | Pri | Effort | Depends                                                                                                                                                                                                                                                                                    | Roadmap                                   |
| ------------------------------------------------------------------------------ | --- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------- |
| 💡 `items-player-028-npc-player-storage-access-policies.md`                    | 🔴 | M      | ~~items-player-027~~                                                                                                                                                                                                                                                                       | companions                                |
| 💡 `items-player-032-npc-player-storage-resource-and-context-rules.md`         | 🟡 | L      | items-player-028                                                                                                                                                                                                                                                                           | companions                                |
| 💡 `items-player-014-rope-pullable-resource-transport.md`                      | 🟡 | M      | ~~155~~, ~~122~~                                                                                                                                                                                                                                                                           | physical-resource-storage-and-logistics   |
| 💡 `settlements-npcs-022-household-help-and-age-based-work-participation.md`   | 🔴 | M      | ~~settlements-npcs-002~~                                                                                                                                                                                                                                                                   | npc-professions-households-and-age        |
| 💡 `npc-037-stale-work-contract-target-discovery-and-notice-cleanup.md`        | 🔴 | M      | ~~npc-018~~, ~~npc-028~~                                                                                                                                                                                                                                                                   | -                                         |
| 💡 `quests-progression-040-lost-treasure-chronicles-dark-forest-estate-alpha-bear-and-treasure-map.md` | 🔴 | L      | ~~quests-progression-039~~, ~~quests-progression-009~~, ~~quests-progression-036~~, ~~fauna-022~~                                                                                                                                                                                          | quests-lost-something-chronicles          |
| 💡 `quests-progression-041-lost-treasure-chronicles-dungeon-binding-and-persistent-collapsed-access.md` | 🔴 | L      | quests-progression-040, ~~quests-progression-026~~, ~~quests-progression-027~~, ~~world-024~~                                                                                                                                                                                              | quests-lost-something-chronicles          |
| 💡 `quests-progression-042-lost-treasure-chronicles-expedition-remains-journal-and-missing-key-trail.md` | 🔴 | L      | quests-progression-041, ~~quests-progression-027~~, ~~quests-progression-026~~, ~~world-024~~                                                                                                                                                                                              | quests-lost-something-chronicles          |
| 💡 `quests-progression-043-lost-treasure-chronicles-survivor-site-missing-key-and-final-dungeon-access.md` | 🔴 | L      | quests-progression-042, quests-progression-041, ~~world-024~~                                                                                                                                                                                                                              | quests-lost-something-chronicles          |
| ◼️ `quests-progression-044-lost-treasure-chronicles-final-treasure-claims-and-resolution.md` | 🔴 | L      | quests-progression-043, quests-progression-042, ~~quests-progression-027~~                                                                                                                                                                                                                 | quests-lost-something-chronicles          |
| ◼️ `quests-progression-045-lost-treasure-chronicles-property-grant-deed-and-persistent-land-reward.md` | 🔴 | L      | quests-progression-044                                                                                                                                                                                                                                                                     | quests-lost-something-chronicles          |
| ◼️ `quests-progression-046-lost-treasure-chronicles-integration-legacy-catch-up-and-superseded-quest-cleanup.md` | 🔴 | L      | quests-progression-045, quests-progression-044, quests-progression-043, quests-progression-042, quests-progression-041, quests-progression-040, ~~quests-progression-039~~, ~~quests-progression-038~~, ~~quests-progression-037~~, ~~quests-progression-027~~, ~~quests-progression-009~~ | quests-lost-something-chronicles          |
| 💡 `quests-progression-010-abandoned-gold-mine-colony.md`                      | 🔴 | M      | ~~world-terrain-017~~, ~~world-018~~, ~~world-019~~, ~~settlements-npcs-026~~, ~~settlements-npcs-027~~, ~~settlements-npcs-028~~, settlements-003, ~~settlements-004~~, ~~quests-progression-002~~                                                                                        | quests-abandoned-gold-mine-colony         |
| 💡 `quests-progression-053-hunters-brotherhood-competing-hunting-strategies.md` | 🟡 | L      | ~~quests-progression-049~~                                                                                                                                                                                                                                                                 | quests-hunters-brotherhood                |
| ◼️ `quests-progression-054-hunters-brotherhood-exceptional-animal-finale.md`   | 🟡 | L      | quests-progression-053                                                                                                                                                                                                                                                                     | quests-hunters-brotherhood                |
| 💡 `items-player-044-shoulder-and-forearm-equipment-slots.md`                  | 🟡 | M      | ~~items-player-039~~                                                                                                                                                                                                                                                                       | -                                         |
| 💡 `world-terrain-039-n8ao-post-process-cost-budget.md`                        | 🔴 | M      | -                                                                                                                                                                                                                                                                                          | -                                         |
| 💡 `quests-progression-058-injured-dog-discovery-thread.md`                    | 🟡 | M      | ~~quests-progression-057~~, ~~items-player-046~~, ~~fauna-011~~                                                                                                                                                                                                                            | -                                         |
| 💡 `settlements-npcs-043-settlement-cultivation-hydration-rain-and-farmer-watering.md` | 🔴 | L      | ~~settlements-npcs-001~~, ~~settlements-npcs-002~~, ~~settlements-npcs-030~~                                                                                                                                                                                                               | quests-professions-and-world-consequences |
| 💡 `settlements-npcs-044-authored-outpost-occupants-and-construction-lifecycle.md` | 🔴 | L      | ~~world-031~~                                                                                                                                                                                                                                                                              | quests-professions-and-world-consequences |
| 💡 `quests-progression-060-builder-finish-local-well.md`                       | 🔴 | M      | settlements-npcs-043                                                                                                                                                                                                                                                                       | quests-professions-and-world-consequences |
| 💡 `quests-progression-061-builder-repair-or-complete-palisade.md`             | 🟡 | M      | -                                                                                                                                                                                                                                                                                          | quests-professions-and-world-consequences |
| 💡 `quests-progression-063-healer-injured-resident.md`                         | 🟡 | M      | ~~npc-025~~, ~~items-player-046~~, ~~quests-progression-015~~, ~~quests-progression-016~~                                                                                                                                                                                                  | quests-professions-and-world-consequences |
| 💡 `quests-progression-065-blacksmith-missing-tools.md`                        | 🟡 | M      | ~~settlements-npcs-002~~, ~~settlements-npcs-016~~, ~~settlements-npcs-017~~, ~~settlements-npcs-021~~, settlements-npcs-024, ~~quests-progression-015~~, ~~quests-progression-016~~, ~~quests-progression-055~~                                                                           | quests-professions-and-world-consequences |
| 💡 `settlements-npcs-049-merchant-wealth-tiers-and-travel-party-profile.md`    | 🔴 | L      | ~~settlements-npcs-048~~, ~~npc-053~~, ~~items-player-047~~, ~~npc-030~~                                                                                                                                                                                                                   | quests-travelling-merchant-journeys       |
| 💡 `npc-054-npc-desired-gifts-gift-acceptance-and-relationship-rewards.md`     | 🔴 | L      | ~~npc-053~~                                                                                                                                                                                                                                                                                | quests-travelling-merchant-journeys       |
| 💡 `quests-progression-069-quest-offer-pacing-and-conservative-settlement-gating.md` | 🔴 | M      | ~~quests-progression-004~~, ~~quests-progression-033~~, ~~quests-progression-034~~                                                                                                                                                                                                         | quests-and-reputation                     |
| 💡 `world-terrain-042-medicinal-herb-meadow-patches.md`                        | 🟡 | M      | ~~world-terrain-049~~                                                                                                                                                                                                                                                                      | -                                         |
| 💡 `quests-progression-070-boar-at-the-medicinal-meadow-systemic-settlement-problem.md` | 🟡 | L      | ~~npc-057~~, world-terrain-042                                                                                                                                                                                                                                                             | -                                         |
| 💡 `npc-032-expedition-needs-and-survival.md`                                  | 🔴 | L      | ~~npc-029~~, ~~npc-017~~, ~~npc-025~~, ~~settlements-npcs-028~~, items-player-028, items-player-032                                                                                                                                                                                        | companions                                |
| 💡 `settlements-022-founded-settlement-live-runtime-and-streaming.md`          | 🔴 | L      | ~~settlements-021~~                                                                                                                                                                                                                                                                        | quests-abandoned-gold-mine-colony         |
| 💡 `ui-input-025-road-travel-autopilot.md`                                     | 🔴 | L      | world-035, ~~fauna-003~~, ~~npc-006~~                                                                                                                                                                                                                                                      | -                                         |
| 💡 `npc-033-companion-combat-cooperation.md`                                   | 🔴 | L      | ~~npc-029~~, npc-032, ~~items-player-027~~, ~~npc-025~~                                                                                                                                                                                                                                    | companions                                |
| 💡 `npc-034-expedition-shared-work-and-activities.md`                          | 🔴 | M      | ~~npc-029~~, npc-032                                                                                                                                                                                                                                                                       | companions                                |
| 💡 `settlements-npcs-051-travelling-merchant-road-party-travel-and-threat-cooperation.md` | 🔴 | L      | world-035, settlements-npcs-049, settlements-npcs-050, ~~settlements-npcs-048~~, ~~npc-048~~, ~~npc-057~~                                                                                                                                                                                  | quests-travelling-merchant-journeys       |
| 💡 `world-035-regional-road-travel-itinerary-and-adaptive-traveller-execution.md` | 🔴 | L      | -                                                                                                                                                                                                                                                                                          | quests-travelling-merchant-journeys       |
| ◼️ `settlements-npcs-052-persistent-economic-work-cargo-and-local-transfer-conservation.md` | 🔴 | M      | ~~settlements-npcs-019~~, ~~settlements-npcs-034~~                                                                                                                                                                                                                                         | -                                         |
| ◼️ `settlements-npcs-054-transport-carrier-death-and-cargo-disposition.md`     | 🔴 | S      | ~~settlements-npcs-019~~                                                                                                                                                                                                                                                                   | -                                         |
| 💡 `items-player-051-cave-aware-dropped-item-continuity.md`                    | 🔴 | M      | ~~world-027~~                                                                                                                                                                                                                                                                              | -                                         |
| 💡 `world-036-lightweight-unloaded-shipwreck-and-tower-lookup.md`              | 🟡 | M      | ~~world-028~~                                                                                                                                                                                                                                                                              | -                                         |
| 💡 `fauna-045-cave-surface-perception-boundary-and-entrance-awareness.md`      | 🔴 | M      | ~~world-027~~, ~~fauna-042~~                                                                                                                                                                                                                                                               | -                                         |
| 💡 `npc-061-time-skip-and-reification-surface-placement-validity.md`           | 🔴 | M      | ~~world-terrain-044~~                                                                                                                                                                                                                                                                      | -                                         |
| 💡 `items-player-052-settlement-tool-ownership-and-social-acquisition.md`      | 🟡 | M      | -                                                                                                                                                                                                                                                                                          | -                                         |
| ◼️ `tools-019-debug-tooling-lifecycle-ownership.md`                            | 🟡 | S      | -                                                                                                                                                                                                                                                                                          | -                                         |
| 💡 `quests-progression-074-small-quest-offer-scope-and-prioritization.md`      | 🟡 | S      | quests-progression-069                                                                                                                                                                                                                                                                     | quests-and-reputation                     |
| ◼️ `npc-062-ubc-runtime-material-darkness-and-authored-outfit-preservation.md` | 🔴 | M      | ~~tools-017~~, ~~npc-055~~                                                                                                                                                                                                                                                                 | -                                         |
| 💡 `quests-progression-081-quest-ui-completion-readiness-projection.md`        | 🔴 | S      | ~~quests-progression-075~~, ~~ui-input-037~~                                                                                                                                                                                                                                               | -                                         |
| ◼️ `ui-input-045-equipment-body-layout.md`                                     | 🟡 | S      | ~~ui-input-040~~                                                                                                                                                                                                                                                                           | -                                         |

---

## Verification needed

Implementation is complete enough for browser/manual verification. Per the 2026-10-26 author clarification and [Snapshot 3](./archive/README.md#snapshot-3--2026-10-26), implemented plans that awaited only manual checks were archived with their truthful `verification needed` / `done` status. Historical checklists remain on the archived plan files.

Active residual verification-needed plans (unfinished implementation remains):

## Do sprawdzenia

| Plan | Sprawdź |
|------|---------|
| `world-terrain-053-snow-patch-thresholds-and-grass-burial.md` | Browser A/B via `?snow=0..1` (patches, grass burial, melt, rain intact); FPS vs baseline. Automated field tests passed; GPU look **UNVERIFIED** in implementation session. |
| `items-player-012-player-gathering-and-fire-cooking-polish.md` | Fish cooking + Quick Actions fire category: browser/gameplay check. **Tree branch gathering changes in this plan are still pending implementation** — do not treat the plan as fully shipped. |
| `world-terrain-040-vegetation-render-budget-v2.md` | Stage 1: user benchmark/browser verification. **Stages 2/3 are not started** — retain as active residual work. |

---

## Recent context

Done / verification-needed plans that are no longer needed beside active work live in [archive/](./archive/README.md) (see Snapshot 3). Active unfinished stages and drafts/planned/in-progress plans remain in the sections above. Dependency resolution still finds archived plans.

| File | Why it's here |
| ---- | ------------- |
| `items-player-012-player-gathering-and-fire-cooking-polish.md` | Partial: fish/QA shipped; tree-branch gathering still pending |
| `world-terrain-040-vegetation-render-budget-v2.md` | Stage 1 only; stages 2/3 not started |

---

## Plan naming

New plans use:

`<domain>-<id>-<title>.md`

The ID is three-digit and local to the domain.

Existing legacy plans keep their current date/global-ID names and are not renamed.

## Plan domains

New plans declare a primary `Domain:` in frontmatter. Use optional `Tags:` only for genuinely secondary domains.

| Domain | Summary | Subdomains |
|---|---|---|
| `ai` | AI-assisted dialogue, characterisation and related AI systems | `dialogue`, `characterisation`, `generation`, `agents` |
| `fauna` | Wildlife, predators/prey and ecosystem simulation | `predation`, `prey`, `habitat`, `reproduction`, `migration`, `lifecycle`, `population`, `domestication` |
| `items-player` | Player inventory, items, tools and item interaction | `inventory`, `items`, `tools`, `interaction`, `player-needs` |
| `npc` | NPC behaviour, needs, goals, traits, decisions and actions | `behavior`, `needs`, `goals`, `decision-making`, `relationships`, `memory`, `lifecycle`, `work`, `combat`, `dialogue` |
| `persistence` | Save data, storage, serialization and migrations | `save-data`, `serialization`, `storage`, `migration` |
| `quests-progression` | Quests, relationships, progression and rewards | `quests`, `relationships`, `progression`, `rewards` |
| `settlements` | Settlements, buildings, population, resources and development | `buildings`, `population`, `resources`, `development`, `economy` |
| `settlements-npcs` | Households, schedules, settlement NPCs and local economy | `household`, `schedules`, `economy`, `logistics`, `social` |
| `tools` | Development tools, diagnostics and automation | `debug`, `development`, `diagnostics`, `automation` |
| `ui-input` | UI, HUD, input and player interaction | `hud`, `menus`, `input`, `interaction`, `feedback` |
| `world` | World state, resources, places, time, weather and simulation | `resources`, `places`, `time`, `weather`, `events`, `simulation` |
| `world-terrain` | Terrain, chunks, vegetation, roads and world rendering | `terrain`, `chunks`, `vegetation`, `roads`, `landmarks`, `rendering` |

`Domain` means "where to look first". Use `Tags` sparingly.

`Roadmap` is optional, and should point to a file in `docs/roadmap` folder.

## Next plan IDs

- ai: `001`
- fauna: `049`
- items-player: `062`
- npc: `065`
- persistence: `008`
- quests-progression: `083`
- settlements: `024`
- settlements-npcs: `058`
- tools: `020`
- ui-input: `046`
- world: `040`
- world-terrain: `055`

This ids section is maintained automatically from the plan files.

Next ideas: [NEXT-IDEAS.md](./NEXT-IDEAS.md)
Loose ends: [LOOSE-ENDS.md](./LOOSE-ENDS.md)

---

## Active threads

Current dependency chains and architectural threads. Not a replacement for `Depends on`.

```text
Combat & weapons
  (155 inventory instances) → (160 HQ melee) → (161 weapon maintenance)
  (150 combat mode) + (155) → (162 bows/ranged) → (177 NPC combat melee+ranged — no live AI trigger yet) → 179 animal attack & NPC defense

Household economy & storage
  (106 food/cooking) + (069 household resources) + (122 water distribution) → (156 storage logistics)
      → 152 NPC food/drink help
      → 159 fishing/preservation/bait
  (122) → (126 seed planting), (127 player-built well)

World-driven quests
  (049) + 093 + (110) → 132 → 016 (settlement opportunities, wolf-den pressure slice)

Rendering performance
  (157 PointLight budget 16) → 149 shader program first-use hitch
  chunk mesh streaming → world-terrain-004

Construction & lodging
  (109) → (111) → (169)
  (165) → (168) → (169)

Natural vegetation
  (140 landscape flora) → (172 natural crop lifecycle) → (126 seed planting)
```

---

## Index completeness

Every base plan in this folder belongs to exactly one section above. Implementation notes, reviews, `README.md`, `NEXT-IDEAS.md`, `LOOSE-ENDS.md` and `archive/` are excluded.

When a plan reaches `done` and is no longer relevant to an active dependency, it stays here until the next deliberate archive snapshot.

Keep summaries short. The README should contain only information useful for choosing, planning or verifying another plan. Implementation detail belongs in the plan and its companion notes/reviews.
