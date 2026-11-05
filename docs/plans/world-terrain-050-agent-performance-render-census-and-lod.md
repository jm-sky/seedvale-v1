# Plan: Agent Performance — Render Census and LOD

**Created:** 2026-09-21
**Status:** `in progress` 🔄
**Type:** optimization
**Priority:** high · **Effort:** M
**Depends on:** ~~world-terrain-041~~
**Domain:** `world-terrain`
**Subdomains:** `rendering`
**Tags:** `agent-performance` `npc` `fauna` `lod`

## Cel

Zmniejszyć koszt renderowania NPC i fauny przez rozszerzenie istniejącego presentation-only LOD/cullingu, bez wpływu na symulację, lifecycle agentów ani world state.

## Dlaczego

Aktualne benchmarki wskazują NPC + fauna jako najsilniejszy pojedynczy kandydat do poprawy FPS. Ten plan ma najpierw ustalić, które elementy renderingu agentów generują koszt, a dopiero potem rozszerzyć istniejące mechanizmy o najmniejszą zmianę o wysokim ROI.

## Zakres draft

Po reconie plan powinien ustalić:

- koszt według rodzin assetów i typów agentów,
- udział skinned meshes, draw calls, triangles, animation/presentation,
- zachowanie w near / mid / far,
- które części agentów można bezpiecznie ograniczać lub ukrywać,
- jak rozszerzyć istniejący agent presentation LOD zamiast tworzyć równoległy visibility system,
- jakie reguły ważności muszą wymuszać pełną prezentację.

## Guardrails

- Rendering nie może sterować symulacją.
- `visible`, frustum/camera state ani presentation LOD nie mogą decydować o istnieniu lub update symulacji.
- Reuse istniejących mechanizmów z `world-terrain-041`.
- Bez nowego globalnego managera visibility, jeśli obecne mechanizmy wystarczą.
- Bez model swapping/HLOD zanim pomiar nie pokaże, że prostszy LOD jest niewystarczający.
- Nie optymalizować na podstawie samej liczby obiektów — decyzje muszą wynikać z benchmarków/census.
- Dodać JSDoc do ważnych nowych publicznych/architektonicznych funkcji lub klas; gdy pomaga preflightowi, użyć `@domain world-terrain`.

## Out of scope

- zmiana decyzji/needs/movement NPC,
- zmiana fauna simulation cadence,
- streaming/despawn agentów,
- oddzielenie simulation position od `Object3D`,
- szeroki refactor asset pipeline.

## Slice A1′ — konserwatywne bounds dla NPC skinned meshes (autoryzowane 2026-10-28)

Źródło: `docs/research/v1-revival/2026-10-27--revival-audit--npc-fauna-rendering.md` (A1′). Ten plan pozostaje właścicielem (domain `world-terrain`, rendering). Rekon historyczny (2026-09) zastąpiony audytem rewival; zweryfikowano na `beb17519`.

**Stan zweryfikowany w kodzie:**

- `src/characters/assembleCharacter.ts::rebindAllSkinned` ustawia `frustumCulled=false` na przypiętych head/hair/eq (współdzielone z graczem — `PlayerController`, więc **nie** zmieniamy go tam).
- Body GLB meshes miały natywny culling z leniwą sferą z pierwszej pozy.
- `NpcAgent.create` → `assembleCharacter` (kit) lub `loadGltfAnimated` (legacy) → `new NpcAgent` → konstruktor (`prepareProp`, wrapper, `member.scale`). Capsule fallback: brak skinned meshes.

**Implementacja:**

- `src/render/actorCullBounds.ts::installActorCullBounds(root)` — jedna współdzielona sfera na aktora (środek = unia bind-pose boxów skinned meshes, promień = półprzekątna + wysokość), liczona w przestrzeni `root`, zapisywana per mesh w jego lokalnej przestrzeni. Ustawia tylko `boundingSphere`/`frustumCulled`; nigdy `visible`. Nieznane bounds → `frustumCulled=false` (fail open).
- Jedno wywołanie: `NpcAgent` constructor, zaraz po utworzeniu wrappera, przed startem animacji (pokrywa kit i legacy; capsule = no-op).
- Testy: `src/render/actorCullBounds.test.ts`.
- Follow-up po [review A1′](../reviews/2026-10-28--029--world-terrain-050-a1-skinned-mesh-culling-review.md): F1–F3 poprawione; kontrakt transformacji, regresje i próbkowanie rzeczywistych animacji kit/legacy opisano w [implementation notes](implementation-notes/world-terrain-050-agent-performance-render-census-and-lod-implementation-notes.md).

