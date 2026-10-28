# Seedvale — Loose Ends

Krótkie notatki o pobocznych blokadach, konkretnych bugach i brakujących mechanizmach odkrytych podczas implementacji planów, ale poza ich zakresem.

To nie jest issue tracker ani historia zmian. Gdy wpis zostanie naprawiony, pokryty planem albo stanie się nieaktualny — usuń go. Gdy dojrzeje do osobnej pracy — przenieś go do planu / issue zamiast rozbudowywać tutaj.

Format: `- [ ] YYYY-MM-DD — opis (plan/plik, jeśli istotne)`

## Caves / terrain

- [ ] 2026-08-24 — `Przygotuj teren` na skalistym/górskim gruncie wymaga narzędzi, ale nie ma kary za trudność terenu; jeśli mechanika ma rozróżniać soil/sand/rock także dla większych prac, rozszerzyć istniejący `requiredWork` zamiast dodawać osobny system (world-terrain-002).

## Quest-enabling world mechanics

- [ ] 2026-09-12 — settlements-007 wystawia read-only `SettlementsManager.getStructureSnapshot`/`listRepairProblems`, ale żaden quest jeszcze tego nie konsumuje. Po `quests-progression-030`/`031` dodać `structure:<structureId>:repair` opportunity tym samym mechanizmem co wolf-den pressure (016) — nie kopiować repair state do quest layer. Recon: `docs/reviews/2026-09-13--quest-system-architecture-recon.md`.
- [ ] 2026-09-13 — Authored `wilki-pod-osada` i generated `world:wolf-den-pressure:*` opowiadają tę samą historię destroy-den; authored `zagubiona-owca` (`find_animal`) nakłada się na `world:lost-livestock:*`. Nie scalać w infrastrukturze — osobny content cleanup po 030/031.

## Quest system architecture

- [ ] 2026-09-14 — Quest giver / target lifecycle: brak spójnej polityki dla śmierci, zniknięcia albo zmiany roli NPC będącego giverem, beneficiary lub wymaganym targetem aktywnego questa. Do ustalenia: invalidation, przejęcie przez innego NPC, alternatywne hand-in i konsekwencje dla outcome. Recon: `docs/reviews/2026-09-13--quest-system-architecture-recon.md`.
- [ ] 2026-09-14 — Deadlines / time pressure: brak ogólnego mechanizmu typu „do jutra”, „przed zmrokiem”, „zanim ktoś umrze”. Powinien opierać się na authoritative world time i lifecycle questa, bez quest-local zegara równoległego do symulacji. Recon: `docs/reviews/2026-09-13--quest-system-architecture-recon.md`.
- [ ] 2026-09-14 — Truly dynamic runtime opportunities: `quests-progression-031` rozwiązuje live gating dla stabilnych source identities znanych przy boot/rebuild, ale nie dla nowych source identities powstających całkowicie w runtime. Potrzebny osobny mechanizm dopiero przy konkretnym consumerze, bez ogólnego `QuestFactory` na zapas. Recon: `docs/reviews/2026-09-13--quest-system-architecture-recon.md`.
- [ ] 2026-09-14 — NPC jako resolver / współuczestnik: quest runtime słabo modeluje sytuację, gdy NPC sam rozwiązuje problem albo wykonuje część tego samego zadania razem z graczem. Docelowo reuse world facts / source state i quest outcomes zamiast player-only duplikacji akcji. Recon: `docs/reviews/2026-09-13--quest-system-architecture-recon.md`.

## Fauna

