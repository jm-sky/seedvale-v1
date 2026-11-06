# GA-003 → Claude Opus validation handoff

- **Date:** 2026-11-06 (Europe/Warsaw)
- **Repo / branch:** `jm-sky/seedvale-v1` / `main`
- **Task:** GA-003 documentation vs code (three authorized slices)
- **Ask:** Independently validate findings **GA-003-F01 … F07**. Do not implement fixes unless Jan explicitly asks. Do not change Revival priorities.
- **Evidence hierarchy:** code/tests > notes/reviews > plans > state/arch > vision.
- **Findings status today:** all `unverified` until you (or another independent reviewer) confirm/reject them.

## Pins used by Grok audits

| Slice | Report | Audit pin (SHA) |
| --- | --- | --- |
| STATE deferred list | [2026-11-06--GA-003--state-deferred-section.md](./2026-11-06--GA-003--state-deferred-section.md) | `a75dcdfb29cd95d9634f5c87f6943daa428f44be` |
| Dev tooling | [2026-11-06--GA-003--dev-tooling.md](./2026-11-06--GA-003--dev-tooling.md) | `3c249cb62ddde343be2b654fae43315a484f8054` |
| Items / player | [2026-11-06--GA-003--items-player.md](./2026-11-06--GA-003--items-player.md) | `3c249cb62ddde343be2b654fae43315a484f8054` |

Re-check claims at the pin named in each report (or at current `main` if Jan asks for a refresh). Quote file:symbol evidence.

## Finding checklist

### F01 — “carried inventory” wording (deferred-section)
- **Claim:** STATE says NPC/animal execution state including “carried inventory” is never persisted.
- **Grok note:** Code distinguishes transient `NpcAgent.carried` from persisted `personalInventory` / `transportCargo`.
- **Validate:** Confirm the distinction at the deferred-section pin; decide if STATE needs a wording fix only.
- **Do not:** Treat as a save-loss bug without proof.

### F02 — “trade / player crafting” blanket bullet (deferred-section)
- **Claim:** Inter-settlement trade and player crafting are deferred.
- **Grok note:** Food export logistics and player campfire cooking exist; general priced trade / recipe crafting not established.
- **Validate:** Trace trader food export + cooking paths; keep general trade/crafting separate if you agree.

### F03 — `docs:sync` vs CODE_INDEX navigation generator (dev-tooling)
- **Claim/docs gap:** Documented `docs:sync` omits the actual CODE_INDEX navigation-block generator.
- **Validate:** Compare CLAUDE.md / STATE tooling text to `package.json` scripts and the real CODE_INDEX updater entrypoint.

### F04 — `tsc` vs `vue-tsc` (dev-tooling)
- **Claim:** STATE recommends plain `tsc`; project typecheck uses Vue-aware `vue-tsc`.
- **Validate:** package.json / CI / CLAUDE vs STATE wording.

### F05 — settlement-shot software-renderer guard on Windows (dev-tooling)
- **Claim:** Documented rejection of software renderer is skipped on Windows.
- **Validate:** Read `tools:settlement-shot` / script source; confirm platform branch. No need to run the shot unless Jan asks.

### F06 — capability-driven tool gates vs fishing_rod Quick Action (items-player)
- **Claim:** Docs say all tool gates are capability-driven; Quick Actions still check a concrete `fishing_rod`.
- **Grok note:** No gameplay defect demonstrated—documentation/contract precision issue unless you find a real bypass/block.
- **Validate:** Find the Quick Action gate and capability registry; confirm whether the hard-coded id is intentional exception or doc overclaim.

### F07 — `iron_rod` availability text (items-player)
- **Claim:** player-systems (or equivalent) still says `iron_rod` is only available from the home merchant.
- **Grok note:** Blacksmith production and sale of owned rods appear to exist.
- **Validate:** Trace item sources (merchant stock, blacksmith recipes, sell paths) vs the doc sentence.

## Explicit non-goals for this validation pass

- No geography / fauna persistence / combat / rendering–performance deep dives (many deferred bullets were `excluded (overlap)` on purpose).
- No commits from Opus unless Jan asks.
- No expanding into GA-001 dead-code deletion.
- Tests were **not** executed by Grok; reading assertions is fine, running suites only if Jan wants.

## Suggested return format

For each F01–F07: `confirmed` | `rejected` | `needs-narrowing`, 2–5 lines of evidence (path + symbol), and whether a docs-only edit is enough. Update finding validation status in the three reports only if Jan wants those edits in-repo.