**Poza zakresem (wymaga osobnej zgody):** A2′ fauna, A5′ eyes/eyebrows LOD, A0b, A3, A6, A7, settlement/grass, benchmarki, zmiany `settlements-023`. Gracz (`PlayerController`/`ubcAccessoryBind`) bez zmian.

**Weryfikacja:** AI — type-check, lint, testy jednostkowe, build. Autor — browser: obrót kamery, krawędzie frustum, walk/attack/sleep, death/corpse, cienie z bliska, kit i legacy NPC. Popping/znikające części/złe cienie = failure → revert commita.

**Liczniki do pomiaru (później, porównywalna scena/kamera, 3 powtórzenia):** `main.byBucket npcFamily:*` (spadek), render p50/p95 (nie gorzej), shadow submissions (bez zmiany przy casterach ≤36 m).

## Gameplay visibility / detection — author direction (2026-11-05; Astra → Opus review pending)

**Product requirement, not merely a performance optimization:** NPCs and animals, including hostile actors, must not be revealed to the player through solid walls, around opaque corners or behind other fully obstructing world geometry. The current frustum/LOD work does **not** satisfy this requirement. See [NPC/fauna visibility V2 assessment](../research/v1-revival/2026-10-30--npc-fauna-visibility-v2-analysis.md) for the distinction between native frustum culling, camera occlusion and sensory perception. This section captures author intent for review; it does **not** authorize implementation or change the status of existing A1′ work.

### Expected gameplay behavior

- **Physical visibility:** buildings, walls, corners, rocks and terrain should block direct sight where their actual opaque geometry does. A partly exposed actor must remain partly visible; do not hide the entire model because a single center ray is blocked. Consider doorways, windows, height differences, thin/transparent geometry and moving blockers to avoid false hiding or popping.
- **Light / distance / stealth:** add **lightweight** detection modifiers for darkness versus light sources, distance, and stealth (e.g. crouching, slower movement or cover). Keep the effect subtle, explainable and testable; no hard-coded detection ranges or thresholds are approved yet.
- **No magical invisibility:** a physically visible actor on open ground must not disappear simply because a gameplay detection check fails. Distinguish visual rendering from awareness, identification, targeting/UI indicators and any optional last-known contacts. Do not add V2 ghost placeholders or a wholesale perception port by default.
- **AI perception is a separate contract:** whether NPCs/animals see, hear or remember the player/each other requires its own assessment against existing V1 AI/fauna perception. Camera visibility must not directly dictate NPC decisions or autonomous world simulation.
- **Presentation must not own simulation/lifecycle:** preserve entity identity, movement, offscreen simulation, persistence, corpses/loot, shadow behavior and existing `mesh.visible` ownership. Gameplay LOS must not accidentally despawn actors or suppress their authoritative updates.

### Review / planning handoff

1. **Astra:** assess the desired player-facing behavior, separate physical occlusion from detection/awareness and propose the smallest coherent V1 integration, including whether gameplay visibility belongs in a distinct cross-domain plan rather than inside the performance-only `world-terrain-050` implementation scope.
2. **Opus:** verify actual V1 rendering, geometry/collision, player observation and NPC/fauna perception ownership in code; identify architectural boundaries, partial-occlusion correctness, cache/invalidation, test scenarios and regression/performance risks. Compare V2 mechanisms only as selective reference.
3. **Before implementation:** specify observable acceptance cases (fully hidden behind opaque wall; emergence around corner; partially exposed silhouette; open terrain at day/night and near/far; stealth and light-source interaction; doors/windows/terrain; UI/targeting; AI and save/load unaffected). Benchmark rendering optimization separately from gameplay correctness.