- [ ] 2026-09-14 — `settlements-013` świadomie używa nowego paddock haystack jako **nieskończonego** źródła pożywienia dla vendor horses. Docelowo zastąpić to finite authoritative hay stock + realnym consumption/replenishment, bez łączenia z istniejącym sleep haystack i bez tworzenia osobnej horse-food economy. Paddock haystack ma pozostać food-only, bez capability noclegu.
- [ ] 2026-09-12 — `wolfDen` pressure activation (`shouldActivateWolfDenProblem`) może dospawnować wilki poza initial fill; te osobniki są `normal`, nawet gdy oryginalna alfa zginęła. fauna-022 przypisuje alfę tylko do slotu 0 zwykłego initial fill (den ma `respawnIntervalDays: Infinity`). Jeśli odtworzony pack ma znowu mieć alfę, rozszerzyć ten sam slot/identity mechanizm, nie dodawać RNG ani osobnego alpha spawnera.
- ~~2026-09-02 — frenzy branches omit `cancelSourceTarget()`~~ — **resolved** by [`fauna-043`](./archive/fauna-043-frenzy-source-target-claim-cleanup.md) (implementation 2026-09-19; browser scavenger scenario remains user-owned).
- [ ] 2026-09-08 — initial livestock `productionReadyAtDays` jest seedowane runtime RNG, a potem persystowane. Pierwsze utworzenie tej samej deterministycznej sztuki może więc dać różny stagger; użyć stabilnego rolla z identity/seed.
- [ ] 2026-09-18 — `fauna-039` zaimplementował real `AnimalDef.pack`/`PackConfig`, equipped `AnimalPackState` i death-handoff ground `saddlebags` container jako authority dla pack-transportu. [`settlements-npcs-047`](./archive/settlements-npcs-047-merchant-transport-capacity-infrastructure.md) i [`settlements-npcs-048`](./archive/settlements-npcs-048-merchant-pack-animal-assignment-and-journey-continuity.md) are **`verification needed`** on current `main` (not planned); pack-animal continuity residual is [`settlements-npcs-057`](./settlements-npcs-057-agent-performance-offscreen-pack-animal-continuity.md). Do not reinvent `PackConfig` / synthetic saddlebags visuals — verify against `fauna/animalPack.ts` and `items/container.ts` when extending.

## Settlement / world correctness

- [ ] 2026-09-15 — Village one-time spawners (`shovel`/`axe`/`pitchfork`/`sickle` in `createItemSpawners.ts`) use `respawnTime = Infinity` with generated `spawner:${index}` ids, so a `WorldBundle` rebuild rematerializes them the same way the authored treasure map used to. `consumedWorldPickupIds` (quests-progression-036) only gates `extraOneTimePickups` with stable authored ids; village tools need their own stable ids before they can reuse that set.
- [ ] 2026-08-25 — `buildHouseWallCollidersLocal()` nadal iteruje tylko `def.walls`; `def.corners` nie mają własnego collidera. Zwykle maskują to sąsiednie ściany, ale corner przy otworze/door module nie ma takiego invariant — przy najbliższym dotykaniu house collision dodać jawne pokrycie/test.
- [ ] 2026-09-15 — `world/containerProp.ts`'s `createPlacedContainerProp()` renderuje identycznym proceduralnym box+lid meshem magazyn gracza, meble domu **i** wszystkie skrzynie-skarby w świecie (dark forest, systemic treasure sites, dungeon/cave loot) — bez rozróżnienia stanu zamknięta/otwarta/złupiona. `public/models/items/chest_prop_closed.glb` / `chest_prop_open.glb` / `chest_prop_ingots.glb` (Quaternius Ultimate RPG Pack, `docs/assets/MODELS.md` M91, catalog task 2026-09-15) są gotowe jako realny zamiennik z prawdziwym przełączaniem stanu (np. wg `isWorldContainerLooted`/emptiness). Dotyka `containerProp.ts`, `worldGeneratedContainers.ts`, `createPlacedContainers.ts`, `settlement/props.ts` — osobny plan, świadomie nie zrobiony przy okazji dodawania assetów do katalogu.

## Items / assets

- [ ] 2026-09-15 — `wooden_bucket` / `copper_bucket` GLBs (Fantasy Props MegaKit) were converted from FBX **without albedo textures**, so the mesh reads gold/metallic. First-pass tint in `items/items.ts`'s `tintBucketGlb` (`ITEM_DEFS` brown / copper) — applied by `createItemMesh` and the asset browser (`item:wooden_bucket` / `item:copper_bucket`). Verify visually, then either keep the tint or reconvert with MegaKit glTF textures (the pack glTF shares a huge bin — isolate materials, don't copy the whole kit). Pocket `whetstone` is unrelated: MegaKit `Whetstone` is a workshop grindstone and must not be wired to the item.

## Characters / presentation

