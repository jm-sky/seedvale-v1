# Quest Curation and Q-012 Decisions

**Created at:** 2026-10-10  
**Created by:** ChatGPT Luna

**Status:** Accepted author decisions; quest-by-quest reconciliation remains planned work.

## Q-012 — Starting-settlement cast

**Decision: option A.** Preserve the four reserved identity pins from `npc--001`:

- Mark Hornblower — guard.
- Kate Hornblower — trader and Mark's wife.
- Ann Woodward — farmer.
- Peter Woodward — woodcutter.

Do not merge these people with the similarly placed v2 cast slots Ralph Fieldman, Miles Hewer and Stephen Chapman. Treat those three as separate people if/when the relevant v2-authored content is curated into SeedVale. Similar profession or narrative role is not identity evidence.

The reserved names/roles are continuity pins, not a requirement to instantiate every imported proposal literally. Keep reservation IDs stable.

## Guard identity across v1 and v2 quest content

The starting settlement has **one reserved home-guard identity: Mark Hornblower**. Reconcile v1 and v2 quest content around that shared world cast; do not create a second guard merely to preserve separate versions of quest content.

A quest may point to Mark when it actually concerns the home guard or his own business. Do not automatically reassign every quest featuring a guard to Mark: first check its giver, narrative ownership, prerequisites, world-state effects and identity evidence. Other guard characters may only be added if a separately justified world/design need is established; version merging alone is not such a reason.

## What “merge v1 and v2” means

- SeedVale must not keep v1 and v2 as two parallel, unreconciled quest inventories.
- v1 is a source of gameplay content; v2 is a source of ideas/content to evaluate against SeedVale's vision and roadmap.
- Reconcile overlapping incidents, entity/state claims, rewards, and NPC identity. Avoid duplicate quest completion or stacked rewards for the same incident.
- Do **not** wholesale merge or delete records simply because the versions overlap. For each relevant quest, record a reasoned `keep`, `merge`, or `retire` decision after reviewing evidence.
- This is domain curation/planning, not permission to implement the quest system before its roadmap milestone (M7).

## Rat Plague — author decision (2026-10-10)

**Decision: merge v1 and v2, with a guaranteed Rat Plague in the player's home settlement.**

- Reconcile v1 and v2 into one curated quest/world-simulation design; do not preserve parallel, competing quest inventories.
- Implement the required mechanics in [quest-feature-proposals.md](../quests/quest-feature-proposals.md), including general building deterioration and systemic rat pressure, plus the optional expanded encounter with a nest, rats and Rat Alpha.
- Poison remains optional; if implemented, warn about and account for risks to other animals.
- The infestation must be connected to authoritative world state, not completed solely through quest-only flags.
- The Rat Plague must occur in the player's home settlement; it is not a chance-only event.
- This is a design/curation decision, not authorization to implement before milestone M7.

## Torch quest curation — author decision (2026-10-10)

**Decision: retire v1 `guard-evening-duty` ("Światła na noc") from the curated quest set.** V2 Q07, "Six Bowls, One Pan", can replace its routine guard-duty/torch-related role; do not preserve the v1 duty as a parallel quest solely because it uses the same torch mechanic.

This decision concerns the authored quest inventory, not implementation timing. It does not retire or merge v2 G03, "Night Torches", whose Hazel/ wolf-fear story is distinct. Any possible interaction conflict between Q07 and G03 remains a separate question to assess from their actual mechanics.

## Still open

The reserved Woodward and Hornblower households each contain spouses with different professions. Decide how a household/home represents two professions before M4 builds homes. This is separate from Q-012's identity decision and does not reopen option A.

## Source

[Review 024 — Quest Consistency Review: v1 and v2](../reviews/2026-10-09--024--quests-v1-v2-consistency-review.md), especially §1, §7.3 and §8. This decision records the author's choice; the review itself remains advisory for unresolved quest-by-quest questions.
