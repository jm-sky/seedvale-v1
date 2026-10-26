# V1 revival — focused Cursor technical review

**Created at:** 2026-10-26  
**Created by:** ChatGPT Astra  
**Status:** Review complete; corrections and targeted runtime verification outstanding.  
**Reviewed HEAD:** `7b5a781db351b3b0c81a38dea00c4e043c39b5e1` (`main`). No unpublished Cursor work inspected.

## Verdict and boundary

| Area | Verdict |
| --- | --- |
| NPC/player models and shoulder repair | **Corrections needed:** confirmed player appearance race (F1). Extraction source addresses shoulder skin from attached heads; shipped binary geometry, bind compatibility and visual result remain unverified. |
| Ground/grass snow | **Qualified technical PASS:** shared ownership and targeted mathematical/weather checks support the implementation. No confirmed material snow defect found in this review; shader execution, streaming visuals and GPU cost remain unverified. |
| UI A–C | **Corrections needed:** F2–F4. V1 handlers and equipment math remain authoritative; author visual PASS is preserved, without implying functional acceptance. |

Followed `CLAUDE.md`, targeted CODE_INDEX/STATE/plan routing, the three requested revival entry documents and complete plans 039–041/053 plus snow notes and character cutover provenance. The complete Git tree has no AGENTS.md. No broad donor research, cleanup, application changes, asset redesign, dependencies or save schema changes. V3 conversation UI, future layered protection, clouds implementation and AI-agent documentation optimization are excluded.

The actual implementation boundary is the **union of the following individual commit diffs**, not every change between the oldest commit and HEAD:

| Slice | Commit / exact changed-file boundary |
| --- | --- |
| Models | [4541513](https://github.com/jm-sky/seedvale-v1/commit/454151315df6a95f55f3db4cabe41f8d4d6010c9): 105 files, including 13 under src; character products/raws/build scripts, assembly/file/types/base garments, NPC appearance/create, player presets/controller and createApp. Binary presence/provenance inspected; contents not decoded. |
| Snow | [9e8014d](https://github.com/jm-sky/seedvale-v1/commit/9e8014d4297916c02b70aca22cc2ab5e01fd1e0d): 12 files, 7 under src (field/tests, terrain material/test, grass, chunk manager, loop). [b645afd](https://github.com/jm-sky/seedvale-v1/commit/b645afd6e019874543b2f4f2289a749de3200479): loop, debug GUI, weather/tests. [b6e836e](https://github.com/jm-sky/seedvale-v1/commit/b6e836eb860b2b9a83d8b0351d2643b905402188): accumulation-window tuning. |
| UI A | [95ce538](https://github.com/jm-sky/seedvale-v1/commit/95ce538bee97e644441942564c25d21d0ebea372): 22 files, 14 under src; details/card/meters/presentation helper/test, demo, tokens and Vite entry plus owning docs. |
| UI B | [a4e8eca](https://github.com/jm-sky/seedvale-v1/commit/a4e8eca66ee5a3286eacb2f70cc69ab78efcb430): 19 files, 12 under src; inventory shell/list, equipment/summary/snapshot adapter, preview/helper test, demo and entry plus docs. |
| UI C | [3a53ece](https://github.com/jm-sky/seedvale-v1/commit/3a53ece6d10a75f2def08121828ae98f7e99d596): 23 files, 10 under src; Quick Actions screen/chips/groups/reasons, Recent state, demo/tokens/entry plus docs. |

Concurrent sprint hysteresis `1c333b4`, staged donor content and historical documentation changes are preserved and not technically reviewed.

## Findings — ranked, all medium (P2)

### F1 — latest requested outfit can lose to an older load; teardown does not invalidate it

**Evidence:** [src/player/PlayerController.ts:840](https://github.com/jm-sky/seedvale-v1/blob/7b5a781db351b3b0c81a38dea00c4e043c39b5e1/src/player/PlayerController.ts#L840) returns for the currently installed appearance **before** incrementing `appearanceLoadToken`. The new kit branch awaits assembly at line 866, then installs if that token still matches. [src/app/createApp.ts:1153](https://github.com/jm-sky/seedvale-v1/blob/7b5a781db351b3b0c81a38dea00c4e043c39b5e1/src/app/createApp.ts#L1153) dispatches without awaiting; [src/app/inventoryWiring.ts:655](https://github.com/jm-sky/seedvale-v1/blob/7b5a781db351b3b0c81a38dea00c4e043c39b5e1/src/app/inventoryWiring.ts#L655) invokes it on equip/unequip. [src/player/PlayerController.ts:1683](https://github.com/jm-sky/seedvale-v1/blob/7b5a781db351b3b0c81a38dea00c4e043c39b5e1/src/player/PlayerController.ts#L1683) does not invalidate appearance or accessory loads on disposal.

**Reproduction:** start Peasant A; request Ranger B with a delayed loader; request A again before B resolves. A returns early, B installs although armor state is back at A. A second controlled case resolves B after `dispose()` and still installs. Both reproduced by executing the exact extracted production methods with a deferred mock assembly loader; this was not a browser/GLB test.

**Impact/correction:** wrong player outfit until another synchronization, and late work against a disposed controller. Track the latest *requested* appearance independently of the installed one; invalidate pending appearance/accessory generations on teardown and release owned stale resources. The early-return/token ordering and disposal gap predate the cutover; the new kit path inherits them. Do not attribute the entire defect to Cursor or redesign assets.

### F2 — live comparison cannot select a second same-kind armor instance

**Evidence:** [src/ui-vue/screens/InventoryScreen.vue:133](https://github.com/jm-sky/seedvale-v1/blob/7b5a781db351b3b0c81a38dea00c4e043c39b5e1/src/ui-vue/screens/InventoryScreen.vue#L133) always compares `group.instances[0]`. [src/ui-vue/screens/InventoryScreenItemList.vue:278](https://github.com/jm-sky/seedvale-v1/blob/7b5a781db351b3b0c81a38dea00c4e043c39b5e1/src/ui-vue/screens/InventoryScreenItemList.vue#L278) emits only `compare-kind`; its declared `compare-instance` event has no emitting control. Equipment slot clicks select already worn instances, while details exposes per-ID equip but no comparison action.

**Reproduction:** own two leather armors of different qualities; wear the first row's instance. “Porównaj” reports “Już założone”; there is no live control to preview the other instance before equipping it. With neither worn, the candidate is still implicitly the first row. The pure helper's same-quality/different-quality math is not the problem.

**Impact/correction:** the delivered comparison cannot represent a player's intended same-kind upgrade. Keep the accepted kind-list; expose comparison for a concrete ID within the existing details/instance controls and identify candidate quality. Do not substitute a donor instance-first inventory or new armor mechanics.

### F3 — nested details covers the inventory but does not isolate keyboard focus

**Evidence:** [src/ui-vue/screens/InventoryScreen.vue:149](https://github.com/jm-sky/seedvale-v1/blob/7b5a781db351b3b0c81a38dea00c4e043c39b5e1/src/ui-vue/screens/InventoryScreen.vue#L149) leaves underlying list/equipment controls mounted and focusable. Details is a sibling backdrop at line 187; no inert state, focus transfer/trap/restore or dialog semantics exist in the shell/card. [src/ui-vue/composables/useOverlayScreen.ts:1](https://github.com/jm-sky/seedvale-v1/blob/7b5a781db351b3b0c81a38dea00c4e043c39b5e1/src/ui-vue/composables/useOverlayScreen.ts#L1) manages Escape stack membership only; [src/ui-vue/App.vue:38](https://github.com/jm-sky/seedvale-v1/blob/7b5a781db351b3b0c81a38dea00c4e043c39b5e1/src/ui-vue/App.vue#L38) handles Escape, not Tab.

**Reproduction:** keyboard-focus a kind row, press Enter to open details, then Tab/Shift+Tab. Focus can remain in the covered list and reach its actions, including drop/unequip; Enter can activate them behind the visible details. This is a source-confirmed focus-ownership defect; browser observation remains outstanding.

**Impact/correction:** hidden actions are keyboard-accessible and the modal is not announced as a modal. Make the covered content inert, move and contain focus in details, restore the originating control on close, and retain Escape details→inventory→close plus quantity-dialog priority. This is a functional/accessibility correction, not reopening accepted appearance.

### F4 — Recent actions bypass category eligibility in presentation

**Evidence:** category visibility uses `hasDiggingTool`, `hasFishingRod` and `hasCarriedContainer` ([src/ui-vue/screens/QuickActionsScreen.vue:337](https://github.com/jm-sky/seedvale-v1/blob/7b5a781db351b3b0c81a38dea00c4e043c39b5e1/src/ui-vue/screens/QuickActionsScreen.vue#L337)). The live Recent index adds shovel/terrain/fishing/container entries unconditionally ([src/ui-vue/screens/QuickActionsScreen.vue:389](https://github.com/jm-sky/seedvale-v1/blob/7b5a781db351b3b0c81a38dea00c4e043c39b5e1/src/ui-vue/screens/QuickActionsScreen.vue#L389)); rows inherit undefined `disabled` at line 441.

**Reproduction:** execute “Wykop dołek”, drop the last digging tool, reopen Q. Łopata disappears but its Recent chip is enabled, closes Q and dispatches. [src/app/createApp.ts:3348](https://github.com/jm-sky/seedvale-v1/blob/7b5a781db351b3b0c81a38dea00c4e043c39b5e1/src/app/createApp.ts#L3348) forwards to [src/app/actions/groundActions.ts:340](https://github.com/jm-sky/seedvale-v1/blob/7b5a781db351b3b0c81a38dea00c4e043c39b5e1/src/app/actions/groundActions.ts#L340), whose capability guard rejects it. Fishing/container variants need their corresponding interaction check.

**Impact/correction:** misleading enabled no-op and missing reason; no demonstrated simulation authorization bypass. Apply the same current eligibility to both category and Recent entry, including disabled reason, and guard dispatch. Recent stores keys/labels rather than old callbacks, so stale callback retention is **not** the established defect.

## Positive evidence and remaining risks

**Models.** `build-head-variants.mjs:95–113` applies the neck cut and `dropArmWeightedTris` before variant warp/packing. `head-cut.mjs:65–106` removes a Superhero-material triangle if **any** vertex's dominant influence belongs to the arm chain, preserving head/neck/spine-weighted skin. This addresses residual skin protruding through clothing when heads are attached, not a garment hole. Both sexes × Base/Lean/Round/Warm products are present. Runtime assembly rebinds head/hair/garments to named body bones using source inverses/bind matrix; missing bones warn and fall back to source bones (`assembleCharacter.ts:45–76`). That fallback and donor rest-transform assumptions need binary/animation confirmation, not an asserted failure. NPC role/age/sex selection remains deterministic, including existing female outfit coercion and skirts. Settlement pending-load continuations discard stale settlements (`SettlementsManager.ts:1072–1080,1174–1181`); NPC disposal respects loader-shared geometry/material flags. Player swaps remount hand/armor attachments, but need the F1 lifecycle correction. Also inspect ownership of assembly tint clones and per-instance skeleton textures during a bounded repeated-swap check; no GPU leak magnitude was measured.

**Snow.** [src/terrain/chunkManager.ts:1264](https://github.com/jm-sky/seedvale-v1/blob/7b5a781db351b3b0c81a38dea00c4e043c39b5e1/src/terrain/chunkManager.ts#L1264) binds grass to the terrain's actual `uSnowAmount` object; updates mutate its value, and streamed/rebuilt meshes use shared materials. Ground uses the world-position threshold with slope/altitude/above-water masks; grass uses world-space instance origin, altitude bias, height burial, tip frost and discard, without placement regeneration. Biases differ intentionally; existing consistency tests cover near-flat ground, not every slope/shore. Weather remains deterministic lookback from seed/time in auto mode. The forced-weather integrator is debug-only, uses the shared accumulation/melt step and resets on auto; `?snow=` overrides presentation only. Shader injection retains wet/puddle suppression and advances the program key. No new per-chunk snow authority or CPU geometry work each frame was found. `parseSnowParam()` does allocate URLSearchParams per frame (`gameLoop.ts:2648`); cache it if appropriate, but its cost and shader noise cost were not measured. No GPU improvement claim.

**UI preservation.** A delivers details/card/meters and a demo; B delivers kind-list + six-slot equipment, scalar comparison and nested details/demo; C delivers twelve-category MenuPanel-style Quick Actions, Recent and demo. Details retains per-ID equip, armor equip/unequip, sharpen, sell and primary selection; drop remains intentionally kind/count. Consume/read/throw/trap/chest/tent actions route to V1 callbacks. `createApp.ts:3205` refreshes groups, IDs, mass/size and equipped slots from live owners; `store.ts:1279–1366` binds and refreshes those snapshots. Preview uses V1 armor-quality and modifier composition; no donor demo mutation was found in live imports. Typed resistance/DPS/wear/layers remain unavailable placeholders. Character, HUD/trade/map redesign and layered/body-area protection are deferred. V3 conversation UI is not introduced. Escape routing is source-supported; pointer-lock, full teardown/rebinding and a new-save round trip are not end-to-end verified.

## Verification ledger

**Executed here, on pinned source copies:** Vitest **4.1.10**, Node **24.22.1**, temporary minimal Node-environment config, no repository setup/config hooks:

- `snowField.test.ts`: 8 PASS; `characterFiles.test.ts`: 4 PASS.
- `weather.test.ts`: 32 PASS, including forced weather.
- `equipmentPreview.test.ts`: 6 PASS; `buildItemDetailPresentation.test.ts`: 5 PASS.
- Total **55 existing tests PASS**. UI helper suites initially could not collect because the partial checkout lacked Three.js; after supplying isolated `three@0.185.1` / `simplex-noise@4.0.3` tooling dependencies they passed. This was an environment failure, not an application defect. No project dependency or lockfile changed.
- Two F1 controlled asynchronous reproductions passed their assertions of the defective behavior. Temporary harness extracts the production methods, strips TypeScript and supplies loader/render mocks; no application edits or committed test changes.
- Reviewed individual commit file lists, current direct consumers/lifecycle owners and documentation links. No full typecheck/build, material-shader suite, binary asset on-disk suite or full UI interaction suite executed.

**Historical, not rerun:** snow implementation notes record focused Vitest and Vite PASS, with full vue-tsc/build blocked then by `mountCompareGarments.test.ts`. This review does not claim that historical blocker still exists. UI plans list checks, not a complete execution ledger.

**Author acceptance, unchanged:** plans/proposals 039–041 record **visual PASS for A–C**; C includes centered MenuPanel, Recent, category header and readable muted disabled chrome. This is not functional, save/load, lifecycle or comprehensive accessibility acceptance. No independent shoulder visual acceptance or GPU measurement was obtained.

**Limits / smallest follow-up:** HTTPS clone lacks credentials; source was retrieved at the pin through GitHub API. No running game URL or usable full asset checkout was supplied. The repository browser guide was read; no headless browser was launched. Use the supported visible browser on the author's machine: (1) reproduce F1 with cold/throttled kit loading and equip→unequip plus teardown; inspect male/female Peasant, affected professional outfit/skirt and all head variants in idle/walk/attack with hand/armor attachments; (2) fixed-seed snow steps 0/.25/.5/1→0, a slope/shore and one chunk unload/rebuild, then forced snow→clear→auto; (3) F2–F4 keyboard/pointer interactions, quantity dialog, Q/Escape/pointer lock, Pause→Actions, world rebind and a **new** save/load. Existing-save compatibility is not required. These are targeted checks, not a new soak-test backlog.

## Proposed order and Opus handoff

**Proposal for author discussion, not an approved implementation queue:**

1. Correct F1 and UI F2–F4 before treating delivered slices as functionally accepted; keep model correctness and modal/action ownership ahead of more screens.
2. Run the bounded checks above on those corrections, then resume selected revival work. Clouds can proceed without A/B; their integration has no dependency on future armor. Discuss remaining atmosphere/travel/content order with the author rather than assuming performance-first.
3. Set the current equipment/Character contract before extending layers/body-area protection and associated comparison/appearance. Character D3/D5 consultation and key-name identity mapping remain real decision dependencies. Reuse completed travel/cloud/dog/elder/cemetery evidence.

**Trust:** current V1 state/handlers/modifier math, the 55 scoped checks, explicit author decisions and the precise visual acceptance scope. **Attention:** F1–F4, binary/bind/animation validation and the limited runtime checks above. **Do not re-investigate:** completed broad comparisons, 402-plan cleanup, clouds A/B selection, unowned-dog ownership or accepted A–C styling. Opus retains coordination, implementation planning/author discussion and AI-agent documentation optimization. This dated review owns its evidence; live correction status belongs in existing owners.

Publication is documentation-only on main. Since local Git authentication is unavailable, use the API equivalent of preserving/rebasing onto freshly read main: build on its existing tree, compare expected HEAD and update the ref without force. No application, asset, test, dependency or generated-index changes.