- [ ] 2026-09-17 — Blender exports for custom UBC `male_blacksmith_outfit` and `male_{leather,steel}_bracers` are currently **invalid for skinned runtime use**: `gltf-transform inspect` shows no `JOINTS_0` / `WEIGHTS_0` and therefore no usable skin binding, despite source Blender objects having Armature modifiers. `bindAccessoryToPlayerSkeleton` will skip such assets. The rejected source GLBs were also huge (~63 MB blacksmith, ~28 MB leather bracers, ~60 MB steel bracers) because Blender embedded 4K PNG atlases; mesh data itself was small. Do not restore/commit these GLBs until export preserves UBC joint weights/skin and the existing asset pipeline downsizes/converts textures. Detailed note: `docs/blender/TROUBLESHOOTING.md`; forearm work: `items-player-044`.
- [ ] 2026-09-15 — UBC player (`items-player-033` / `034` / `036`) jest tylko męski. Żeńskie outfity (`Female_Peasant` / `Female_Ranger` / Knight / Noble / Wizard) i fryzury są w `_temp/` na tym samym rigu — nie robić osobnego pipeline, reuse `compose_ubc_player.py`.
- [ ] 2026-09-15 — Runtime outfit jest całym meshem od slotu `body` (Peasant / Ranger / Knight), nie modularnymi Arms/Body/Legs. Wizard / Noble czekają na wearable (szata / strój); `Knight_Cloth` zostaje `?player=` debug. Sloty head/arms/legs nadal bez własnych meshy. Draft per-slot: `items-player-037-ubc-runtime-per-slot-outfits.md`.

- [ ] 2026-09-15 — `?playerTint=brown` nie jest persystowany; character appearance (wybór koloru bez query) to osobna praca.
- [ ] 2026-09-18 — Dedicated Teen/child body models: children currently use scaled-down adult UBC Peasant (`member.scale`). Migrate when Base Human Pack / Quaternius Teen assets are purchased — do not invent proportions here.
- [ ] 2026-09-18 — Campfire social seating: add a bench / explicit seat anchors near settlement campfires so existing NPC seated presentation can use `Sitting_Idle_Loop` / `Sitting_Talking_Loop` without inventing fake sitting positions. Reuse settlement place/social state rather than adding an animation-only seating system; discovered while scoping `npc-055`.
- [ ] 2026-09-20 — Attractive UAL2 Source clips inventoried but not wired by `npc-055` (no exact current caller / no truthful match): `Farm_PickingTree`, `Farm_ScatteringSeeds`, `Fish_Cast` / `Fish_Reel` / `Fish_Reel_Failed` / `Fish_OH_Idle_Loop`; blacksmith hammer/sharpen, sheep shear, textile weave, drink, burial/dig still have no truthful Source clip. `Chest_Open` is already in `ual_humanoid.glb` but unwired until an NPC chest action exists. Wire only when a real simulation action exists.

## Off-screen simulation

- [ ] 2026-09-11 — off-screen `TransportOrder.execution` nie przesuwa potrzeb/vigoru/injury carrier NPC w czasie podróży. To ten sam brak co dla innych unloaded NPC, ale staje się istotny dla generic long-distance travel (`settlements-npcs-028` / `npc-029`). Naturalny seam: stanowy survival catch-up obok `resolveOffscreenTransportArrivals`, reuse istniejących `tickNeeds` / `tickVigorForSimulatedStep` / injury recovery helpers.
- [ ] 2026-09-12 — npc-029 accompany NPCs still unload with their home settlement (same detailed XOR off-screen rule as transport carriers). Visual follow therefore stops when the village streams out; long-distance live-agent travel with the player belongs with `settlements-npcs-028` / paid escort, not a companion-specific streaming owner.

## Quest / UI / interaction

- [ ] 2026-09-21 — Quest/UI/interaction audit follow-ups not promoted to dedicated plans: dropped-item group stable identity, the narrow `pendingReportOutcomeId` lifecycle invariant, and remaining legacy `promptLabel` action-semantics parsing. Review: `docs/reviews/2026-09-21--quest-ui-interaction-followups.md`.

## World lifecycle / rebuild