**Scope boundary:** the performance culling experiment in the linked assessment remains optional and measurement-gated. The gameplay requirement is independent of whether removing occluded draws improves FPS. No gameplay LOS/detection code is approved by this amendment.


## Astra requirements review — 2026-11-05

**Verdict: direction supported; ready for Opus architecture review, not implementation.** Keep A1′ and the performance scope unchanged. Gameplay detection needs a separate cross-domain plan after the author resolves the product questions below; this section is its requirements/recon input, not an approved algorithm or a new task allocation.

**Evidence:** static connector inspection at V1 [`72f33bbb`](https://github.com/jm-sky/seedvale-v1/tree/72f33bbba32f5684644e36d004b9e3b6bf11f3b8), V2 [`9ba54815`](https://github.com/jm-sky/seedvales-v2/tree/9ba54815493b886eb1bdce032f5209aeb2856c37). No runtime, visual, test, build or benchmark execution. Links below identify inspected sources; findings describe these pins, not future main. Prior October 30 research remains historical performance evidence.

### 1. Requirements that must remain separate

| Contract | Authority and result | Must not imply |
| --- | --- | --- |
| Physical camera visibility | Opaque scene geometry and depth determine which actor fragments reach the image. Partial silhouettes remain visible. | A failed awareness roll makes an exposed body disappear. |
| Player observation / information | Player observation resolves what can be identified and exposed through labels, prompts, map contacts and targeting assistance. | Knowing an identity grants a live position through a wall. |
| AI perception / memory | Each observer evaluates relevant stimuli in world space, independently of the player camera. | An off-camera NPC stops sensing, moving or fighting. |
| Optional draw suppression | Rendering may skip a provably occluded submission if it saves net frame time. | “Submitted to GPU” means “visible through a wall,” or no FPS gain means gameplay work is unnecessary. |

**Important correction to the motivating diagnosis:** absence of CPU actor occlusion culling does not establish that opaque walls reveal character pixels. Ordinary depth testing already resolves physical occlusion and partial visibility. First reproduce the leak and distinguish body pixels, CSS2D overlays, map dots, targeting assistance, transparent/cutaway walls and third-person camera peeking. A geometry/material defect belongs to its rendering owner; an information leak belongs to observation consumers. Do not introduce model hiding to compensate for an unidentified leak.

### 2. Verified V1 findings and minimum corrective direction

Severity below is relative to the requested gameplay contract; this is not a claim that every case has been reproduced in-browser.

| Priority / classification | Source evidence | Implication / minimum action |
| --- | --- | --- |
| High — information leak path | [observation.ts](../../src/simulation/observation.ts), `resolveObservationLevel` / `resolveStableObservationLevel`, use Perception and distance only. [agentStatusLabel.ts](../../src/ui/agentStatusLabel.ts) renders CSS2D labels; its `none` branch still returns `observation.questMarker`. NPC/animal callers supply no LOS. | Add a visibility eligibility gate for the **whole live overlay**, including quest/shop/activity icons and highlight. Setting observation level to `none` alone is insufficient. Keep diagnostic bypass explicit and out of normal gameplay. |
| High — target acquisition / tracking gap | [findInteractionTarget.ts](../../src/interaction/findInteractionTarget.ts), `rankInGaze`, ranks distance/facing. [playerCombat.ts](../../src/player/playerCombat.ts), `collectLivingCombatTargets`, filters range and spatial context, but not wall LOS; `resolveRangedAimYaw` follows the current coordinates of a locked candidate. [gameLoop.ts](../../src/app/gameLoop.ts) consumes these paths. | Gate assisted acquisition and live lock tracking, plus gaze/inspect/touch/Quick Actions paths using the same actor information. Revalidate at command execution. Keep projectile collision and damage independent: an undetected actor still exists and can be physically hit by a valid free shot. Do not filter physical hit candidates by player awareness. |
| High — minimap disclosure | [drawMinimap.ts](../../src/ui-vue/lib/drawMinimap.ts) draws loaded settlement NPCs directly from `npc.mesh.position`, bounded by canvas position, without observation/LOS eligibility in that loop. | Include actor dots in the contract. Location discovery/Fog of War and known quest destinations remain separate; do not erase known places when a person becomes occluded. Audit full-map actor consumers before claiming coverage. |
| High — ownership hazard | [NpcAgent.ts](../../src/ai/NpcAgent.ts), `hasLootableCorpse` and `resolveCorpseLifecycle`, read root `mesh.visible`; concealment writes it. | Never store gameplay visibility on that root. Preserve corpse, loot and lifecycle authority. Label suppression must not skip the label controller's existing shadow-distance work. |
| High — unsuitable obstacle shortcut | [collision.ts](../../src/world/collision.ts) has circle/OBB movement shapes with optional vertical bounds and a local 3×3 bucket query. [houseBuilder.ts](../../src/settlement/houseBuilder.ts), `buildHouseWallCollidersLocal`, deliberately keeps a window wall as a full movement collider. | Movement blockage is not sight blockage. A full-height footprint would hide actors through windows/above low walls. A local query at one endpoint is not a segment broad phase; account for blocker extents crossing cells. |
| Medium — reusable perception exists | [playerAwareness.ts](../../src/fauna/playerAwareness.ts) already combines distance, facing, day/night, forest and `sneakDetectionMultiplier`. [AnimalAgent.ts](../../src/fauna/AnimalAgent.ts), `senseEnvironment`, caches a deterministic roll on a 0.5 s timer and retains alert state. No geometry LOS input appears in this path. | Extend this policy; do not add another stealth/detection probability alongside it. Separate fresh sight from retained alertness. Existing tests cover modifier ordering, not wall LOS or full frame-rate invariance. |
| Medium — AI is not one generic detector | [npcAnimalThreat.ts](../../src/ai/npcAnimalThreat.ts) senses bounded XZ threat candidates; [preyAlertPerception.ts](../../src/fauna/preyAlertPerception.ts) mixes vocal alerts and live hunting signals. | Classify sight, hearing, direct damage and remembered danger before adding LOS. A visual wall must not indiscriminately suppress barks, retaliation or assistance. |
| Medium — light rendering cannot be authority | [pointLightBudget.ts](../../src/world/pointLightBudget.ts) can set real lights' `visible=false` under a presentation budget. | Read lit/fuel/equipment/time state from owning systems, not active Three.js lights, shadow quality or screen brightness. Quality settings must not change detection. |

**Freshness against the October 30 assessment:** [occludedActorCohort.ts](../../src/perf/occludedActorCohort.ts) now exists as Q16 diagnostic tooling: settlement mesh rays, a 3×3×3 box sample grid and a scoped camera-pass mask. It is **not** a production gameplay detector. Even 27 blocked samples do not prove that every fragment of a moving silhouette is occluded; narrow openings can fall between samples. Reuse diagnostics for attribution, not their sampled result as a correctness guarantee.

### 3. V2 donor assessment: retain patterns, reject incompatible semantics

Directly inspected [perception.ts](https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/src/game/sim/perception.ts), [detour.ts](https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/src/game/sim/detour.ts), [actors.ts](https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/src/game/render/actors.ts) and [perception.test.ts](https://github.com/jm-sky/seedvales-v2/blob/9ba54815493b886eb1bdce032f5209aeb2856c37/src/game/sim/perception.test.ts).

- **Useful:** spatial candidate filtering; pure detection inputs; separation of recognition from contact state; stable-ID contacts; frozen last-known coordinates with expiry; shared contact consumers. Borrow those concepts selectively.
- **Not general LOS:** `wallBlocksSight` intersects inset rotated XZ building rectangles, ignores small/non-collidable footprints and skips a building containing the viewer. It cannot represent window openings, low walls or outdoor terrain/rock occlusion. Cave LOS is a separate grid policy. Do not port these shortcuts.
- **Wall bypasses:** `detects` accepts very close actors before LOS. `alwaysKnown` accepts companions and **any animal with a truthy owner**, not specifically only player-owned animals. Neither is acceptable as an exemption from physical sight or permission to reveal current positions.
- **Model disappearance:** `Actors.update` draws normal non-player actors only for current contacts. V2 range/light failure therefore suppresses models too. That conflicts with V1's “no magical invisibility” requirement.
- **Ghosts are optional product behavior:** V2 creates procedural translucent placeholders at stored coordinates. Do not transfer them by default, nor its loss/reacquisition materialization churn.
- **Test limitation:** V2 tests demonstrate selected policies, not general occlusion correctness. Its indoor-contact test starts with an unknown sleeper; the updater can still age an existing contact into last-known after an actor goes indoors. Read control flow rather than promoting test names/comments to guarantees.
- **No balance port:** V2 Perception/range/light constants use different scales from V1. V1's normalized Perception, fauna species ranges and Sneak must remain the calibration baseline.

### 4. Recommended integration and alternatives

**Recommended first scope:** preserve normal mesh/depth rendering; add a bounded world sight-query contract and player information eligibility, extending existing observation consumers. Introduce light/stealth refinements only after geometry and consumer coverage are correct. A separate gameplay plan should own this under an existing domain (proposed `world`, with `npc`, `fauna`, `ui-input` and combat integration); allocate its ID from the then-current PLANNING register. Keep performance-only draw removal in world-terrain-050.

| Approach | Strength | Cost / limitation | Recommendation |
| --- | --- | --- | --- |
| Depth rendering + bounded sight checks for information | Preserves exact visible silhouettes without all-actor hiding; addresses UI leaks directly. | CPU sight model must agree with important openings; camera versus player-eye semantics need a decision. | First choice. |
| V2-style single-point/footprint model gate | Cheap and easy to cache. | False hiding, door/window/height errors, close-range wall bypasses and visible-body popping. | Reject. |
| Finite-height world primitives + terrain/cave queries | Deterministic, usable headlessly by player and AI; independent of graphics LOD. | Requires explicit sight geometry, aperture semantics and lifecycle maintenance. | Preferred shared contract; reuse existing producers and spatial ownership. |
| Raycast nearby rendered blockers | Accurate for local door/window meshes; useful reference/debug oracle. | Streaming, mesh LOD, alpha textures and scene state make it unsuitable as sole autonomous AI authority. | Bounded local adapter or validation aid, not global scene scans. |
| GPU depth / hierarchical occlusion | Can estimate camera occlusion efficiently at larger scales. | Readback latency, pass complexity and no offscreen/headless AI meaning. | Later performance option only after evidence. |

**World query boundary (proposed, not an existing API):** observer/target XYZ, stable IDs, spatial contexts and a small set of semantic target extents → `clear / blocked / unknown`, reason and world/geometry revision. Let world owners supply walls, moving door leaves, opaque rocks, terrain and cave geometry. `WorldBundle` owns lifetime/wiring; reuse its existing providers and cleanup, not a second actor registry or global visibility manager.

Use finite wall heights and actual apertures. A pane may transmit sight while blocking movement/projectiles; alpha foliage should be soft cover or explicitly modeled opacity, never an opaque bounding box. Terrain tests must account for edited terrain, cutout cave mouths and cave floor/ceiling authority, not just outdoor height samples across a hole. Reuse [WorldSpatialContext](../../src/world/spatialContext.ts). Coordinate with [fauna-045](fauna-045-cave-surface-perception-boundary-and-entrance-awareness.md): its bounded matching-entrance awareness is not a generic cross-cave exemption or a full LOS implementation.

[houseDoors.ts](../../src/settlement/houseDoors.ts) reports logical state changes while `HouseAssembly.update` animates leaves. Invalidate/resolve sight from the actual authoritative door pose during motion, not only a boolean open transition. If authoritative pose is missing, Opus must define that seam; do not infer AI geometry from whether a mesh was rendered.

**Partial exposure:** use a few semantic head/torso/body samples to estimate detection opportunity, accounting for animal size and crouched height. Any clear meaningful sample permits observation; all blocked samples may limit information but are not proof for whole-model removal. Do not skin every vertex on CPU per query. Tiny/slit exposure and identification delay are tuning cases, with the physical silhouette still rendered.

**Information and action contract:** a current eligible contact can feed existing observation levels. On confirmed solid blockage, stop exact live labels, dots and assisted tracking immediately; observation hysteresis must not carry them through the wall. Identity knowledge remains. If memory is selected, retain only the last observed location/time, never update it from hidden actor movement. Use a fresh synchronous query for the selected interaction/assisted target before execution. Sight eligibility is not proof of reach, projectile clearance or permission to attack; preserve those existing checks.

### 5. Lightweight realism without parallel simulation

- **Light:** derive bounded target illumination from day/night plus nearby actually lit torches, fires and lamps. Check occlusion from influential local emitters so a fire behind a wall does not illuminate the target for detection. Clamp combined effects; no GPU luminance readback, per-pixel shadow sampling or eye-adaptation simulation in the first slice. A torch can expose its carrier while helping illuminate nearby targets; it must never see through solid geometry.
- **Distance:** retain smooth, monotonic falloff and existing species/Perception baselines. Separate “I can see a silhouette” from “the UI can identify the actor.” Screen resolution/FOV/graphics draw distance must not modify autonomous perception.
- **Stealth:** reuse active Sneak and movement tiers. Slower motion reduces conspicuousness/noise; crouch changes eye/body exposure where supported. Avoid counting forest, cover, crouch and Sneak several times for the same effect. Existing fauna stealth can already be strong; “lightweight” means incremental, bounded adjustments, not stacking another large multiplier.
- **AI:** a solid blocker prevents **new visual evidence**, including at panic distance. Hearing, damage, existing threat memory and legitimate social knowledge may still trigger behavior. Preserve current decision scorers; feed classified evidence before scoring. Losing sight must not reveal the target's continuously updated position through a retained handle. Audit pursuit consumers when AI integration is selected.
- **Determinism:** share world geometry semantics, not one global player visibility result or identical species thresholds. Use simulation-time scheduling, stable IDs/order and bounded cached state. The current timer reset in `AnimalAgent.senseEnvironment` is not proof of equivalent results under arbitrary dt partitions; test before extending it. Do not change simulation cadence, offscreen catch-up or persistent identity as a side effect.

### 6. Budget, cache and failure policy

Bound work by existing local candidates and information range; early-out by spatial eligibility/range before blocker tests. Traverse segment-covered spatial cells with extent-aware inclusion and deduplication. Use a bounded sample budget, reuse buffers, and avoid all-pairs actors × whole-scene geometry.

Cache by observer/target identity, pose/exposure, spatial context and relevant blocker/light revisions. Invalidate on movement across an aperture, moving doors, construction/destruction, terrain edits, chunk/provider replacement, death, teleport and WorldBundle rebuild. Clear transient references on unload; stable IDs must not let an old cache entry attach to a replacement generation.

Prioritize imminent interactions, moving silhouettes and nearby threats. Background observations may be staggered; **4 Hz from the older performance experiment is not an accepted gameplay latency**. Define maximum stale age and demonstrate corner/door responsiveness. Do not make authoritative AI outcomes depend on a nondeterministic wall-clock budget or rendering frame rate.

Failure policy must differ by consumer:
- **Rendering optimization:** unknown/stale → draw normally; depth still protects opaque-wall pixels.
- **Player information:** unknown → no new precise disclosure or assisted lock until checked; known identity is retained. Invalidating geometry drops stale live disclosure.
- **AI:** unknown is not “target absent.” Retain legitimate memory/nonvisual evidence and retry on deterministic scheduling; do not despawn, stop simulation or fabricate fresh sight.

Measure query count, cache hit/invalidation rate, worst staleness, CPU p50/p95/max, allocations and whole-frame p95 in open terrain, dense village and moving-door scenes. Benchmark gameplay cost separately from optional draw savings; no FPS improvement is claimed. Preserve existing native/WSL baseline separation.

### 7. Acceptance cases for the next plan

| Scenario | Required observable result |
| --- | --- |
| Solid wall, very short distance, friendly/owned/hostile actor | No new visual disclosure through the wall; ownership and proximity cannot bypass geometry. Legitimate sound is a separate stimulus. |
| Corner emergence, thin slit, exposed head/limb/weapon, large animal | Visible body fragments remain; no whole-body popping from failed point tests. Prompt/identification rules have bounded, documented latency. |
| Open/closed/animating door, window, low wall, elevated observer | Sight follows apertures, pose and height, not movement-footprint shortcuts. |
| Ridge, rock, terrain edit, cave roof/mouth and stacked spaces | No through-ground evidence; matching open mouth handled without cross-cave leakage. |
| Day/night, lit/unlit torch, fire behind wall, Sneak/movement tiers | Monotonic, bounded modifiers; physically exposed models remain rendered; no duplicate stealth penalty. |
| Label icons, bars, minimap dots, inspect, Tab/soft lock, aim assistance | Same live-disclosure policy; no hidden position updates after losing sight. Test mouse, keyboard and touch consumers. |
| Free attack / projectile / damage | Awareness does not erase hit candidates or grant obstacle penetration. Acquisition, collision and damage retain separate authority. |
| Offscreen NPC↔fauna encounters and nonvisual alerts | Camera rotation/detachment and graphics presets cannot change simulation results. Sound/damage can matter without visual confirmation. |
| Death, loot, corpse concealment, unload/reload, save/load, rebuild, time-skip | Stable identity/lifecycle and existing catch-up preserved; no stale contacts or corpse resurrection. |
| Main/shadow passes and debugging | Shadows remain physically plausible under existing shadow policy; presentation masks are restored. Debug disclosure is explicit. |

Extend existing observation/playerAwareness tests with these contracts and use focused geometry/integration fixtures. Compare simulation outcomes with a fixed world and different camera/render settings. Source tests alone cannot accept visual popping, realism or performance.

### 8. Author decisions and Opus handoff

No answers are assumed; these questions are recorded here as requested, not blockers to completing this documentation review.

1. **Third-person camera:** may the player see a body that the camera can see around a corner but the character's eyes cannot? Recommended initial rule: normal camera image, character-eye LOS for actionable information; no body suppression. Strict character-eye concealment would require a separate visibility-mask design and explicit agreement on partial silhouettes. This is the principal product ambiguity.
2. **AI rollout:** should the first gameplay slice fix player information only, then integrate shared sight with fauna/NPCs, or must reciprocal stealth/AI changes ship together? Recommend staged delivery with explicit pending AI scope; player-only work does not satisfy reciprocal stealth.
3. **Memory and exceptions:** no new last-known markers initially, or a clearly stale map-only contact? Recommend no V2 world ghosts. Decide whether companions/quest actors get a deliberately nonvisual navigation aid; do not silently exempt their live body/label/dot from LOS.
4. **Cover:** should dense bushes merely lower detection, or fully block sight above an author-defined density? Recommend soft cover initially; opaque trunks/rocks/walls remain hard blockers. Precise thresholds need visual calibration, not a new feature decision.
5. **Torch tradeoff:** confirm that carrying light makes the player easier to detect as well as helping nearby observation. Recommend yes, with mild effects consistent with visible illumination.

**Opus next:** validate these pinned findings against current main; resolve the world sight provider and door/light ownership seams; audit all disclosure/action consumers and pursuit memory; settle the author questions; then create the bounded gameplay plan and dependency links. Reuse fauna-045 rather than absorbing or contradicting its scope. Leave A1′ status, performance gates and unrelated simulation/graphics work unchanged. Do not implement from this review alone.

## Verification

AI agent wykonuje odpowiednie testy/typecheck/build. Browser benchmark i manualne sprawdzenie poppingu/cullingu wykonuje użytkownik.

## Recon do wykonania przed przejściem na planned

Uzupełnić plan o aktualne pliki, symbole, ownership presentation state, asset families, benchmark baseline i konkretny mechanizm o najwyższym ROI.

> **Zrób git commit i push do main, rebase jeżeli trzeba**
