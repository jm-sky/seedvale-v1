# Review 026 P2 correction verification

Date: 2026-10-27. Reference review: `8fb0f7677ba31e267a1487932a4a24d83eb0d4bb`.
Starting main: `e44932dd61b199fe1b6df4f95fd4dbc2ff90be11`.

## Findings and corrections

| Finding | Existing correction on main | This follow-up |
| --- | --- | --- |
| F1: stale model loads and teardown | PR #112 (`9247b23f`) invalidates appearance, accessory and held-tool generations, guards tint completion and disposes stale owned resources. | Fixed a remaining repeated-request race: replacing an already tinted model retained the old model's `currentTintUrl`. A repeated request could cancel the pending new tint and return early, leaving the replacement untinted. Reset tint bookkeeping on replacement. Added out-of-order accessory replacement/removal and post-dispose tint tests. |
| F2: second same-kind armor | Hybrid inventory (`1f62f4a8`, accepted in `e8ded5f8`) selects exact instance IDs and previews without equipping. PR #112 adds screen-level coverage. | Added exact second-ID equip dispatch checks at desktop and narrow widths. No inventory redesign. |
| F3: keyboard through nested details | Hybrid inventory removed the nested details overlay: inline desktop details; narrow details hides the list and restores selection focus on return. PR #112 covers quantity priority and focus transfer. | Visible-browser verification found the global gameplay keyboard listener still prevented Tab/Shift+Tab inside details. Inventory now stops propagation of these events while preserving native focus navigation and Escape routing. Added regressions with the production keyboard listener attached. |
| F4: stale Recent eligibility | PR #112 shares live tool prerequisites between categories and Recent, presents disabled reasons and rechecks before dispatch. | Reverified all four existing loss/recovery cases: digging, terrain preparation, fishing and carried container, including clicks before Vue patches native disabled state. |

The new repeated-tint and gameplay-keyboard tests failed against the starting production code, then passed with the fixes. Existing review evidence remains historical; this document records the follow-up.

## Test prerequisites

An initial full run found 8,477 passing tests and four unrelated failures. Minimal test-only corrections allow the required suite to run without changing product behavior:

- The asset-browser path-resolver tests assumed optional sibling donor checkouts existed. Mock their file-presence boundary, retain traversal/missing-file assertions and add directory rejection.
- The cloud attachment test expected storm opacity `0.8`, while shipped `CLOUD_VISUAL_PROFILES.storm.opacity` is `0.9`. Align the assertion with the existing profile; no cloud implementation or appearance changes.
- The equipment source verifier runs TypeScript compilation and exceeded the default five-second timeout under full-suite contention, although it passed in isolation. Give this one test 30 seconds.

## Verification

- `pnpm run test --maxWorkers=4`: **705 files / 8,490 tests PASS**. Worker count bounds local resource contention; no tests excluded.
- `pnpm run lint`: **PASS**.
- `pnpm run type-check`: **PASS**.
- `pnpm exec tsc --project tsconfig.equipment-verification.json`: **PASS**.
- `pnpm run build`: **PASS**, with the existing Vite large-chunk advisory.
- Required GitHub CI results are recorded on the pull request before merge.

Visible-browser checks used the local Vite server and a new game with seed `1187199416`:

- World startup and desktop inventory/details opened successfully.
- At 390 × 844, Enter on the selected knife row moved focus to the details heading and removed the covered list from visible/accessibility navigation.
- Before the fix, Tab remained on the heading. After the fix, Tab reached the visible details return control and Shift+Tab reached the visible shell close control.
- Escape returned to the list and restored focus to the selected knife row.

These observations do not verify throttled/cold GLB swaps, full GPU resource lifetime, all outfit/animation combinations, live second-armor acquisition, live tool-loss Recent flows, pointer-lock recovery or a save/load round trip. The corresponding controlled async and UI regression tests are technical evidence, not visual/gameplay acceptance for those unobserved flows.