- [ ] 2026-10-28 — `SettlementsManager` startuje `EAGER_NEIGHBOR_COUNT` buildów sąsiadów domu niezależnie od pozycji gracza (także przy wczytaniu zapisu daleko od domu). `settlements-023` tylko odrzuca takie buildy przy publikacji, gdy gracz nie jest przy domu; sam zmarnowany koszt startowy pozostaje. Ewentualnie uzależnić eager start od znanej pozycji spawnu — osobno, z pomiarem startupu.
- [ ] 2026-09-21 — Player/world lifecycle audit follow-ups not promoted to dedicated plans: async spatial-audio revalidation, broader `buildWorldSystems()` partial-construction cleanup boundary, failed-rebuild diagnostic wording, and stale player-health persistence comments. Review: `docs/reviews/2026-09-21--player-world-lifecycle-followups.md`.
- [ ] 2026-09-20 — `buildWorldSystems()` (`src/app/worldBundle.ts`) has no general partial-allocation cleanup for a throw during its ~700-line synchronous critical-path construction. world-033 fixed the one confirmed concrete leak (home-settlement-(0,0)-resolution failure leaking `chunkManager`/`waterMirror`) by disposing right at that throw site, but a throw from a later call in that path (e.g. `createCaves`, `buildSettlementsManager`) still leaks whatever critical systems were already constructed before it. A general fix needs a bounded disposer stack across that whole function — deliberately not attempted here to keep world-033 scoped to the rebuild *transaction* (publish-or-dispose the already-fully-built `fresh` world), not general construction-failure hardening.

## Performance / rendering

- [x] 2026-10-27 — `src/world/createSky.test.ts` expected storm cloud opacity `0.8`, while current `createSky` yields `0.9`. Reproduced on unmodified `890b58ff` during review-026 P2 verification. Reconciled the stale assertion with the shipped `0.9` profile during the [verification follow-up](../reviews/2026-10-27--review-026-p2-verification.md); no cloud implementation or author-approved atmosphere changed.

- [ ] 2026-09-21 — Agent performance / simulation-boundary audit follow-ups that were **not** promoted to dedicated plans: camera-vs-simulation invariants, player-distance fidelity boundaries, broad Agent runtime-controller scope, fauna cadence/proximity reuse, ground/water query ownership, collider candidate volume watchlist, livestock duplicate-update diagnostic identity validation, NPC presentation/animation cost attribution, and shadow-cost ownership. Review: `docs/reviews/2026-09-21--agent-performance-and-simulation-boundary-followups.md`.
- [ ] 2026-09-18 — Po zamknięciu `world-terrain-038`: w `settlement-heavy` 027 settlement shadow nadal ciąży `decor` (~399k tris) oraz `houseStatic`; garden zostawił Dirt jako grounding caster (rośliny już no-shadow). Nie dokładać kolejnych `castShadow=false` bez benchmarku + visual OK. Submission/geometria → `settlements-019`; N8AO/post → `world-terrain-039`; terrain/vegetation shadow tylko jeśli świeży isolation wskaże dominację.

## Performance

- [ ] 2026-10-28 — (częściowo załatwione memoizacją `riverShoreQuery`, `29b42a09`; wpływ osobno niezmierzony — po zmianie zrobić trace i sprawdzić, czy zostały wywołania fauny/osad) Trace (settlement-heavy i forest, SHA `98ddfbd1`): `nearestRiverShoreCandidate` (`riverNetwork.ts`) ≈ 3,2–3,4 s self na oknie 29,5 s (~11 % czasu CPU, w obu scenariuszach), wołane przez `chunkManager.riverShoreQuery` głównie z `resolveWaterBodyShore`/`buildInteractables` (~2,4–2,6 s) i drugim callerem (~0,7 s, prawdopodobnie fauna). Do sprawdzenia: czy kandydat brzegu jest liczony co klatkę mimo braku ruchu gracza/zwierzęcia; rozważyć cache/kadencję w istniejącym `riverShoreQuery`, nie nowy mechanizm. Dowód: `docs/performance/trace-results/*98ddfbd1.cpu-profile.txt`, raport `docs/performance/results/2026-10-28--win-a1p-trace-analysis.md`.
- [ ] 2026-10-28 — `scripts/analyze_trace.py` nie używa `timeDeltas` z `ProfileChunk` (raportuje sample counts); do czasu poprawy używać `scripts/perf/cpu_profile_summary.py`.
