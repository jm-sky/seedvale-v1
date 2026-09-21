# Implementation Notes: Small quest offer scope and prioritization

## Dependency is a real blocker

- Implement only after `quests-progression-069` lands. Current `main` still has the pre-069 contract: `QuestOfferPolicy` has only `priority/urgency/exposure`, and `QuestManager.offerRankSignal()` still infers `isStoryContinuation` from any `quest_outcome` prerequisite.
- 069 explicitly replaces that inference with authored `offer.pacing: 'continuation'` and inserts giver cooldown filtering before ranking. Do not implement 074 against today's inferred-continuation shape and then preserve it accidentally.
- After 069, recon only the touched offer-policy/ranking sections before coding. Expected seam remains `eligibleNotOfferedCandidates()` → `offerRankSignal()` → `rankQuestOfferCandidates()` → `selectableOfferIds()`.

## Exact ownership and minimal shape

- `scope` belongs on `QuestOfferPolicy` in `src/quests/quests.ts`; it is immutable definition metadata, not `QuestProgressEntry` or `QuestManagerInitial` state. No save-data work is needed.
- Add a normalized scope to `QuestOfferRankSignal`, rather than making the pure sorter repeatedly inspect optional definition metadata. Recommended runtime signal:
  ```ts
  scope: 'minor' | 'standard' | 'major'
  ```
  with `QuestManager.offerRankSignal()` normalizing missing metadata to `'standard'`.
- Keep `rankQuestOfferCandidates()` pure and deterministic. A tiny local ordinal map in `quests.ts` is enough; do not create a quest difficulty/scoring service.
- Update the existing JSDoc on `QuestOfferPolicy`, `QuestOfferRankSignal` and `rankQuestOfferCandidates()` rather than adding parallel documentation/helpers. Preserve `@domain quests-progression`.

## Ranking placement after 069

The final 069 contract is authoritative. 074 should insert scope **after** urgency and explicit continuation, but **before** relation and authored/source priority:

```text
urgency
→ explicit pacing === continuation
→ scope: minor, standard, major
→ relation
→ priority
→ stable id
```

This is intentionally stronger than relation/priority for otherwise admitted ordinary offers: the gameplay requirement is that a small local commitment surfaces before a larger one. Urgency and direct narrative continuation remain stronger semantic signals.

Do not move scope into `eligibleNotOfferedCandidates()`. That function owns eligibility/pacing filtering; scope only orders candidates that survived those hard checks.

Do not change `selectableOfferIds()` slot semantics. It should continue to pick from the ranked eligible set and enforce the existing normal/urgent/story and active-cap rules.

## Current authored content: concrete V1 classification

The current definitions support a deliberately narrow first pass. Add `offer: { scope: 'minor' }` (or merge with any post-069 offer metadata) to these authored quests:

- `woda-dla-marka` — one local `interact_well`, 5 coins; this is the reported motivating case.
- `drewno-na-naprawe` — one local gather of 5 branches; existing alternate `already_repaired` outcome does not make the commitment large.
- `ziola-dla-anny` — one gather of 3 herbs.
- `kamienie-dla-piotra` — one gather of 6 stones.
- `zapomniany-cmentarz` — one concrete `interact_landmark` visit, but only on the materialized def when `resolve('cemetery')` succeeds.

Leave the rest implicit `standard` in V1 unless post-069 code materially changed these definitions. In particular, do **not** mark `sprawdz-szlak`, `zwiadowca`, `zagubiona-owca`, hunter chains, cave/treasure stories or generated opportunities as minor just because they may have one stage or a simple objective.

Do not add `scope: 'major'` merely to force current large quests downward. Missing = standard is the compatibility path; explicit major should be reserved for future authored decisions where the distinction is actually needed.

## Cemetery integration detail

`zapomniany-cmentarz` is created inside the landmark materialization path in `src/quests/quests.ts` only after:

```ts
const cemeteryId = resolve('cemetery')
if (cemeteryId) { ... }
```

Put scope on that pushed definition. Do not add availability logic, fallback IDs or a separate cemetery check in `QuestManager`. Its absence from the materialized defs is already the hard guard.

Existing tests already exercise immediate landmark/cemetery behavior. Extend the materialization test surface only enough to assert the scope when cemetery exists and absence/no fabricated quest when it does not.

## Tests: reuse existing seams

### Pure ranking — `src/quests/quests.test.ts`

There is already a local `candidate()` helper for `QuestOfferRankSignal` and tests proving urgency, continuation, relation, priority and stable-id order. Extend that helper with default `scope: 'standard'` and add focused precedence tests instead of building a second fixture system.

Important precedence pairs:

- minor vs standard with all else equal;
- standard vs major;
- urgent major vs normal minor → urgent wins;
- continuation major vs fresh minor → continuation wins;
- minor with lower relation vs standard with higher relation → minor wins;
- minor with lower priority vs standard with higher priority → minor wins;
- same scope → relation, then priority, then id still behave exactly as before.

After 069, rename/adapt tests from `isStoryContinuation` to its final explicit pacing/continuation signal; do not reintroduce the old heuristic just to keep fixtures easy.

### Manager integration — `src/quests/QuestManager.test.ts`

Use synthetic same-giver defs to prove the admitted normal slot selects minor over standard after all 069 eligibility/cooldown checks. One integration test is enough for ranking admission; do not duplicate every pure comparator case here.

Reuse 069 tests for cooldown behavior and add only the cross-check that a minor candidate blocked by giver cooldown stays blocked. Existing availability/source/cap tests should remain authoritative; scope must not require new branches in those mechanisms.

### Authored metadata — `src/quests/quests.test.ts`

Add one compact assertion over the exact V1 minor IDs rather than five repetitive tests. For cemetery, build/materialize landmark quests with and without a cemetery resolver and assert that scope does not alter materialization.

## Validation

Current definition validation does not have a separate offer-policy enum validator visible in the relevant path. TypeScript already constrains authored literals. After 069, check whether it introduced runtime validation for `pacing`; if there is now a centralized offer-policy validator, extend it for `scope`. Otherwise do not create runtime validation solely for this field.

## Pitfalls

- Do not use numeric `offer.priority` to emulate scope. Priority is already a source/authored tie-break and remains useful inside one scope.
- Do not infer scope from stage count, objective type, reward, distance or source kind.
- Do not persist scope or add migration/version work.
- Do not change the one-normal-offer-per-giver exposure rule or the max-two ordinary active/ready capacity.
- Do not let minor bypass 069 cooldown, decline suppression, source validity or authored availability.
- Do not mass-tag generated opportunities. Their world/source authority and existing `priority/urgency` remain separate concerns.
- Do not solve deer population, animal death provenance or quest-specific spawning here.

## Suggested implementation order

1. Confirm 069 is implemented and inspect its final `QuestOfferPolicy`, rank signal, candidate filtering and tests.
2. Add `scope` + normalized rank signal and comparator precedence in `quests.ts`.
3. Wire normalization in `QuestManager.offerRankSignal()`; avoid other manager changes unless 069 moved this seam.
4. Add the five verified V1 authored `minor` classifications.
5. Extend pure ranking tests, then one manager admission/cooldown cross-check and compact authored metadata/materialization assertions.
6. Run the plan's technical verification; browser verification remains User-owned.

No new state owner, persistence DTO, worker, UI or world-system integration should be necessary.
